import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 })
  }

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: token,
    }),
  })

  const data = await res.json()

  if (!data.success) {
    return NextResponse.json({ success: false, error: "人机验证失败" }, { status: 403 })
  }

  return NextResponse.json({ success: true })
}
