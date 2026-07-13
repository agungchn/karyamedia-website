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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#1C1410,#3a2a1a,#5a3d1f)",
          color: "white",
          fontFamily: "sans-serif",
          padding: "80px",
        }}
      >
        {img ? (
          <img
            width={440}
            height={440}
            src={img}
            alt=""
            style={{ borderRadius: "28px", objectFit: "contain", marginBottom: "40px" }}
          />
        ) : (
          <div
            style={{
              width: "440px",
              height: "440px",
              borderRadius: "28px",
              background: "linear-gradient(135deg,#d4af37,#f4d77a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "160px",
              color: "#1C1410",
              marginBottom: "40px",
            }}
          >
            K
          </div>
        )}

        <div
          style={{
            background: "rgba(212,175,55,0.15)",
            color: "#f4d77a",
            borderRadius: "999px",
            padding: "10px 22px",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          {esc(category)}
        </div>
        <div
          style={{
            fontSize: "48px",
            fontWeight: 800,
            lineHeight: "58px",
            marginTop: "22px",
            textAlign: "center",
            maxWidth: "980px",
          }}
        >
          {esc(title)}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "28px",
            color: "#d4af37",
            fontWeight: 700,
            marginTop: "26px",
          }}
        >
          <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#d4af37", marginRight: "14px" }} />
          Karyamedia Souvenir
        </div>
      </div>
    ),
    { width: 1200, height: 1200 },
  )
}
