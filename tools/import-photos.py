"""One-off importer: pulls Adam's galleries from the old Weebly site.

Reads the saved Weebly HTML pages (path in argv[1]), downloads the full-size
originals, writes WebP full + thumbnail copies to public/photos/<slug>/ and
a content index to src/content/gallery.json.

Usage: python3 -I tools/import-photos.py <dir-with-saved-weebly-html>
"""
import io
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from PIL import Image, ImageOps

BASE = "https://kuznialachowice.weebly.com/uploads/"
UA = {"User-Agent": "Mozilla/5.0"}
ROOT = Path(__file__).resolve().parent.parent
FULL_MAX = 1400
THUMB_W = 560

# slug -> saved Weebly page
SOURCES = {
    "bramy-i-ogrodzenia": "bramy-i-ogrodzenia",
    "balustrady-i-kraty": "balustrady-kraty",
    "okucia": "okucia",
    "piece-i-grille": "piece-i-grille",
    "snycerstwo": "snycerstwo",
    "meble-nowe": "nowe",
    "meble-rewitalizowane": "rewitalizowane",
    "prezenty": "prezenty",
    "z-zycia-kuzni": "z-380ycia-ku378nipokazy",
}
SKIP = ("header_images", "background-images", "published/")


def photo_paths(html: str) -> list[str]:
    """Ordered, de-duplicated upload paths (without _orig suffix)."""
    found = re.findall(r'"url":"(2/3/9/2/23927566/[^"]+\.(?:jpe?g|png))"', html, re.I)
    found += re.findall(r"/uploads/(2/3/9/2/23927566/[^'\" )?]+\.(?:jpe?g|png))", html, re.I)
    seen, out = set(), []
    for p in found:
        if any(s in p for s in SKIP):
            continue
        base = re.sub(r"_orig(\.\w+)$", r"\1", p)
        if base in seen:
            continue
        seen.add(base)
        out.append(base)
    return out


def fetch(path: str) -> bytes | None:
    """Download the _orig file (falling back to the thumbnail), retrying politely."""
    stem, _, ext = path.rpartition(".")
    for candidate in (f"{stem}_orig.{ext}", path):
        for attempt in range(4):
            try:
                with urlopen(Request(BASE + candidate, headers=UA), timeout=30) as r:
                    return r.read()
            except HTTPError as err:
                if err.code == 404:
                    break  # not there, try the next candidate
                time.sleep(1.5 * (attempt + 1))
            except Exception:
                time.sleep(1.5 * (attempt + 1))
    return None


def process(args: tuple[str, int, str]) -> dict | None:
    slug, index, path = args
    out = ROOT / "public" / "photos" / slug
    out.mkdir(parents=True, exist_ok=True)
    name = f"{index:03d}"
    if (out / f"{name}.webp").exists() and (out / f"{name}-thumb.webp").exists():
        with Image.open(out / f"{name}.webp") as done:  # resume: already imported
            return {
                "src": f"/photos/{slug}/{name}.webp",
                "thumb": f"/photos/{slug}/{name}-thumb.webp",
                "width": done.width,
                "height": done.height,
            }
    raw = fetch(path)
    if raw is None:
        return None
    img = ImageOps.exif_transpose(Image.open(io.BytesIO(raw))).convert("RGB")
    full = img.copy()
    full.thumbnail((FULL_MAX, FULL_MAX))
    full.save(out / f"{name}.webp", "WEBP", quality=80, method=6)
    thumb = img.copy()
    thumb.thumbnail((THUMB_W, THUMB_W * 2))
    thumb.save(out / f"{name}-thumb.webp", "WEBP", quality=72, method=6)
    return {
        "src": f"/photos/{slug}/{name}.webp",
        "thumb": f"/photos/{slug}/{name}-thumb.webp",
        "width": full.width,
        "height": full.height,
    }


def main() -> None:
    site = Path(sys.argv[1])
    gallery: dict[str, list[dict]] = {}
    with ThreadPoolExecutor(max_workers=3) as pool:
        for slug, page in SOURCES.items():
            html = (site / f"{page}.html").read_text(encoding="utf-8", errors="ignore").replace("\\/", "/")
            paths = photo_paths(html)
            results = list(pool.map(process, [(slug, i + 1, p) for i, p in enumerate(paths)]))
            gallery[slug] = [r for r in results if r]
            print(f"{slug}: {len(gallery[slug])}/{len(paths)}")
    dest = ROOT / "src" / "content"
    dest.mkdir(parents=True, exist_ok=True)
    (dest / "gallery.json").write_text(json.dumps(gallery, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
