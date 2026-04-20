// ─────────────────────────────────────────────────────────────────────────
// downscale-images.mjs
//
// A little cleanup script for the images in /public/images. 
// Brooklyn's source files come out of Photoshop and the rendering software huge!
//
// This parses the image folder, finds the big ones, shrinks them down,
// and saves them back where they came from.
//
// How to run:   node scripts/downscale-images.mjs
// When to run:  after I drop new images into /public/images, or any time
// git status shows me a scary list of multi-megabyte files.
//
// ! Heads up: this overwrites the original files. Commit first, always.
// That way if something looks off you can just git checkout and undo.
// ─────────────────────────────────────────────────────────────────────────

// I need: reading folder contents, checking file sizes, reading/writing bytes, deleting, and renaming.
import { readdir, stat, rename, readFile, writeFile, unlink } from "node:fs/promises";
import { join, extname } from "node:path";

// sharp is the image library — it does all the actual resizing and re-encoding 
import sharp from "sharp";

// ─── Knobs I can tweak ────────────────────────────────────────────────────
// Everything above this line is plumbing. Everything below is the stuff
// I'd actually change if I wanted different output — smaller, sharper,
// a different size threshold, whatever.

// Where to start looking. import.meta.url is this file's own path, and
// "../public/images/" backs out one folder and points at the images folder.
// The .replace is a Windows-only fix — on Windows the path comes back
// looking like "/C:/Users/..." with a leading slash that trips up Node's
// file helpers, so we strip it.
// ! On macOS or Linux this .replace is probably unnecessary and might
// even break things — test before trusting it cross-platform.
const ROOT = new URL("../public/images/", import.meta.url).pathname.replace(/^\//, "");

// How big the longest edge of the image is allowed to be after resizing,
// in pixels. Anything bigger gets scaled down so its long side hits this
// number; anything already smaller gets left alone. 2560 covers a 1440p
// screen nicely with some extra room for retina displays.
const MAX_EDGE = 2560;

// JPEG quality on a 0-to-100 scale. 88 is the sweet spot for me — the
// file gets way smaller, and I honestly can't tell the difference by
// eye. Pushing it to 92 or higher balloons the file size back up without
// any visible gain.
const JPEG_QUALITY = 88;

// PNG compression level. 9 is the slowest and tightest. Since this
// script only runs when I tell it to (not on every build), I don't mind
// the extra second or two — smaller files are worth it.
const PNG_COMPRESSION = 9;

// Don't bother with anything under this size. Small files are already
// fine, and re-encoding them can actually make them bigger because of
// header/metadata overhead. 1.5 MB is a safe floor.
const SIZE_THRESHOLD_BYTES = 1_500_000;

// ─── Little helpers ───────────────────────────────────────────────────────

// Walks a folder (and any folders inside it) and returns a flat list of
// every file path inside. withFileTypes means each entry already tells
// me whether it's a folder or a file, so I don't have to make a second
// stat() call just to ask.
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    // Folder? Dive in and spread whatever it finds into my list.
    // File? Just add the path.
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

// Turns a byte count into something human-readable.
// 1_572_864 → "1.50 MB".
function mb(n) {
  return (n / 1024 / 1024).toFixed(2) + " MB";
}

// Is this PNG a photograph, or is it flatter stuff like a floor plan,
// a material board, or a diagram? I need to know because PNGs can be
// compressed in two very different ways:
//
//   • "lossless" mode keeps every color (full 24-bit) — perfect for
//     photos, but the file stays pretty big.
//   • "palette" mode picks 256 colors and throws the rest away — the
//     file gets way smaller, but photos end up banded and splotchy
//     (skies turn into stripes, skin tones go patchy).
//
// So I'd rather not guess by filename — I want to actually peek at the
// image and decide. Here's how:
//   1. Shrink a copy down to 256px wide so it's fast to look through.
//   2. Ask sharp for the raw pixel bytes (no compression, no format —
//      just a stream of R, G, B, (A) numbers).
//   3. Sample every 7th pixel, pack its R+G+B into one number, and
//      collect the unique ones in a Set.
//   4. If I hit more than 200 unique colors, that's clearly a photo.
//      I stop early at 300 so obvious photos don't waste time.
async function isPhotoLikePng(buf) {
  const stats = await sharp(buf, { limitInputPixels: false })
    .resize({ width: 256, fit: "inside" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { data, info } = stats;
  // `data` is just a long line of bytes: R, G, B, (A), R, G, B, (A)...
  // `info.channels` tells me whether it's 3 bytes per pixel (RGB) or
  // 4 bytes per pixel (RGBA, with transparency).
  const seen = new Set();
  const step = info.channels;
  // Jumping by (channels * 7) means I sample every 7th pixel — plenty
  // for a 256px thumbnail, and a lot faster than checking every one.
  for (let i = 0; i < data.length && seen.size < 300; i += step * 7) {
    // Squish the three color values into one single number so each
    // unique color maps to one unique key. `<<` shifts bits to the left,
    // `|` sticks them together — way cheaper than building an "r,g,b"
    // string for every pixel.
    const key = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
    seen.add(key);
  }
  return seen.size > 200;
}

// ─── The actual work ──────────────────────────────────────────────────────

// Grab every .jpg / .jpeg / .png under /public/images. The `i` at the
// end of the regex makes it case-insensitive, so .JPG and .Png also
// get picked up.
const files = (await walk(ROOT)).filter((f) => /\.(jpe?g|png)$/i.test(f));

// Running tallies for the summary at the end — how much we started with,
// how much we ended with, and how many files actually got touched.
let totalBefore = 0;
let totalAfter = 0;
let processed = 0;

for (const file of files) {
  const before = (await stat(file)).size;
  totalBefore += before;

  // If the file's already small, leave it alone. Re-encoding a 400 KB
  // image can actually make it bigger. I still add its size to
  // totalAfter so the summary reflects the whole folder, not just the
  // files I processed.
  if (before < SIZE_THRESHOLD_BYTES) {
    totalAfter += before;
    continue;
  }

  const ext = extname(file).toLowerCase();
  const isPng = ext === ".png";
  // Read the whole file into memory. For these image sizes that's totally
  // fine; if they were gigabytes I'd want to stream instead.
  const buf = await readFile(file);
  // metadata() is cheap — it just peeks at the file header, it doesn't
  // actually decode the image. That gets me the width and height without
  // doing a bunch of work.
  const img = sharp(buf, { limitInputPixels: false });
  const meta = await img.metadata();

  // Build the sharp "pipeline" — a chain of things I want done to the
  // image. Nothing actually happens until I call .toBuffer() at the end.
  // Think of it like writing down a recipe first, then baking the cake
  // all at once.
  //
  //   .rotate()  → respects EXIF orientation. EXIF is a little metadata
  //                tag that phones stick on photos saying "by the way,
  //                this should be displayed rotated 90°" — if I ignore
  //                it, portrait photos show up sideways. Calling rotate()
  //                with no arguments tells sharp to apply it and strip
  //                the tag afterwards.
  //
  //   .resize()  → shrinks so the long edge is at most MAX_EDGE.
  //     width:   only set when the image is wider than it is tall
  //              (so its width is the limiting side)
  //     height:  only set when it's taller than it is wide (or square)
  //     withoutEnlargement → never scale up, only down (a 1920px image
  //                          stays 1920px, it doesn't get blown up)
  //     fit: "inside" → keep the aspect ratio, don't squish it
  const pipeline = sharp(buf, { limitInputPixels: false }).rotate().resize({
    width: meta.width > meta.height ? MAX_EDGE : undefined,
    height: meta.height >= meta.width ? MAX_EDGE : undefined,
    withoutEnlargement: true,
    fit: "inside",
  });

  // Now actually run the pipeline with format-specific settings.
  // `out` becomes the encoded bytes, ready to write to disk.
  // `mode` is just a label I print in the log line so I can see what
  // path each file took.
  let out;
  let mode;
  if (isPng) {
    // For PNGs, peek at the content to decide lossless vs palette.
    const photoLike = await isPhotoLikePng(buf);
    if (photoLike) {
      out = await pipeline.png({ compressionLevel: PNG_COMPRESSION, palette: false }).toBuffer();
      mode = "png-lossless";
    } else {
      out = await pipeline.png({ compressionLevel: PNG_COMPRESSION, palette: true }).toBuffer();
      mode = "png-palette";
    }
  } else {
    // For JPEGs, use mozjpeg — it's a better JPEG encoder that makes
    // smaller files at the same visual quality as the default one.
    // sharp just needs to be told to use it.
    out = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    mode = "jpeg";
  }

  // Safety net: if my "optimized" version somehow ended up bigger than
  // the original, don't save it. Just leave the original alone and move
  // on. This shows up occasionally on PNGs that were already carefully
  // hand-optimized before I touched them.
  if (out.length >= before) {
    console.log(`skip ${file} — rewrite ${mb(out.length)} >= original ${mb(before)}`);
    totalAfter += before;
    continue;
  }

  // ─── Saving safely ──
  // I don't want to write straight over the original file, because if
  // something crashes halfway through I'd be left with a corrupted,
  // half-written image. So instead I do this little three-step dance:
  //   1. Write the new bytes to a sibling file ending in .tmp
  //   2. Delete the original
  //   3. Rename the .tmp file to take its place
  // Renaming is atomic on most filesystems — it either fully happens or
  // doesn't — so worst case after a crash I've got either the old file
  // or the new file, never a broken one.
  const tmp = file + ".tmp";
  await writeFile(tmp, out);
  await unlink(file);
  await rename(tmp, file);
  const after = (await stat(file)).size;
  totalAfter += after;
  processed += 1;
  console.log(`${file}  [${mode}]  ${mb(before)} -> ${mb(after)}  (${meta.width}x${meta.height})`);
}

// Summary line — quick sanity check that the run actually did something.
console.log(
  `\nprocessed ${processed} files. total: ${mb(totalBefore)} -> ${mb(totalAfter)} (saved ${mb(
    totalBefore - totalAfter
  )})`
);
