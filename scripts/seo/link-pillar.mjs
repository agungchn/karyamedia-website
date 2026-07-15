// Wire the topic-cluster <-> pillar internal linking so the 8
// `panduan-lengkap-*` articles become canonical hubs (fixes keyword
// cannibalization structurally). Idempotent — re-running changes nothing.
//
//   node scripts/seo/link-pillar.mjs          # apply
//   node scripts/seo/link-pillar.mjs --dry    # report only

import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import { extractArticles } from "./article-lint.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const articlesPath = resolve(root, "src/data/articles.ts")

const escTpl = (s) => String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")
const field = (b, n) => (b.match(new RegExp(n + ':\\s*"([^"]*)"')) || [])[1] || ""

// pilar kanonis per kategori (slug sudah divalidasi ada di bawah)
const PILLAR_FOR = {
  Plakat: "panduan-lengkap-plakat-custom",
  "Souvenir Wisuda": "panduan-lengkap-souvenir-wisuda-custom",
  "Piala & Trophy": "panduan-lengkap-piala-dan-trophy-custom",
  Accessories: "panduan-lengkap-tumbler-custom",
  Medali: "panduan-lengkap-medali-custom",
  Prasasti: "panduan-lengkap-prasasti-custom",
  "Gift Box": "panduan-lengkap-gift-box-custom",
  Souvenir: "panduan-lengkap-souvenir-custom",
  Blog: "panduan-lengkap-souvenir-custom",
}
// artikel cluster mana yang jadi target link balik dari sebuah pilar
const PILLAR_TARGETS = {
  "panduan-lengkap-plakat-custom": ["Plakat"],
  "panduan-lengkap-souvenir-wisuda-custom": ["Souvenir Wisuda"],
  "panduan-lengkap-piala-dan-trophy-custom": ["Piala & Trophy"],
  "panduan-lengkap-tumbler-custom": ["Accessories"],
  "panduan-lengkap-medali-custom": ["Medali"],
  "panduan-lengkap-prasasti-custom": ["Prasasti"],
  "panduan-lengkap-gift-box-custom": ["Gift Box"],
  "panduan-lengkap-souvenir-custom": ["Souvenir", "Souvenir Wisuda"],
}

// pemetaan berbasis topik (slug) untuk pilar yang berbagi kategori.
// dipakai untuk mengarahkan artikel cluster ke pilar yang TEPAT (bukan cuma per kategori).
const PILLAR_TOPICS = [
  { pillar: "panduan-lengkap-name-tag-custom", re: /name-tag|nametag|id-card|id card/ },
  { pillar: "panduan-lengkap-papan-nama-custom", re: /papan-nama|papan nama/ },
  { pillar: "panduan-lengkap-gantungan-kunci-custom", re: /gantungan-kunci|keychain/ },
  { pillar: "panduan-lengkap-pin-bross-custom", re: /pin-bross|pin bross|bross/ },
  { pillar: "panduan-lengkap-souvenir-pernikahan-custom", re: /souvenir-pernikahan|pernikahan|nikah/ },
  { pillar: "panduan-lengkap-batas-wilayah-custom", re: /batas-wilayah|center-point|brass-table|tugu/ },
]

const text0 = readFileSync(articlesPath, "utf8")
const arts = extractArticles(text0)
const allSlugs = new Set(arts.map((a) => a.slug))
const meta = arts.map((a) => ({ slug: a.slug, title: field(a.block, "title"), category: field(a.block, "category") }))

// validasi map
for (const [cat, slug] of Object.entries(PILLAR_FOR)) {
  if (!allSlugs.has(slug)) console.warn(`! PILLAR_FOR[${cat}] -> slug tidak ada: ${slug}`)
}

let out = text0
let changed = 0
const log = []

for (const a of arts) {
  const slug = a.slug
  const block = a.block
  const cat = field(block, "category")
  const title = field(block, "title")
  const m = block.match(/content:\s*`([\s\S]*?)`/)
  if (!m) continue
  let c = m[1]
  let modified = false

  const isPillar = slug.startsWith("panduan-lengkap-")
  const linkedTo = (target) => c.includes(`/blog/${target}"`) || c.includes(`/blog/${target}'`)

  if (!isPillar) {
    // cluster -> pillar (naik ke pilar topik/kategori)
    const topic = PILLAR_TOPICS.find((t) => t.re.test(slug))
    const pillarSlug = topic && allSlugs.has(topic.pillar) ? topic.pillar : PILLAR_FOR[cat]
    if (pillarSlug && allSlugs.has(pillarSlug) && !linkedTo(pillarSlug)) {
      const pTitle = meta.find((x) => x.slug === pillarSlug)?.title || pillarSlug
      const anchor = `<p>Baca juga panduan lengkap kami: <a href="/blog/${pillarSlug}">${escTpl(pTitle)}</a> sebagai referensi menyeluruh seputar ${escTpl(cat)}.</p>`
      const faqIdx = c.search(/<h2[^>]*>\s*FAQ\s*<\/h2>/i)
      c = faqIdx >= 0 ? c.slice(0, faqIdx) + anchor + c.slice(faqIdx) : c + anchor
      modified = true
      log.push(`cluster->pilar: ${slug} -> ${pillarSlug}`)
    }
  } else {
    // pillar -> cluster (turun ke beberapa artikel terkait, berbasis topik bila ada)
    const topic = PILLAR_TOPICS.find((t) => t.pillar === slug)
    const targets = topic
      ? meta.filter((x) => topic.re.test(x.slug) && !x.slug.startsWith("panduan-lengkap-") && x.slug !== slug)
      : (PILLAR_TARGETS[slug] || []).flatMap((tc) =>
          meta.filter((x) => x.category === tc && !x.slug.startsWith("panduan-lengkap-") && x.slug !== slug),
        )
    const already = targets.filter((t) => linkedTo(t.slug))
    if (targets.length && already.length < 2) {
      const need = targets.slice(0, 3).filter((t) => !linkedTo(t.slug))
      if (need.length) {
        const links = need.map((t) => `<a href="/blog/${t.slug}">${escTpl(t.title)}</a>`).join(", ")
        const para = `<p>Artikel terkait yang bisa Anda pelajari: ${links}.</p>`
        const faqIdx = c.search(/<h2[^>]*>\s*FAQ\s*<\/h2>/i)
        c = faqIdx >= 0 ? c.slice(0, faqIdx) + para + c.slice(faqIdx) : c + para
        modified = true
        log.push(`pilar->cluster: ${slug} +${need.length}`)
      }
    }
  }

  if (modified) {
    out = out.replace(block, block.replace(m[0], `content: \`${c}\``))
    changed++
  }
}

const DRY = process.argv.includes("--dry")
if (DRY) {
  console.log(`[DRY] Akan ubah ${changed} artikel:`)
  for (const l of log) console.log("  " + l)
} else {
  writeFileSync(articlesPath, out)
  console.log(`✓ Diubah ${changed} artikel (cluster<->pilar terhubung).`)
}
