"use client"

import { PredictionResponse } from "@/lib/types"

type Props = {
  prediction: PredictionResponse
}

export default function MarketConclusion({ prediction }: Props) {
  const { odds, match, game_script, player_props } = prediction

  const valueBets = player_props.filter(
    p => p.bet_tier === "VALUE BET"
  )

  let conclusion = "NO BET"
  let detail = "No se detecta ventaja clara en mercados principales."
  let highlight = "bg-slate-50 border-slate-300 text-slate-700"

  // 🔹 Lógica básica de Moneyline
  if (
    valueBets.length >= 2 &&
    odds.home_moneyline < -150
  ) {
    conclusion = "MONEYLINE"
    detail = "El modelo favorece al equipo local a ganar el partido."
    highlight = "bg-green-50 border-green-500 text-green-800"
  }

  // 🔹 Lógica básica de Spread
  if (
    valueBets.length >= 3 &&
    Math.abs(odds.spread) <= 6
  ) {
    conclusion = "SPREAD"
    detail =
      odds.spread < 0
        ? "El modelo proyecta que el favorito cubre la línea."
        : "El modelo proyecta que el underdog cubre la línea."
    highlight = "bg-blue-50 border-blue-500 text-blue-800"
  }

  return (
    <div
      className={`border-2 rounded-xl p-5 space-y-2 ${highlight}`}
    >
      <h3 className="text-lg font-bold">
        🧠 Conclusión del mercado
      </h3>

      <p className="text-base font-semibold">
        {conclusion}
      </p>

      <p className="text-sm">{detail}</p>

      <div className="text-sm text-slate-600 pt-1">
        <p>
          <strong>Spread:</strong> {odds.spread}
        </p>
        <p>
          <strong>Moneyline:</strong>{" "}
          {odds.home_moneyline} / {odds.away_moneyline}
        </p>
      </div>

      <p className="text-xs italic pt-2">
        Decisión basada en combinación de ritmo esperado,
        distribución de props y precios de mercado.
      </p>
    </div>
  )
}
