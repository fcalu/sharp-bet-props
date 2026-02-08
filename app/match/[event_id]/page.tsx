"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import PlayerCard from "@/components/PlayerCard"
import UsageGuidelines from "@/components/UsageGuidelines"
import MarketConclusion from "@/components/MarketConclusion"

import { PredictionResponse } from "@/lib/types"

type State = "loading" | "ready" | "error"

export default function MatchPredictionPage() {
  const { event_id } = useParams<{ event_id: string }>()

  const [prediction, setPrediction] =
    useState<PredictionResponse | null>(null)
  const [state, setState] = useState<State>("loading")

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setState("loading")

        const res = await fetch(
          "https://sportia-api.onrender.com/api/v1/ai/predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              sport: "nba",
              league: "basketball/nba",
              event_id,
            }),
          }
        )

        if (!res.ok) throw new Error("Prediction error")

        const data: PredictionResponse = await res.json()

        setPrediction(data)
        setState("ready")
      } catch (err) {
        console.error(err)
        setState("error")
      }
    }

    fetchPrediction()
  }, [event_id])

  // 🔹 LOADING
  if (state === "loading") {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-slate-500">Cargando partido…</p>
      </main>
    )
  }

  // 🔹 ERROR
  if (state === "error" || !prediction) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-red-600">
          Error al cargar la predicción. Intenta más tarde.
        </p>
      </main>
    )
  }

  const props = prediction.player_props ?? []

  const valueProps = props.filter(
    p => p.bet_tier === "VALUE BET"
  )

  const infoProps =
    valueProps.length > 0
      ? props.filter(p => p.bet_tier !== "VALUE BET")
      : props

  return (
    <main className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">
          {prediction.match}
        </h1>
        <p className="text-sm text-slate-500">
          Event ID: {event_id}
        </p>
      </header>

      {/* CONCLUSIÓN DEL MODELO */}
      <MarketConclusion prediction={prediction} />

      {/* GUÍA */}
      <UsageGuidelines />

      {/* PLAYER PROPS */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Análisis de jugadores
        </h2>

        {/* VALUE BETS */}
        {valueProps.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-green-700">
              Props con ventaja del modelo
            </h3>

            {valueProps.map((prop, i) => (
              <PlayerCard
                key={i}
                prop={prop}
                isProUser={true}
              />
            ))}
          </div>
        )}

        {/* INFORMATIVO (fallback) */}
        {valueProps.length === 0 && (
          <div className="border rounded-xl p-4 bg-slate-50 text-slate-600">
            El modelo no detectó ventajas estadísticas claras
            en este partido. A continuación se muestran las
            proyecciones base del modelo (uso informativo).
          </div>
        )}

        {infoProps.map((prop, i) => (
          <PlayerCard
            key={`info-${i}`}
            prop={prop}
            isProUser={true}
          />
        ))}
      </section>
    </main>
  )
}
