import torch.nn as nn
from torchvision import models


class FoodClassifier(nn.Module):
    def __init__(self, num_classes=101):
        super().__init__()
        self.backbone = models.efficientnet_v2_s(
            weights=models.EfficientNet_V2_S_Weights.DEFAULT
        )
        # EfficientNetV2-B0 is not directly available in torchvision;
        # we use efficientnet_v2_s and replace the classifier head.
        # The in_features for the classifier is 1280.
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(1280, num_classes),
        )

    def forward(self, x):
        return self.backbone(x)

    def freeze_backbone(self):
        """Freeze all backbone parameters, leaving only the classifier trainable."""
        for param in self.backbone.features.parameters():
            param.requires_grad = False

    def unfreeze_top_layers(self, n=50):
        """Unfreeze the top n layers of the backbone for fine-tuning."""
        params = list(self.backbone.features.parameters())
        # Unfreeze the last n parameters
        for param in params[-n:]:
            param.requires_grad = True


def get_model(num_classes=101):
    """Create and return a FoodClassifier model.

    Args:
        num_classes: Number of output classes (default 101 for Food-101).

    Returns:
        FoodClassifier model instance.
    """
    return FoodClassifier(num_classes=num_classes)
