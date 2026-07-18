import sharp from "sharp"
import { readFileSync, existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"
import ffmpeg from "ffmpeg-static"

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, "..", "..")
const productsPath = join(root, "src/data/products.json")
const tmp = join(root, "public/social-content/frames")
const outDir = join(root, "public/social-content")
const W = 720, H = 1280
const IX = 100, IY = 250, IW = 520, IH = 520

const allProducts = JSON.parse(readFileSync(productsPath, "utf-8"))
function pick(a) { return a[Math.floor(Math.random() * a.length)] }
function wrapText(t, m) {
  m = m || 28; const w = t.split(" "); const l = []; let c = ""
  for (const x of w) { if ((c + x).length > m) { l.push(c.trim()); c = "" } c += x + " " }
  if (c.trim()) l.push(c.trim()); return l
}

// ─── Static Template ───
const SVG_BG = `<svg width="${W}" height="${H}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#000030"/><stop offset="100%" stop-color="#002878"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="${W/2}" y="140" text-anchor="middle" font-family="sans-serif" font-size="38" font-weight="bold" fill="#FFE9A8">Karyamedia Souvenir</text>
  <text x="${W/2}" y="190" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#ffffff" opacity="0.7">Jogja sejak 2001</text>
  <rect x="${IX-2}" y="${IY-2}" width="${IW+4}" height="${IH+4}" rx="12" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.3"/>
  <text x="${W/2}" y="920" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#D4AF37">Custom sesuai kebutuhan Anda</text>
  <rect x="${W/2-140}" y="980" width="280" height="46" rx="23" fill="#075E54"/>
  <text x="${W/2}" y="1010" text-anchor="middle" font-family="sans-serif" font-size="17" font-weight="bold" fill="#ffffff">Pesan via WhatsApp</text>
  <text x="${W/2}" y="${H-40}" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#ffffff" opacity="0.4">karyamediasouvenir.com</text>
</svg>`

function nameSvg(name) {
  const lines = wrapText(name, 28)
  const fs = lines.length > 2 ? 28 : 34
  const y0 = 860
  return `<svg width="${W}" height="${H}">` +
    lines.map((l,i) => '<text x="'+(W/2)+'" y="'+(y0+i*44)+'" text-anchor="middle" font-family="sans-serif" font-size="'+fs+'" font-weight="bold" fill="#ffffff">'+l.replace(/&/g,"&amp;").replace(/</g,"&lt;")+'</text>').join("") +
    `</svg>`
}

