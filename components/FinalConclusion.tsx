"use client"

import { PlayerProp } from "@/lib/types"

type Props = {
  props: PlayerProp[]
}

export default function FinalConclusion({ props }: Props) {
  const valueBets = props.filter(
    p => p.bet_tier === "VALUE BET"
  )

  if (valueBets.length === 0) {
    return (
      <div className="border rounded-xl p-4 bg-slate-50">
        <h3 className="font-semibold text-slate-900">
          Conclusión del modelo
        </h3>
        <p className="text-slate-600 mt-1">
          ❌ No se detectaron apuestas con valor esperado positivo
          en este partido.
        </p>
      </div>
    )
  }

  const bestPick = [...valueBets].sort(
    (a, b) => b.edge_over - a.edge_over
  )[0]

  const decisionText =
    bestPick.bet_decision === "OVER"
      ? "JUGAR OVER"
      : bestPick.bet_decision === "UNDER"
      ? "JUGAR UNDER"
      : "SIN APUESTA"

  return (
    <div className="border-2 border-green-500 rounded-xl p-5 bg-green-50 space-y-3">
      <h3 className="text-lg font-bold text-green-800">
        ✅ Conclusión final del modelo
      </h3>

      <p className="text-green-900 text-lg font-semibold">
        {decisionText} — {bestPick.name}
      </p>

      <p className="text-slate-700">
        <strong>Línea:</strong> {bestPick.line} ·{" "}
        {bestPick.type === "Points" ? "Puntos" : "Rebotes"}
      </p>

      <p className="text-slate-700">
        <strong>Confianza del modelo:</strong>{" "}
        {bestPick.confidence}%
      </p>

      <p className="text-slate-700">
        <strong>Ventaja estimada:</strong>{" "}
        {(bestPick.edge_over * 100).toFixed(1)}%
      </p>

      <p className="text-sm text-slate-600 italic">
        Recomendación basada en discrepancia entre proyección
        estadística y línea de mercado. Usar stake fijo.
      </p>
    </div>
  )
}
