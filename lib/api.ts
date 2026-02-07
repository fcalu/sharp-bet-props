import { Match } from "@/lib/types"

export async function fetchUpcomingNBAMatches(): Promise<Match[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/matches`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch matches")
  }

  const raw = await res.json()

  /**
   * 🔹 Normalizamos cualquier forma que mande el backend
   */
  return raw.map((m: any) => ({
    event_id: String(m.event_id ?? m.id),
    home_team:
      m.home_team?.name ??
      m.home_team ??
      m.home?.name ??
      "TBD",
    away_team:
      m.away_team?.name ??
      m.away_team ??
      m.away?.name ??
      "TBD",
    start_time: m.start_time ?? m.date,
  }))
}
