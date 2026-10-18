#!/usr/bin/env python3
"""Composite the printed-name strip with value-column strips, plus detected row rules.

The printed table's horizontal rules are detected in the name strip and redrawn
across the full composite so each handwritten value can be tied to its row.
"""
import sys
import numpy as np
from PIL import Image, ImageEnhance, ImageOps, ImageDraw

ASSETS = "/Users/francopolv/.cursor/projects/Users-francopolv-SSCN-Primavera/assets"
OUT = "/Users/francopolv/SSCN-Primavera/tmp/crops"


def prep(img, box, scale):
    c = img.crop(box)
    c = c.resize((int(c.width * scale), int(c.height * scale)), Image.LANCZOS)
    c = ImageOps.autocontrast(c, cutoff=1)
    c = ImageEnhance.Sharpness(c).enhance(2.0)
    return ImageEnhance.Contrast(c).enhance(1.5)


def find_rules(img, nl, nr, top, bot):
    """Return y offsets (relative to top) of printed horizontal table rules."""
    a = np.asarray(img.crop((nl, top, nr, bot)), dtype=float)
    darkness = (a < 110).mean(axis=1)
    ys, i = [], 0
    while i < len(darkness):
        if darkness[i] > 0.55:
            j = i
            while j < len(darkness) and darkness[j] > 0.55:
                j += 1
            ys.append((i + j - 1) / 2.0)
            i = j
        else:
            i += 1
    return ys


def main():
    stem, nl, nr, top, bot, scale, out = sys.argv[1:8]
    cols = [int(x) for x in sys.argv[8:]]
    nl, nr, top, bot, scale = int(nl), int(nr), int(top), int(bot), float(scale)
    img = Image.open(f"{ASSETS}/{stem}.jpg").convert("L")

    strips = [prep(img, (nl, top, nr, bot), scale)]
    for i in range(0, len(cols), 2):
        strips.append(prep(img, (cols[i], top, cols[i + 1], bot), scale))

    gap = 16
    w = sum(s.width for s in strips) + gap * (len(strips) - 1)
    canvas = Image.new("RGB", (w, strips[0].height), "white")
    x = 0
    for s in strips:
        canvas.paste(s.convert("RGB"), (x, 0))
        x += s.width + gap

    draw = ImageDraw.Draw(canvas)
    for k, y in enumerate(find_rules(img, nl, nr, top, bot)):
        yy = int(y * scale)
        draw.line([(0, yy), (canvas.width, yy)], fill=(255, 0, 0), width=2)
        draw.text((4, yy + 3), str(k), fill=(255, 0, 0))
    canvas.save(f"{OUT}/{out}")
    print(f"{OUT}/{out}  {canvas.width}x{canvas.height}")


if __name__ == "__main__":
    main()
