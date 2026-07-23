import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(req: NextRequest) {
  const { protocol, host, pathname, search } = req.nextUrl
  if (protocol === "http:" && host !== "localhost:3456" && host !== "localhost:3000") {
    return NextResponse.redirect(
      `https://${host}${pathname}${search}`,
      301,
    )
  }
  return NextResponse.next()
}

export const config = {
  matcher: "/:path*",
}
