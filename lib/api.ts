import { Match } from "@/lib/types"

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000"

export async function fetchUpcomingNBAMatches(): Promise<Match[]> {
  const res = await fetch(`${BASE_URL}/api/matches`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch matches")
  }

  return res.json()
}
