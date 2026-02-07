import { Match } from "@/lib/types"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "https://sportia-api.onrender.com"

export async function fetchUpcomingNBAMatches(): Promise<Match[]> {
  const res = await fetch(
    `${BACKEND_URL}/api/v1/matches/upcoming?sport=nba`,
    {
      cache: "no-store",
    }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch upcoming NBA matches")
  }

  return res.json()
}
