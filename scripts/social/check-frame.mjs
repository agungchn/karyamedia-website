import sharp from "sharp";
const img = process.argv[2] || "public/social-content/tiktok-plakat-kayu-eksklusif-66.webp";
sharp(img).metadata().then(m => console.log(JSON.stringify(m, null, 2)));
