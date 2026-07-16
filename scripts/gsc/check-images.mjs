// Cek apakah gambar di homepage lewat custom WebP loader (bukan Vercel /_next/image).
fetch("https://karyamediasouvenir.com/")
  .then((r) => r.text())
  .then((t) => {
    const next = (t.match(/src="(\/_next\/image[^"]+)"/g) || []).length;
    const opt = (t.match(/src="(\/images\/opt[^"]+)"/g) || []).length;
    console.log("_next/image (Vercel optimizer) count:", next);
    console.log("/images/opt (custom WebP) count:    ", opt);
    const sampleOpt = (t.match(/src="(\/images\/opt[^"]+)"/) || [])[1];
    if (sampleOpt) console.log("sample:", sampleOpt);
    if (next === 0 && opt > 0) console.log("\nOK: gambar lewat WebP loader, bukan Vercel optimizer.");
    else if (next > 0) console.log("\nWARNING: masih ada pemanggilan ke /_next/image (Vercel optimizer).");
  })
  .catch((e) => console.log("err", e.message));
