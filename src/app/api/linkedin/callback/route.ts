import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  const error = req.nextUrl.searchParams.get("error")

  if (error) {
    return new Response(
      `<!DOCTYPE html><html><body>
        <h3>Error</h3>
        <p>${error}: ${req.nextUrl.searchParams.get("error_description")}</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    )
  }

  return new Response(
    `<!DOCTYPE html><html><body>
      <h3>Authorization Code Diterima</h3>
      <p>Copy code di bawah ini dan paste ke terminal:</p>
      <pre style="background:#eee;padding:10px;word-break:break-all">${code}</pre>
      <p style="color:#666">Atau jalankan ini di PowerShell:</p>
      <pre style="background:#eee;padding:10px">
$code = "${code}"
      </pre>
    </body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  )
}
