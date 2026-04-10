"""
Food Calorie Estimation Flask App.

Serves a web UI for uploading food photos and returns
top-3 predictions with nutritional information.
"""

import base64
import io
import json
import os
import sys

import numpy as np
import torch
import torch.nn.functional as F
from flask import Flask, jsonify, render_template, request
from matplotlib import cm
from PIL import Image
from torchvision import transforms

# Add src to path so we can import our modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from model import FoodClassifier  # noqa: E402
from nutrition import NUTRITION_DATA, get_display_name, get_nutrition  # noqa: E402

app = Flask(__name__, static_folder="static", template_folder="templates")

# ---------------------------------------------------------------------------
# Food-101 class names (alphabetical order, matching standard Food-101)
# ---------------------------------------------------------------------------
CLASS_NAMES = sorted(NUTRITION_DATA.keys())

# ---------------------------------------------------------------------------
# Device selection
# ---------------------------------------------------------------------------
if torch.backends.mps.is_available():
    DEVICE = torch.device("mps")
elif torch.cuda.is_available():
    DEVICE = torch.device("cuda")
else:
    DEVICE = torch.device("cpu")

# ---------------------------------------------------------------------------
# Image preprocessing (must match training/test transforms)
# ---------------------------------------------------------------------------
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

# ---------------------------------------------------------------------------
# Load model
# ---------------------------------------------------------------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "best_model.pth")
model = None

if os.path.exists(MODEL_PATH):
    try:
        model = FoodClassifier(num_classes=101)
        state_dict = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=True)
        model.load_state_dict(state_dict)
        model.to(DEVICE)
        model.eval()
        print(f"Model loaded successfully from {MODEL_PATH} on {DEVICE}")
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None
else:
    print(f"WARNING: Model file not found at {MODEL_PATH}. "
          "Predictions will not be available. "
          "Train a model first and place best_model.pth in the models/ directory.")


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/")
def index():
    """Render the main page."""
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    """Accept an image upload, run inference, return top-3 predictions."""
    if model is None:
        return jsonify({"error": "Model not loaded. Please train and save a model first."}), 503

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded."}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename."}), 400

    try:
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception:
        return jsonify({"error": "Invalid image file."}), 400

    # Preprocess
    input_tensor = preprocess(img).unsqueeze(0).to(DEVICE)

    # Inference
    with torch.no_grad():
        logits = model(input_tensor)
        probs = F.softmax(logits, dim=1)

    # Top-3
    top3_probs, top3_indices = torch.topk(probs, 3, dim=1)
    top3_probs = top3_probs.squeeze().cpu().tolist()
    top3_indices = top3_indices.squeeze().cpu().tolist()

    # Handle single prediction edge-case (batch dim squeezed to scalar)
    if not isinstance(top3_probs, list):
        top3_probs = [top3_probs]
        top3_indices = [top3_indices]

    results = []
    for prob, idx in zip(top3_probs, top3_indices):
        class_name = CLASS_NAMES[idx]
        nutrition = get_nutrition(class_name)
        results.append({
            "class_name": class_name,
            "display_name": get_display_name(class_name),
            "confidence": round(prob * 100, 2),
            "nutrition": nutrition,
        })

    return jsonify({"predictions": results})


HISTORY_PATH = os.path.join(os.path.dirname(__file__), "models", "history.json")


@app.route("/training")
def training():
    """Return training history JSON."""
    if not os.path.exists(HISTORY_PATH):
        return jsonify({"error": "Training history not found."}), 404
    with open(HISTORY_PATH, "r") as f:
        history = json.load(f)
    return jsonify(history)


@app.route("/training-page")
def training_page():
    """Render the training curves page."""
    return render_template("training.html")


@app.route("/gradcam", methods=["POST"])
def gradcam():
    """Generate a Grad-CAM heatmap overlay for the uploaded image."""
    if model is None:
        return jsonify({"error": "Model not loaded."}), 503

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded."}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename."}), 400

    try:
        img_bytes = file.read()
        original_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception:
        return jsonify({"error": "Invalid image file."}), 400

    # Preprocess for the model
    input_tensor = preprocess(original_img).unsqueeze(0).to(DEVICE)
    input_tensor.requires_grad_(True)

    # --- Grad-CAM via hooks on the last conv block ---
    target_layer = model.backbone.features[-1]
    activations = []
    gradients = []

    def forward_hook(module, inp, out):
        activations.append(out.detach().cpu())

    def backward_hook(module, grad_in, grad_out):
        gradients.append(grad_out[0].detach().cpu())

    fwd_handle = target_layer.register_forward_hook(forward_hook)
    bwd_handle = target_layer.register_full_backward_hook(backward_hook)

    try:
        # Forward pass (gradients enabled for Grad-CAM)
        logits = model(input_tensor)
        pred_class = logits.argmax(dim=1).item()

        # Backward pass for the predicted class
        model.zero_grad()
        score = logits[0, pred_class]
        score.backward()

        # Compute Grad-CAM on CPU (already moved there by hooks)
        grads = gradients[0]          # (1, C, H, W)
        acts = activations[0]         # (1, C, H, W)
        weights = grads.mean(dim=(2, 3), keepdim=True)  # GAP over spatial dims
        cam = (weights * acts).sum(dim=1, keepdim=True)  # (1, 1, H, W)
        cam = F.relu(cam)
        cam = cam.squeeze().numpy()   # (H, W)

        # Normalise to [0, 1]
        cam_min, cam_max = cam.min(), cam.max()
        if cam_max - cam_min > 1e-8:
            cam = (cam - cam_min) / (cam_max - cam_min)
        else:
            cam = np.zeros_like(cam)

    finally:
        fwd_handle.remove()
        bwd_handle.remove()

    # Resize heatmap to match the original image
    orig_w, orig_h = original_img.size
    cam_resized = np.array(
        Image.fromarray((cam * 255).astype(np.uint8)).resize(
            (orig_w, orig_h), Image.BILINEAR
        )
    ) / 255.0

    # Enhance contrast: apply power curve to sharpen hot regions
    cam_resized = np.power(cam_resized, 1.5)
    # Re-normalize after power transform
    cam_max = cam_resized.max()
    if cam_max > 1e-8:
        cam_resized = cam_resized / cam_max

    # Use inferno colormap (cleaner than jet, dark-to-bright)
    colormap = cm.get_cmap("inferno")
    heatmap_rgba = colormap(cam_resized)
    heatmap_rgb = (heatmap_rgba[:, :, :3] * 255).astype(np.uint8)

    # Adaptive blending: stronger heatmap where attention is high
    orig_array = np.array(original_img).astype(np.float32)
    alpha = cam_resized[:, :, np.newaxis]  # (H, W, 1) — 0 to 1
    # Low attention areas: mostly original. High attention: mostly heatmap.
    blend_strength = 0.3 + 0.5 * alpha  # ranges from 0.3 to 0.8
    overlay = ((1.0 - blend_strength) * orig_array + blend_strength * heatmap_rgb.astype(np.float32))
    overlay = np.clip(overlay, 0, 255).astype(np.uint8)

    # Encode as base64 PNG
    overlay_img = Image.fromarray(overlay)
    buf = io.BytesIO()
    overlay_img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    return jsonify({"gradcam": f"data:image/png;base64,{b64}"})


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
