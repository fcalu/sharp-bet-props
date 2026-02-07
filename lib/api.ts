import { Match } from "@/lib/types"

export async function fetchUpcomingNBAMatches(): Promise<Match[]> {
  const res = await fetch("/api/matches", {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch matches")
  }

  return res.json()
}
