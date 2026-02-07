export function mapPredictionToPlayerProps(prediction: any) {
  return prediction.player_props.map((p: any) => ({
    name: p.name,
    type: p.type,
    line: p.line,
    confidence: p.confidence,
    projection: p.projection_model.mean,
    edge_over: p.edge_over,
    bet_tier: p.bet_tier,
    bet_decision: p.bet_decision,
    model_prob_over: p.model_prob_over,
    model_prob_under: p.model_prob_under
  }))
}
