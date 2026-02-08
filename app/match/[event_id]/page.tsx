"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import PlayerCard from "@/components/PlayerCard"
import UsageGuidelines from "@/components/UsageGuidelines"
import MarketConclusion from "@/components/MarketConclusion"

import { PredictionResponse } from "@/lib/types"

type PredictionState =
  | "loading"
  | "ready"
  | "no-prediction"
  | "error"

export default function MatchPage() {
  const { event_id } = useParams<{ event_id: string }>()

  const [prediction, setPrediction] =
    useState<PredictionResponse | null>(null)

  const [state, setState] =
    useState<PredictionState>("loading")

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
            },
            body: JSON.stringify({
              sport: "nba",
              league: "basketball/nba",
              event_id,
            }),
          }
        )

        if (!res.ok) {
          setState("no-prediction")
          return
        }

        const data: PredictionResponse = await res.json()

        if (
          !data.player_props ||
          data.player_props.length === 0
        ) {
          setPrediction(data)
          setState("no-prediction")
          return
        }

        setPrediction(data)
        setState("ready")
      } catch (err) {
        console.error(err)
        setState("error")
      }
    }

    fetchPrediction()
  }, [event_id])

  /* ===========================
     ESTADOS
     =========================== */

  if (state === "loading") {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-slate-500">
          Cargando análisis del partido…
        </p>
      </main>
    )
  }

  if (state === "error") {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-red-600">
          Error técnico al cargar la predicción.
        </p>
      </main>
    )
  }

  return (
    <main className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">
          {prediction?.match ?? "Partido NBA"}
        </h1>
        <p className="text-sm text-slate-500">
          Event ID: {event_id}
        </p>
      </header>

      {/* CONCLUSIÓN SI EXISTE */}
      {prediction && (
        <MarketConclusion prediction={prediction} />
      )}

      {/* SIN PREDICCIÓN */}
      {state === "no-prediction" && (
        <div className="border rounded-xl p-4 bg-slate-50 text-slate-600">
          El modelo aún no ha generado una predicción para
          este partido. Esto puede deberse a falta de datos
          de mercado u horarios aún no consolidados.
        </div>
      )}

      {/* PROPS */}
      {prediction?.player_props &&
        prediction.player_props.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Análisis de jugadores
            </h2>

            {prediction.player_props.map((prop, i) => (
              <PlayerCard
                key={i}
                prop={prop}
                isProUser={true}
              />
            ))}
          </section>
        )}

      {/* GUÍA */}
      <UsageGuidelines />
    </main>
  )
}
