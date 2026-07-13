import sharp from "sharp";
import fs from "fs";

const base = "H:/karyamedia-web/public";
const rels = [
  "/images/hero/plakat-akrilik (2).png",
  "/images/hero/kalung-rektor (12).png",
  "/images/hero/plakat-wayang (33).png",
  "/images/hero/map-wisuda (8).png",
  "/images/hero/patung-wisuda (20).png",
  "/images/hero/plakat-resin-fiberglass (81).png",
  "/images/gallery/Laser Cutting.png",
  "/images/gallery/UV Flatbed Printer.png",
  "/images/gallery/Metal Cutting Fiber.png",
  "/images/gallery/3DPrinter.png",
  "/images/gallery/engraving machine.png",
  "/images/gallery/molding Box.png",
];

let totalBefore = 0;
let totalAfter = 0;
for (const rel of rels) {
  const src = base + rel;
  const out = src.replace(/\.png$/i, ".webp");
  const before = fs.statSync(src).size;
  await sharp(src).webp({ quality: 80 }).toFile(out);
  const after = fs.statSync(out).size;
  fs.unlinkSync(src);
  totalBefore += before;
  totalAfter += after;
  console.log(`${(before / 1e6).toFixed(2)}MB -> ${(after / 1e6).toFixed(2)}MB  ${rel}`);
}
console.log(`\nTOTAL ${(totalBefore / 1e6).toFixed(1)}MB -> ${(totalAfter / 1e6).toFixed(1)}MB`);
