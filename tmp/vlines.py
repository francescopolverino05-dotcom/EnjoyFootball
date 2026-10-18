#!/usr/bin/env python3
"""Locate the hand-drawn vertical column rules inside a sheet's table body.

The rules are wavy, so darkness is accumulated per x over a limited y band and
local maxima are reported as candidate column boundaries.
"""
import sys
import numpy as np
from PIL import Image

ASSETS = "/Users/francopolv/.cursor/projects/Users-francopolv-SSCN-Primavera/assets"


def main():
    stem, x0, x1, y0, y1 = sys.argv[1], *[int(v) for v in sys.argv[2:6]]
    a = np.asarray(Image.open(f"{ASSETS}/{stem}.jpg").convert("L").crop((x0, y0, x1, y1)), dtype=float)
    score = (a < 120).mean(axis=0)
    for i, v in enumerate(score):
        bar = "#" * int(v * 60)
        mark = "  <<<" if v > 0.5 else ""
        print(f"{x0 + i:4d} {v:.2f} {bar}{mark}")


if __name__ == "__main__":
    main()
