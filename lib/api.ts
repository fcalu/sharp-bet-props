import { Match } from "@/lib/types"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://sportia-api.onrender.com"

export async function fetchUpcomingNBAMatches(): Promise<Match[]> {
  const res = await fetch(
    `${API_BASE}/api/v1/matches/upcoming?sport=basketball`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch matches")
  }

  return res.json()
}
