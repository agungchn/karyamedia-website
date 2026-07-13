import { ImageResponse } from "next/og"
import { readFileSync, existsSync } from "fs"
import { join, resolve } from "path"

export const runtime = "nodejs"
export const alt = "Karyamedia Souvenir"
export const size = { width: 1200, height: 600 }
export const contentType = "image/png"

function toDataUrl(rel: string | undefined): string | null {
  if (!rel) return null
  try {
    const p = join(resolve(process.cwd(), "public"), rel.replace(/^\//, ""))
    if (!existsSync(p)) return null
    const b = readFileSync(p)
    const ext = p.toLowerCase().endsWith(".png")
      ? "png"
      : p.toLowerCase().endsWith(".webp")
        ? "webp"
        : "jpeg"
    return `data:image/${ext};base64,${b.toString("base64")}`
  } catch {
    return null
  }
}

function load(slug: string) {
  try {
    const file = join(resolve(process.cwd(), "src", "data", "og-meta.json"))
    if (!existsSync(file)) return null
    const meta = JSON.parse(readFileSync(file, "utf8"))
    return meta[slug] || null
  } catch {
    return null
  }
}

const esc = (s: string) => (s || "").replace(/[<>&]/g, "")

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const m = load(slug)
  const title = m?.title || "Karyamedia Souvenir"
  const category = m?.category || "Custom Manufacturing"
  const img = toDataUrl(m?.image)

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg,#1C1410,#3a2a1a,#5a3d1f)",
          color: "white",
          fontFamily: "sans-serif",
          padding: "60px",
          alignItems: "center",
          gap: "44px",
        }}
      >
        {img ? (
          <img
            width={360}
            height={360}
            src={img}
            alt=""
            style={{ borderRadius: "24px", objectFit: "contain", flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              width: "360px",
              height: "360px",
              borderRadius: "24px",
              background: "linear-gradient(135deg,#d4af37,#f4d77a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "130px",
              color: "#1C1410",
              flexShrink: 0,
            }}
          >
            K
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            maxWidth: "680px",
            minWidth: 0,
          }}
        >
          <div
            style={{
              background: "rgba(212,175,55,0.15)",
              color: "#f4d77a",
              borderRadius: "999px",
              padding: "10px 20px",
              fontSize: "24px",
              fontWeight: 700,
              alignSelf: "flex-start",
            }}
          >
            {esc(category)}
          </div>
          <div style={{ fontSize: "44px", fontWeight: 800, lineHeight: "54px", marginTop: "20px" }}>
            {esc(title)}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "26px",
              color: "#d4af37",
              fontWeight: 700,
              marginTop: "20px",
            }}
          >
            <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#d4af37", marginRight: "14px" }} />
            Karyamedia Souvenir
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 600 },
  )
}
