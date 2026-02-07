import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch(
      "https://sportia-api.onrender.com/api/v1/matches/upcoming?sport=nba",
      {
        headers: {
          "Accept": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!res.ok) {
      throw new Error("Backend error")
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    )
  }
}
