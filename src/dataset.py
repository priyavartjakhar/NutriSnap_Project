import os
from torchvision import datasets, transforms
from torch.utils.data import DataLoader


IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")


def get_train_transforms():
    return transforms.Compose([
        transforms.Resize(256),
        transforms.RandomCrop(224),
        transforms.RandomHorizontalFlip(),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


def get_test_transforms():
    return transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


def get_data_loaders(batch_size=32):
    """Load Food-101 dataset and return train and test data loaders.

    The dataset is automatically downloaded to the data/ folder if not present.

    Args:
        batch_size: Number of samples per batch.

    Returns:
        Tuple of (train_loader, test_loader).
    """
    train_dataset = datasets.Food101(
        root=DATA_DIR,
        split="train",
        transform=get_train_transforms(),
        download=True,
    )

    test_dataset = datasets.Food101(
        root=DATA_DIR,
        split="test",
        transform=get_test_transforms(),
        download=True,
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=0,  # MPS compatibility
        pin_memory=False,
    )

    test_loader = DataLoader(
        test_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=0,  # MPS compatibility
        pin_memory=False,
    )

    return train_loader, test_loader
