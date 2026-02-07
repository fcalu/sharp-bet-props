"use client"

import { useState } from "react"
import { PlayerProp } from "@/lib/types"

type Props = {
  prop: PlayerProp
  isProUser: boolean
}

export default function PlayerCard({ prop, isProUser }: Props) {
  const [showExplanation, setShowExplanation] = useState(false)

  return (
    <div className="border rounded-xl p-4 bg-white space-y-2">
      {/* Nombre */}
      <h2 className="text-lg font-semibold">{prop.name}</h2>

      {/* Equipo (opcional) */}
      {prop.team && (
        <p className="text-xs text-slate-500">{prop.team}</p>
      )}

      {/* Badge */}
      <span
        className={`inline-block text-xs px-2 py-1 rounded ${
          prop.bet_tier === "VALUE BET"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {prop.bet_tier}
      </span>

      {/* Tipo */}
      <p className="text-sm text-slate-500">
        {prop.type === "Points" ? "Puntos" : "Rebotes"} · Línea {prop.line}
      </p>

      {/* Decisión */}
      {prop.bet_decision !== "PASS" && (
        <p className="text-green-600 font-semibold">
          El modelo favorece {prop.bet_decision}
        </p>
      )}

      {/* Confianza */}
      <p className="text-sm">
        Confianza del modelo: {prop.confidence}%
      </p>

      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-green-500 rounded"
          style={{ width: `${prop.confidence}%` }}
        />
      </div>

      {/* Edge */}
      <p className="text-sm text-green-700">
        Ineficiencia detectada (+{(prop.edge_over * 100).toFixed(1)}%)
      </p>

      {/* Proyección */}
      <p className="text-sm text-slate-500">
        Proyección del modelo: {prop.model_mean}
      </p>

      {/* Explicación */}
      {isProUser ? (
        <>
          {prop.explanation_factors &&
            prop.explanation_factors.length > 0 && (
              <>
                <button
                  onClick={() =>
                    setShowExplanation(!showExplanation)
                  }
                  className="text-sm text-blue-600 underline"
                >
                  {showExplanation
                    ? "Ocultar explicación"
                    : "Ver explicación"}
                </button>

                {showExplanation && (
                  <ul className="list-disc list-inside text-sm text-slate-700">
                    {prop.explanation_factors.map(
                      (factor, index) => (
                        <li key={index}>{factor}</li>
                      )
                    )}
                  </ul>
                )}
              </>
            )}
        </>
      ) : (
        <p className="text-xs text-slate-400">
          🔒 Explicación disponible para usuarios PRO
        </p>
      )}
    </div>
  )
}
