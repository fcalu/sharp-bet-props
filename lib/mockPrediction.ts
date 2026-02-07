import { MatchPrediction } from "@/types/prediction"

export const mockPrediction: MatchPrediction = {
  match: "Oklahoma City Thunder vs Houston Rockets",
  league: "basketball/nba",
  game_script: "low_scoring",
  odds: {
    provider: "Draft Kings",
    spread: -3.5,
    over_under: 212.5,
    home_moneyline: -162,
    away_moneyline: 136
  },
  player_props: [
    {
      name: "Shai Gilgeous-Alexander",
      player_id: "4278073",
      type: "Points",
      line: 22.6,
      confidence: 62,
      projection: 23.35,
      edge_over: 0.0425,
      bet_tier: "NO BET",
      bet_decision: "PASS"
    }
  ],
  analysis:
    "El modelo no detecta una ventaja estadística clara. Se recomienda no apostar."
}
