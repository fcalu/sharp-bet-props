export type Odds = {
  provider: string
  spread: number
  over_under: number
  home_moneyline: number
  away_moneyline: number
}

export type PlayerProp = {
  name: string
  team: string
  type: "Points" | "Rebounds"
  line: number
  confidence: number
  edge_over: number
  bet_tier: "VALUE BET" | "NO BET" | "SOLO INFORMATIVO"
  bet_decision: "OVER" | "UNDER" | "PASS"
  model_mean: number
  explanation_factors: string[]
}

export type PredictionResponse = {
  match: string
  league: string
  game_script: "low_scoring" | "high_scoring"
  odds: Odds
  player_props: PlayerProp[]
  analysis: string
}

export type Match = {
  sport: string
  league: string
  event_id: string
  home_team: string
  away_team: string
  start_time: string
}

