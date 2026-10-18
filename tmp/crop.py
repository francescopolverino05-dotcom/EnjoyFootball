#!/usr/bin/env python3
"""Crop + upscale regions of the low-res sheet photos so handwriting is legible."""
import sys
from PIL import Image, ImageEnhance, ImageOps

ASSETS = "/Users/francopolv/.cursor/projects/Users-francopolv-SSCN-Primavera/assets"
OUT = "/Users/francopolv/SSCN-Primavera/tmp/crops"


def main():
    args = sys.argv[1:]
    stem, l, t, r, b = args[:5]
    scale = args[5] if len(args) > 5 else "4"
    out = args[6] if len(args) > 6 else None
    img = Image.open(f"{ASSETS}/{stem}.jpg").convert("L")
    box = (int(l), int(t), int(r), int(b))
    crop = img.crop(box)
    s = float(scale)
    crop = crop.resize((int(crop.width * s), int(crop.height * s)), Image.LANCZOS)
    crop = ImageOps.autocontrast(crop, cutoff=1)
    crop = ImageEnhance.Sharpness(crop).enhance(2.0)
    crop = ImageEnhance.Contrast(crop).enhance(1.6)
    name = out or f"{stem[:14]}_{l}_{t}_{r}_{b}.png"
    crop.save(f"{OUT}/{name}")
    print(f"{OUT}/{name}  {crop.width}x{crop.height}")


if __name__ == "__main__":
    main()
