import { PlayerProp } from "./types"

export const mockProps: PlayerProp[] = [
  {
    name: "Anthony Edwards",
    type: "Points",
    line: 24.7,
    bet_decision: "OVER",
    bet_tier: "VALUE BET",
    confidence: 72,
    edge_over: 0.07,
    model_mean: 25.5,
    explanation_factors: [
      "Ritmo de juego proyectado alto",
      "Uso ofensivo consistente en últimos partidos",
      "Línea de mercado por debajo del promedio del modelo",
      "Minutos esperados estables",
    ],
  },
  {
    name: "Donte DiVincenzo",
    type: "Points",
    line: 11.2,
    bet_decision: "OVER",
    bet_tier: "VALUE BET",
    confidence: 70,
    edge_over: 0.063,
    model_mean: 11.5,
    explanation_factors: [
      "Participación ofensiva creciente",
      "Emparejamiento defensivo favorable",
      "Ritmo de partido por encima del promedio",
      "Proyección de minutos sólida",
    ],
  },
  {
    name: "Rudy Gobert",
    type: "Rebounds",
    line: 11.8,
    bet_decision: "PASS",
    bet_tier: "SOLO INFORMATIVO",
    confidence: 62,
    edge_over: 0.041,
    model_mean: 12.2,
    explanation_factors: [
      "Ventaja leve detectada",
      "Varianza elevada en rebotes",
      "Línea cercana al valor justo",
      "No se considera oportunidad accionable",
    ],
  },
]
