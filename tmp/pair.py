#!/usr/bin/env python3
"""Paste the printed-name strip beside a chosen value-column strip.

Handwritten grids drift vertically relative to the printed names, so viewing a
narrow value strip next to the names at the same y-range removes row ambiguity.
"""
import sys
from PIL import Image, ImageEnhance, ImageOps

ASSETS = "/Users/francopolv/.cursor/projects/Users-francopolv-SSCN-Primavera/assets"
OUT = "/Users/francopolv/SSCN-Primavera/tmp/crops"


def prep(img, box, scale):
    c = img.crop(box)
    c = c.resize((int(c.width * scale), int(c.height * scale)), Image.LANCZOS)
    c = ImageOps.autocontrast(c, cutoff=1)
    c = ImageEnhance.Sharpness(c).enhance(2.0)
    return ImageEnhance.Contrast(c).enhance(1.5)


def main():
    stem, nl, nr, top, bot, scale, out = sys.argv[1:8]
    cols = [int(x) for x in sys.argv[8:]]
    scale, top, bot = float(scale), int(top), int(bot)
    img = Image.open(f"{ASSETS}/{stem}.jpg").convert("L")

    strips = [prep(img, (int(nl), top, int(nr), bot), scale)]
    for i in range(0, len(cols), 2):
        strips.append(prep(img, (cols[i], top, cols[i + 1], bot), scale))

    gap = 14
    w = sum(s.width for s in strips) + gap * (len(strips) - 1)
    canvas = Image.new("L", (w, strips[0].height), 255)
    x = 0
    for s in strips:
        canvas.paste(s, (x, 0))
        x += s.width + gap
    canvas.save(f"{OUT}/{out}")
    print(f"{OUT}/{out}  {canvas.width}x{canvas.height}")


if __name__ == "__main__":
    main()
