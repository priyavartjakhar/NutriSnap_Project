"""
Extract Food-101 tar.gz and create meta JSON files for torchvision.
Run this after downloading food-101.tar.gz into the data/ folder.
"""

import json
import os
import tarfile

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT, "data")
TAR_FILE = os.path.join(DATA_DIR, "food-101.tar.gz")
FOOD_DIR = os.path.join(DATA_DIR, "food-101")
META_DIR = os.path.join(FOOD_DIR, "meta")


def extract():
    if os.path.isdir(os.path.join(FOOD_DIR, "images")):
        print("Images already extracted, skipping.")
        return

    if not os.path.exists(TAR_FILE):
        print(f"ERROR: {TAR_FILE} not found!")
        print("Download it first: wget http://data.vision.ee.ethz.ch/cvl/food-101.tar.gz")
        return

    print("Extracting food-101.tar.gz (this takes a few minutes)...")
    with tarfile.open(TAR_FILE, "r:gz") as tar:
        tar.extractall(path=DATA_DIR)
    print("Extraction complete.")


def create_meta_json():
    os.makedirs(META_DIR, exist_ok=True)

    for split in ["train", "test"]:
        json_file = os.path.join(META_DIR, f"{split}.json")
        txt_file = os.path.join(META_DIR, f"{split}.txt")

        if os.path.exists(json_file):
            print(f"  {split}.json already exists.")
            continue

        if not os.path.exists(txt_file):
            print(f"  WARNING: {txt_file} not found.")
            continue

        data = {}
        with open(txt_file) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                class_name = line.split("/")[0]
                if class_name not in data:
                    data[class_name] = []
                data[class_name].append(line)

        with open(json_file, "w") as f:
            json.dump(data, f)

        total = sum(len(v) for v in data.values())
        print(f"  Created {split}.json ({len(data)} classes, {total} images)")


if __name__ == "__main__":
    print("=== Food-101 Dataset Setup ===")
    extract()
    create_meta_json()
    print("=== Done! Run: python3 train.py ===")
