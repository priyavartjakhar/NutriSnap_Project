import argparse
import json
import os
import time

import torch
import torch.nn as nn
from torch.optim.lr_scheduler import CosineAnnealingLR
from tqdm import tqdm

from src.dataset import get_data_loaders
from src.model import get_model

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")


def get_device():
    if torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


def topk_accuracy(output, target, topk=(1, 5)):
    """Compute top-1 and top-5 accuracy."""
    with torch.no_grad():
        maxk = max(topk)
        batch_size = target.size(0)

        _, pred = output.topk(maxk, dim=1, largest=True, sorted=True)
        pred = pred.t()
        correct = pred.eq(target.view(1, -1).expand_as(pred))

        results = []
        for k in topk:
            correct_k = correct[:k].reshape(-1).float().sum(0, keepdim=True)
            results.append(correct_k.mul_(100.0 / batch_size).item())
        return results


def train_one_epoch(model, loader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    top1_total = 0.0
    top5_total = 0.0
    n_batches = 0

    pbar = tqdm(loader, desc="Training", leave=False)
    for images, labels in pbar:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        top1, top5 = topk_accuracy(outputs, labels, topk=(1, 5))
        running_loss += loss.item()
        top1_total += top1
        top5_total += top5
        n_batches += 1

        pbar.set_postfix(loss=f"{loss.item():.4f}", top1=f"{top1:.2f}%")

    return (
        running_loss / n_batches,
        top1_total / n_batches,
        top5_total / n_batches,
    )


@torch.no_grad()
def evaluate(model, loader, criterion, device):
    model.eval()
    running_loss = 0.0
    top1_total = 0.0
    top5_total = 0.0
    n_batches = 0

    pbar = tqdm(loader, desc="Evaluating", leave=False)
    for images, labels in pbar:
        images, labels = images.to(device), labels.to(device)

        outputs = model(images)
        loss = criterion(outputs, labels)

        top1, top5 = topk_accuracy(outputs, labels, topk=(1, 5))
        running_loss += loss.item()
        top1_total += top1
        top5_total += top5
        n_batches += 1

        pbar.set_postfix(loss=f"{loss.item():.4f}", top1=f"{top1:.2f}%")

    return (
        running_loss / n_batches,
        top1_total / n_batches,
        top5_total / n_batches,
    )


def train(args):
    device = get_device()
    print(f"Using device: {device}")

    os.makedirs(MODELS_DIR, exist_ok=True)

    # Load data
    print("Loading Food-101 dataset...")
    train_loader, test_loader = get_data_loaders(batch_size=args.batch_size)
    print(f"Train batches: {len(train_loader)}, Test batches: {len(test_loader)}")

    # Build model
    model = get_model(num_classes=101)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()

    history = {
        "train_loss": [],
        "train_top1": [],
        "train_top5": [],
        "val_loss": [],
        "val_top1": [],
        "val_top5": [],
    }

    best_val_loss = float("inf")
    patience_counter = 0
    best_model_path = os.path.join(MODELS_DIR, "best_model.pth")
    history_path = os.path.join(MODELS_DIR, "history.json")

    # ---------------------------------------------------------------
    # Phase 1: Freeze backbone, train classifier head only
    # ---------------------------------------------------------------
    print("\n" + "=" * 60)
    print("Phase 1: Training classifier head (backbone frozen)")
    print("=" * 60)

    model.freeze_backbone()
    optimizer = torch.optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=args.phase1_lr,
    )

    for epoch in range(1, args.phase1_epochs + 1):
        t0 = time.time()
        train_loss, train_top1, train_top5 = train_one_epoch(
            model, train_loader, criterion, optimizer, device
        )
        val_loss, val_top1, val_top5 = evaluate(
            model, test_loader, criterion, device
        )
        elapsed = time.time() - t0

        history["train_loss"].append(train_loss)
        history["train_top1"].append(train_top1)
        history["train_top5"].append(train_top5)
        history["val_loss"].append(val_loss)
        history["val_top1"].append(val_top1)
        history["val_top5"].append(val_top5)

        print(
            f"[Phase 1] Epoch {epoch}/{args.phase1_epochs} "
            f"| Train Loss: {train_loss:.4f} Top-1: {train_top1:.2f}% Top-5: {train_top5:.2f}% "
            f"| Val Loss: {val_loss:.4f} Top-1: {val_top1:.2f}% Top-5: {val_top5:.2f}% "
            f"| Time: {elapsed:.1f}s"
        )

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
            torch.save(model.state_dict(), best_model_path)
            print(f"  -> Saved best model (val_loss={val_loss:.4f})")
        else:
            patience_counter += 1
            if patience_counter >= args.patience:
                print("  -> Early stopping triggered in Phase 1")
                break

    # ---------------------------------------------------------------
    # Phase 2: Unfreeze top layers, fine-tune with cosine annealing
    # ---------------------------------------------------------------
    print("\n" + "=" * 60)
    print("Phase 2: Fine-tuning (top layers unfrozen)")
    print("=" * 60)

    model.unfreeze_top_layers(n=args.unfreeze_layers)
    optimizer = torch.optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=args.phase2_lr,
    )
    scheduler = CosineAnnealingLR(optimizer, T_max=args.phase2_epochs)

    patience_counter = 0  # reset early stopping

    for epoch in range(1, args.phase2_epochs + 1):
        t0 = time.time()
        train_loss, train_top1, train_top5 = train_one_epoch(
            model, train_loader, criterion, optimizer, device
        )
        val_loss, val_top1, val_top5 = evaluate(
            model, test_loader, criterion, device
        )
        scheduler.step()
        elapsed = time.time() - t0

        history["train_loss"].append(train_loss)
        history["train_top1"].append(train_top1)
        history["train_top5"].append(train_top5)
        history["val_loss"].append(val_loss)
        history["val_top1"].append(val_top1)
        history["val_top5"].append(val_top5)

        print(
            f"[Phase 2] Epoch {epoch}/{args.phase2_epochs} "
            f"| Train Loss: {train_loss:.4f} Top-1: {train_top1:.2f}% Top-5: {train_top5:.2f}% "
            f"| Val Loss: {val_loss:.4f} Top-1: {val_top1:.2f}% Top-5: {val_top5:.2f}% "
            f"| LR: {scheduler.get_last_lr()[0]:.6f} "
            f"| Time: {elapsed:.1f}s"
        )

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
            torch.save(model.state_dict(), best_model_path)
            print(f"  -> Saved best model (val_loss={val_loss:.4f})")
        else:
            patience_counter += 1
            if patience_counter >= args.patience:
                print("  -> Early stopping triggered in Phase 2")
                break

    # Save training history
    with open(history_path, "w") as f:
        json.dump(history, f, indent=2)
    print(f"\nTraining history saved to {history_path}")
    print(f"Best model saved to {best_model_path}")
    print(f"Best validation loss: {best_val_loss:.4f}")


def parse_args():
    parser = argparse.ArgumentParser(
        description="Train EfficientNetV2 on Food-101 dataset"
    )
    parser.add_argument(
        "--batch-size", type=int, default=32, help="Batch size (default: 32)"
    )
    parser.add_argument(
        "--phase1-epochs", type=int, default=5,
        help="Number of epochs for Phase 1 - head training (default: 5)"
    )
    parser.add_argument(
        "--phase2-epochs", type=int, default=25,
        help="Number of epochs for Phase 2 - fine-tuning (default: 25)"
    )
    parser.add_argument(
        "--phase1-lr", type=float, default=1e-3,
        help="Learning rate for Phase 1 (default: 1e-3)"
    )
    parser.add_argument(
        "--phase2-lr", type=float, default=1e-4,
        help="Learning rate for Phase 2 (default: 1e-4)"
    )
    parser.add_argument(
        "--patience", type=int, default=5,
        help="Early stopping patience (default: 5)"
    )
    parser.add_argument(
        "--unfreeze-layers", type=int, default=50,
        help="Number of backbone layers to unfreeze in Phase 2 (default: 50)"
    )
    return parser.parse_args()


if __name__ == "__main__":
    train(parse_args())
