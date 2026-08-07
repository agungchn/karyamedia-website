import sharp from "sharp";
import { readdirSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const SRC = "G:/plakat-provinsi/kalimantan";
const OUT = "public/images/produk-unggulan/plakat-instansi/kalimantan";
const WM = "watrermark.png";

function normalizeName(file) {
  let name = file.replace(/\.png$/i, "");
  if (/^(kabupaten|kota)-/i.test(name)) {
    name = "plakat-" + name;
  }
  return name;
}

async function processFile(file) {
  const srcFile = join(SRC, file);
  const outFile = join(OUT, normalizeName(file) + ".webp");
  if (existsSync(outFile)) return { file, status: "skip" };

  const image = sharp(srcFile);
  const meta = await image.metadata();

  const wmWidth = Math.round(meta.width * 0.5);
  const wmHeight = Math.round(wmWidth * (472 / 1743));
  const margin = Math.round(meta.width * 0.05);
  const topOffset = Math.round(meta.height * 0.22);

  const watermark = await sharp(WM)
    .resize(wmWidth, wmHeight, { fit: "contain" })
    .png()
    .toBuffer();

  const composited = await image
    .composite([
      { input: watermark, top: meta.height - wmHeight - topOffset, left: margin + 40 },
    ])
    .webp({ quality: 90, effort: 4 })
    .toBuffer();

  writeFileSync(outFile, composited);
  return { file, status: "ok", out: outFile };
}

mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => /\.png$/i.test(f));
console.log(`Found ${files.length} PNG files in ${SRC}`);

let ok = 0;
let skip = 0;
let errors = 0;

for (const f of files) {
  try {
    const r = await processFile(f);
    if (r.status === "ok") {
      ok++;
      console.log(`  OK ${r.out}`);
    } else {
      skip++;
    }
  } catch (e) {
    errors++;
    console.log(`  ERR ${f}: ${e.message}`);
  }
}

console.log(`\nDone. Created ${ok}, skipped ${skip}, errors ${errors}`);
