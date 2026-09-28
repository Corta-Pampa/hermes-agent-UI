#!/usr/bin/env python3
"""Render the Corta desktop app icons from the official mark.

Source: apps/desktop/src/brand/assets/corta-mark.svg (derived from
corta.fr/assets/logo.svg). Writes the desktop packaging targets that upstream's
scripts/generate_icons.py owns, so electron-builder, the window icon and the
MSIX tiles pick up Corta without touching their config:

    apps/desktop/assets/icon{,-dark}.{png,ico,icns}, icon-mac.png
    apps/desktop/assets/appx/*.png
    apps/desktop/public/apple-touch-icon.png

The mark sits on its own light plate in both appearances (as on corta.fr), so
"-dark" targets are the same art. Rerun after an upstream merge that
regenerates icons:

    .venv/Scripts/python scripts/corta/generate_desktop_icons.py   (Windows)
    .venv/bin/python scripts/corta/generate_desktop_icons.py       (macOS/Linux)
"""

from __future__ import annotations

import io
import re
from pathlib import Path

import resvg_py
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
DESKTOP = ROOT / "apps" / "desktop"
MARK = DESKTOP / "src" / "brand" / "assets" / "corta-mark.svg"
MARK_W, MARK_H = 196, 147.23


def mark_svg(canvas: tuple[int, int], width: float) -> str:
    """The mark, `width` px wide, centred on a transparent canvas."""
    inner = re.sub(r"<\?xml[^>]*\?>|<!--.*?-->", "", MARK.read_text(encoding="utf-8"), flags=re.S)
    height = width * MARK_H / MARK_W
    x, y = (canvas[0] - width) / 2, (canvas[1] - height) / 2
    inner = inner.replace("<svg ", f'<svg x="{x}" y="{y}" width="{width}" height="{height}" ', 1)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {canvas[0]} {canvas[1]}">{inner}</svg>'


def render(canvas: tuple[int, int], width: float) -> Image.Image:
    data = resvg_py.svg_to_bytes(svg_string=mark_svg(canvas, width), width=canvas[0], height=canvas[1])
    return Image.open(io.BytesIO(bytes(data))).convert("RGBA")


def main() -> None:
    square = render((1024, 1024), 900)  # full-bleed platforms (Windows, Linux)
    mac = render((1024, 1024), 824)  # Apple's 824px icon grid
    wide = render((310, 150), 180)

    for suffix in ("", "-dark"):
        square.save(DESKTOP / "assets" / f"icon{suffix}.png", optimize=True)
        square.save(DESKTOP / "assets" / f"icon{suffix}.ico", sizes=[(s, s) for s in (16, 24, 32, 48, 64, 128, 256)])
        frames = [mac.resize((s, s), Image.LANCZOS) for s in (16, 32, 64, 128, 256, 512, 1024)]
        mac.save(DESKTOP / "assets" / f"icon{suffix}.icns", append_images=frames[1:])
        wide.save(DESKTOP / "assets" / "appx" / f"Wide310x150Logo{suffix}.png", optimize=True)
        for name, size in (("StoreLogo", 50), ("Square44x44Logo", 44), ("Square150x150Logo", 150)):
            square.resize((size, size), Image.LANCZOS).save(DESKTOP / "assets" / "appx" / f"{name}{suffix}.png", optimize=True)

    mac.save(DESKTOP / "assets" / "icon-mac.png", optimize=True)
    square.save(DESKTOP / "public" / "apple-touch-icon.png", optimize=True)


if __name__ == "__main__":
    main()
