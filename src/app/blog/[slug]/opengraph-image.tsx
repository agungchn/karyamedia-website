import { ImageResponse } from "next/og"
import { readFileSync, existsSync } from "fs"
import { join, resolve } from "path"

export const runtime = "nodejs"

function getMeta(slug: string): { title: string; category: string; image?: string } | null {
  const file = join(resolve(process.cwd(), "src", "data", "og-meta.json"))
  if (!existsSync(file)) return null
  const meta = JSON.parse(readFileSync(file, "utf8"))
  return meta[slug] || null
}

function toDataUrl(image: string | undefined): string | null {
  if (!image) return null
  const p = join(resolve(process.cwd(), "public"), image)
  if (!existsSync(p)) return null
  const ext = image.toLowerCase().endsWith(".png") ? "png" : "jpeg"
  return `data:image/${ext};base64,${readFileSync(p).toString("base64")}`
}

function esc(s: string): string {
  return s.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = getMeta(slug)
  const title = a?.title || "Karyamedia Souvenir"
  const category = a?.category || "Souvenir Custom"
  const img = toDataUrl(a?.image)

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
          padding: "64px",
          alignItems: "center",
        }}
      >
        {img ? (
          <img width={360} height={360} src={img} alt="" style={{ borderRadius: "24px" }} />
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
              fontSize: "120px",
              color: "#1C1410",
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
            marginLeft: "56px",
          }}
        >
          <div
            style={{
              background: "rgba(212,175,55,0.15)",
              color: "#f4d77a",
              borderRadius: "999px",
              padding: "10px 20px",
              fontSize: "26px",
              fontWeight: 700,
            }}
          >
            {esc(category)}
          </div>
          <div style={{ fontSize: "52px", fontWeight: 800, lineHeight: "62px", marginTop: "24px" }}>
            {esc(title)}
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: "28px", color: "#d4af37", fontWeight: 700, marginTop: "24px" }}>
            <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#d4af37", marginRight: "14px" }} />
            Karyamedia Souvenir
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
