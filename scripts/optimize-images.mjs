import sharp from "sharp";
import fs from "fs";
import path from "path";

// Pra-optimasi gambar: konversi PNG/JPG di public/images -> WebP
// di beberapa lebar ke public/images/opt (struktur mirror).
// Next.js memakai custom loader yg mengarahkan ke file opt ini, sehingga
// tak ada lagi permintaan ke layanan Image Optimization Vercel (kuota 402).
// Script idempoten: file opt yg sudah ada dilewati.

const PUBLIC = path.join(process.cwd(), "public", "images");
const OPT = path.join(PUBLIC, "opt");
const WIDTHS = [320, 480, 640, 960];
const QUALITY = 80;

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "opt") continue; // jangan proses hasil optimasi
      out.push(...walk(p));
    } else if (/\.(png|jpe?g)$/i.test(e.name)) {
      if (/-w\d+\.webp$/i.test(e.name)) continue; // sudah opt
      out.push(p);
    }
  }
  return out;
}

function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

async function optimizeFile(file) {
  const rel = path.relative(PUBLIC, file).replace(/\\/g, "/");
  const dot = rel.lastIndexOf(".");
  const base = dot >= 0 ? rel.slice(0, dot) : rel;
  const ext = (dot >= 0 ? rel.slice(dot + 1) : "").toLowerCase();
  const optBase = path.join(OPT, base); // tanpa ext
  ensureDir(optBase + ".webp");

  let made = 0;
  for (const w of WIDTHS) {
    const out = `${optBase}-w${w}.webp`;
    if (fs.existsSync(out) && fs.statSync(out).size > 0) continue;
    let img = sharp(file, { failOn: "none" });
    if (ext === "jpg" || ext === "jpeg") {
      img = img.withMetadata({ orientation: undefined }).rotate();
    }
    await img
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(out);
    made++;
  }
  return made;
}

async function main() {
  const argFile = process.argv.indexOf("--file");
  let files;
  if (argFile >= 0) {
    const rel = process.argv[argFile + 1];
    const abs = path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel);
    if (!fs.existsSync(abs)) {
      console.log("FILE TIDAK ADA: " + abs);
      process.exit(1);
    }
    files = [abs];
  } else {
    files = walk(PUBLIC);
  }

  let total = 0;
  let i = 0;
  for (const f of files) {
    i++;
    try {
      total += await optimizeFile(f);
    } catch (e) {
      console.log(`GAGAL ${f}: ${e.message}`);
    }
    if (i % 50 === 0) console.log(`  ...${i}/${files.length}`);
  }
  console.log(
    `SELESAI: ${files.length} sumber -> ${total} file WebP dibuat di public/images/opt`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
