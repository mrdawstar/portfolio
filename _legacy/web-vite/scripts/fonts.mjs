// Downloads the latin + latin-ext woff2 subsets for the two approved typefaces
// and emits a self-hosted @font-face stylesheet (no runtime CDN dependency).
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(import.meta.dirname, "../public/fonts");
await mkdir(OUT, { recursive: true });

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const FAMILIES = [
  { q: "Archivo:wght@400..700", file: "archivo", style: "normal", weight: "400 700" },
  { q: "Instrument+Serif:ital@1", file: "instrument-serif-italic", style: "italic", weight: "400" },
];

let css = "";
for (const fam of FAMILIES) {
  const res = await fetch(`https://fonts.googleapis.com/css2?family=${fam.q}&display=swap`, {
    headers: { "User-Agent": UA },
  });
  const sheet = await res.text();

  // keep only the latin and latin-ext subsets; drop cyrillic/greek/vietnamese
  const blocks = sheet.split("/*").filter((b) => /^\s*(latin|latin-ext)\s*\*\//.test(b));
  for (const block of blocks) {
    const subset = block.match(/^\s*(latin-ext|latin)\s*\*\//)[1];
    const url = block.match(/url\((https:[^)]+\.woff2)\)/)[1];
    const range = block.match(/unicode-range:\s*([^;]+);/)[1].trim();
    const name = `${fam.file}-${subset}.woff2`;

    const bin = Buffer.from(await (await fetch(url, { headers: { "User-Agent": UA } })).arrayBuffer());
    await writeFile(path.join(OUT, name), bin);

    css +=
      `@font-face {\n` +
      `  font-family: "${fam.file.startsWith("archivo") ? "Archivo" : "Instrument Serif"}";\n` +
      `  font-style: ${fam.style};\n` +
      `  font-weight: ${fam.weight};\n` +
      `  font-display: swap;\n` +
      `  src: url("/fonts/${name}") format("woff2");\n` +
      `  unicode-range: ${range};\n` +
      `}\n`;
    console.log(`${name.padEnd(36)} ${(bin.length / 1024).toFixed(1)} KB`);
  }
}
await writeFile(path.resolve(import.meta.dirname, "../src/styles/fonts.css"), css);
console.log("\nwrote src/styles/fonts.css");