function pickProducts(n) {
  const used = new Set(); const result = []
  const withImage = allProducts.filter(function(p) {
    return p.images?.[0] && existsSync(join(root, "public", p.images[0].replace(/^\//,"")))
  })
  while (result.length < n && withImage.length > 0) {
    const p = pick(withImage)
    const k = p.id || p.slug || p.name
    if (!used.has(k)) { used.add(k); result.push(p) }
  }
  return result
}

async function makeVideo(opts) {
  const count = opts.count || 1
  const targetDur = opts.duration || 30
  const DUR = 3.0
  const OVER = 0.6
  const OFF = DUR - OVER
  const n = Math.ceil(targetDur / DUR)

  if (!existsSync(tmp)) mkdirSync(tmp, { recursive: true })
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  for (let v = 0; v < count; v++) {
    const sel = pickProducts(n)
    if (sel.length < 2) { console.error("Not enough products"); return }

    // ── bg ──
    const bgPath = join(tmp, "bg-"+v+".webp")
    writeFileSync(bgPath, await sharp(Buffer.from(SVG_BG)).resize(W,H).webp().toBuffer())

    // ── names ──
    const namePaths = []
    for (let i = 0; i < sel.length; i++) {
      const buf = await sharp(Buffer.from(nameSvg(sel[i].name||"Produk"))).resize(W,H).png().toBuffer()
      const np = join(tmp, "name-"+v+"-"+i+".png")
      writeFileSync(np, buf)
      namePaths.push(np)
    }

    // ── products ──
    const prodPaths = []
    for (let i = 0; i < sel.length; i++) {
      const ip = join(root, "public", sel[i].images[0].replace(/^\//,""))
      const buf = await sharp(ip).resize(IW, IH, {fit:"contain", background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer()
      const pp = join(tmp, "prod-"+v+"-"+i+".png")
      writeFileSync(pp, buf)
      prodPaths.push(pp)
    }

    const TOTAL = sel.length * DUR
    const outPath = join(outDir, "tiktok-"+Date.now()+".mp4")

    // ── Inputs ──
    // [0] bg
    // [1..n] names
    // [n+1..2n] products
    const bgInput = '-loop 1 -t '+TOTAL+' -i "'+bgPath+'"'
    const nameInputs = namePaths.map(f => '-loop 1 -t '+DUR+' -i "'+f+'"').join(" ")
    const prodInputs = prodPaths.map(f => '-loop 1 -t '+DUR+' -i "'+f+'"').join(" ")

    // ── Filter complex ──
    let fc = ""
    const nameStart = 1
    const prodStart = 1 + n

    // xfade chain: [11][12]→[p01], [p01][13]→[p02], [p02][14]→[p03], ...
    for (let i = 0; i < n - 1; i++) {
      const cur = "p"+String(i+1).padStart(2,"0")
      const offset = ((i+1) * OFF).toFixed(1)
      if (i === 0) {
        // first xfade: use raw product indices
        fc += "["+prodStart+"]["+(prodStart+1)+"]xfade=transition=slideright:duration="+OVER+":offset="+offset+",scale="+IW+":"+IH+":flags=fast_bilinear,setsar=1["+cur+"]; "
      } else {
        // subsequent xfade: previous label + next product index
        fc += "[p"+String(i).padStart(2,"0")+"]["+(prodStart+i+1)+"]xfade=transition=slideright:duration="+OVER+":offset="+offset+",scale="+IW+":"+IH+":flags=fast_bilinear,setsar=1["+cur+"]; "
      }
    }
    const prodLabel = "p"+String(n-1).padStart(2,"0")

    // names concat: [1][2]..[n]
    const nameIndices = []
    for (let i = 0; i < n; i++) nameIndices.push("["+i+"]")
    fc += nameIndices.map((_,i) => "["+(nameStart+i)+"]").join("") + "concat=n="+n+":v=1:a=0[names]; "

    // overlay
    fc += "[0][names]overlay=0:0[bg_name]; "
    fc += "[bg_name]["+prodLabel+"]overlay="+IX+":"+IY+":format=auto,format=yuv420p[v]"

    // ── Audio ──
    const audio = join(tmp, "sil-"+v+".aac")
    execSync(ffmpeg+' -f lavfi -i anullsrc=r=44100:cl=mono -t '+TOTAL+' -c:a aac -y "'+audio+'"', {stdio:"pipe", timeout:30000})

    const totalInputs = 1 + n + n
    const cmd = ffmpeg+' '+bgInput+' '+nameInputs+' '+prodInputs+' -i "'+audio+'" -filter_complex "'+fc+'" -map "[v]" -map "'+totalInputs+':a" -c:v libx264 -preset ultrafast -crf 25 -pix_fmt yuv420p -c:a aac -shortest -y "'+outPath+'"'

    execSync(cmd, {stdio:"pipe", timeout:120000})

    for (const f of [bgPath, ...namePaths, ...prodPaths, audio]) { try { unlinkSync(f) } catch {} }

    console.log("[video "+(v+1)+"/"+count+"] "+outPath+" ("+TOTAL+"s)")
    sel.forEach(p => console.log("  - "+(p.name||"?")))
  }
}

// usage: node generate-video.mjs [count] [duration]
const count = parseInt(process.argv[2] || "1", 10)
const duration = parseInt(process.argv[3] || "15", 10)
makeVideo({ count, duration }).catch(e => { console.error("ERROR:", e.message); process.exit(1) })
