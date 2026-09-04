"use strict";

// Extracts every asset image referenced from each page's SCSS partial so the
// runtime can preload a page's images before revealing it (fixes images
// popping in one-by-one) and prefetch the next page's images in the background.

const fs = require("fs");
const path = require("path");

const cssDir = path.resolve(__dirname, "../css");
const outputFile = path.resolve(__dirname, "../assets/preload-manifest.json");

const URL_PATTERN = /url\(\s*['"]?(\.\.\/assets\/img\/[^'")]+)['"]?\s*\)/g;

function extractImageUrls(scssContents) {
  const urls = new Set();
  let match;
  while ((match = URL_PATTERN.exec(scssContents)) !== null) {
    urls.add(match[1].replace(/^\.\.\//, "./"));
  }
  return Array.from(urls);
}

function buildManifest() {
  const manifest = {};

  for (let pageNo = 0; pageNo <= 25; pageNo++) {
    const scssPath = path.join(cssDir, `page${pageNo}.scss`);
    if (!fs.existsSync(scssPath)) {
      continue;
    }
    const contents = fs.readFileSync(scssPath, "utf8");
    manifest[`page${pageNo}`] = extractImageUrls(contents);
  }

  return manifest;
}

const manifest = buildManifest();
fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `Wrote ${Object.keys(manifest).length} page entries to ${path.relative(process.cwd(), outputFile)}`,
);
