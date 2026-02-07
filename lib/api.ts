import { Match } from "@/lib/types"

const BASE_URL = "https://sportia-api.onrender.com"

export async function fetchUpcomingNBAMatches(): Promise<Match[]> {
  const res = await fetch(
    `${BASE_URL}/api/v1/matches/upcoming?sport=nba`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch matches")
  }

  return res.json()
}
