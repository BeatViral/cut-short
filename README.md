# CUT/SHORT brand assets

![Brand colour variations](brand/preview.png)

Primary: **black on electric yellow**. Secondary: **white on cobalt blue** and **black on hot pink**.

The approved concept has been rebuilt as custom vector outlines. No font installation is needed. The diagonal cut on the first T leaves a visible gap beside the oversized slash.

## Files

- `brand/svg`: scalable horizontal and stacked wordmarks, plus standalone slash. Five treatments: primary, blue, pink, transparent black and transparent white.
- `brand/png`: horizontal widths 160, 320, 640, 1280, 2560 and 4096 px; stacked and slash widths 128, 256, 512, 1024 and 2048 px. Black/white files have alpha transparency.
- `brand/webp`: lossless web exports at 1280 px wide.
- `brand/icons`: SVG favicons and square PNG slash icons at 16, 24, 32, 48, 64, 128, 180, 192, 256, 512 and 1024 px; multi-resolution ICO files.
- `brand/social`: 1080 x 1080 square, 1200 x 630 landscape and 1080 x 1920 story graphics, in all three brand colours.
- `brand/colors.json`: exact colour values.

## Colour values

| Colour | HEX | RGB |
| --- | --- | --- |
| Electric yellow | #F5FF00 | 245, 255, 0 |
| Cobalt blue | #0047FF | 0, 71, 255 |
| Hot pink | #FF0099 | 255, 0, 153 |
| Black | #000000 | 0, 0, 0 |
| White | #FFFFFF | 255, 255, 255 |

These are screen RGB masters. Have the printer proof bright colours on the intended paper/stock; select spot inks or an appropriate ICC conversion for the production process.

## Usage

Use yellow as the default identity. Blue and pink are secondary brand variations. Use transparent black or white over other suitable backgrounds. The slash always keeps its geometry and the logo must scale proportionally.

Prefer the horizontal wordmark at 160 px wide or larger; use the standalone slash at favicon sizes. The stacked wordmark is provided for narrow placements. Check small-size legibility in the actual medium. Built-in master padding is 80 design units (about one slash stroke); preserve at least that clear space around the mark.

The rounded corner and blue edge in the supplied screenshot were presentation framing, not part of the core wordmark. No tagline or festival icon is added.

SVG is the resolution-independent master for websites, large posters and print layout. PNG sizes refer to total canvas width including clear space. White transparent artwork may appear blank against a white viewer background.

## Rebuild

Install Node.js dependencies with `npm install`, then run `npm run build`. The `CUT_SHORT_SHARP` environment variable can point to an existing Sharp installation. `scripts/package-brand.py` creates ICO files, verifies PNG integrity and bundles the assets with this guide into `cut-short-logo-suite.zip` (requires Pillow).
