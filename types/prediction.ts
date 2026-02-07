/*contrato */

export type MatchPrediction = {
  match: string
  league: string
  game_script: "low_scoring" | "high_scoring"
  odds: {
    provider: string
    spread: number
    over_under: number
    home_moneyline: number
    away_moneyline: number
  }
  player_props: PlayerProp[]
  analysis: string
}
export type PlayerProp = {
  name: string
  player_id: string
  type: "Points" | "Rebounds" | "Assists"
  line: number
  confidence: number
  projection: number
  edge_over: number
  bet_tier: "VALUE BET" | "NO BET"
  bet_decision: "OVER" | "UNDER" | "PASS"
}
