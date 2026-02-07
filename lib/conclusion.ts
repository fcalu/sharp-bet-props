import { PredictionResponse } from "./types"

export function getMatchConclusion(prediction: PredictionResponse) {
  if (prediction.game_script === "low_scoring") {
    return `UNDER ${prediction.odds.over_under}`
  }

  if (prediction.game_script === "high_scoring") {
    return `OVER ${prediction.odds.over_under}`
  }

  return "NO BET"
}
