"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import UsageGuidelines from "@/components/UsageGuidelines"
import PlayerPropsTable from "@/components/PlayerPropsTable"
import MarketConclusion from "@/components/MarketConclusion"

import { PredictionResponse } from "@/lib/types"

type PredictionState =
  | "idle"
  | "loading"
  | "ready"
  | "no-edge"
  | "error"

export default function MatchPage() {
  const params = useParams()
  const event_id = params.event_id as string

  const [prediction, setPrediction] =
    useState<PredictionResponse | null>(null)

  const [state, setState] =
    useState<PredictionState>("idle")

  useEffect(() => {
    if (!event_id) return

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
              sport: "basketball",
              league: "basketball/nba",
              event_id,
            }),
          }
        )

        if (!res.ok) throw new Error("Backend error")

        const data: PredictionResponse =
          await res.json()

        setPrediction(data)

        if (
          !data.player_props ||
          data.player_props.length === 0
        ) {
          setState("no-edge")
        } else {
          setState("ready")
        }
      } catch (err) {
        console.error(err)
        setState("error")
      }
    }

    fetchPrediction()
  }, [event_id])

  // 🔹 LOADING
  if (state === "loading" || state === "idle") {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-slate-500">
          Cargando partido…
        </p>
      </main>
    )
  }

  // 🔹 ERROR
  if (state === "error") {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-red-600">
          Error al cargar la predicción. Intenta
          más tarde.
        </p>
      </main>
    )
  }

  if (!prediction) return null

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

      {/* PLAYER PROPS (TABLA PRO) */}
      {state === "ready" && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">
            Player Props
          </h2>

          <PlayerPropsTable
            props={prediction.player_props}
          />
        </section>
      )}

      {/* SIN EDGE */}
      {state === "no-edge" && (
        <div className="border rounded-xl p-4 bg-slate-50 text-slate-600">
          El modelo no detectó ventajas claras
          en este partido.
        </div>
      )}
    </main>
  )
}
