import { PredictionResponse } from "@/lib/types"

export default function MarketConclusion({
  prediction,
}: {
  prediction: PredictionResponse
}) {
  return (
    <div className="border rounded-xl p-5 bg-gradient-to-br from-slate-50 to-white">
      <h3 className="font-semibold text-slate-900 mb-2">
        🧠 Conclusión del modelo
      </h3>

      <ul className="space-y-1 text-sm">
        <li>
          <strong>Moneyline:</strong>{" "}
          {prediction.analysis}
        </li>

        <li>
          <strong>Script:</strong>{" "}
          {prediction.game_script === "high_scoring"
            ? "Puntuación alta"
            : "Puntuación baja"}
        </li>

        <li>
          <strong>Casa:</strong>{" "}
          {prediction.odds.provider}
        </li>
      </ul>
    </div>
  )
}
