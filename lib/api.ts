export type { Match } from "@/lib/types"


export async function fetchUpcomingNBAMatches() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/matches`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch matches")
  }

  return res.json()
}

