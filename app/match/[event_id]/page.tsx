"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import UsageGuidelines from "@/components/UsageGuidelines"
import PlayerPropsTable from "@/components/PlayerPropsTable"
import MarketConclusion from "@/components/MarketConclusion"

import { PredictionResponse, Match } from "@/lib/types"

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

  const [match, setMatch] = useState<Match | null>(null)
  const [state, setState] =
    useState<PredictionState>("idle")

  useEffect(() => {
    if (!event_id) return

    const fetchData = async () => {
      try {
        setState("loading")

        // 1️⃣ Traer partidos
        const matchesRes = await fetch(
          "https://sportia-api.onrender.com/api/v1/matches/upcoming?sport=nba"
        )

        if (!matchesRes.ok)
          throw new Error("Error fetching matches")

        const matches: Match[] = await matchesRes.json()

        const currentMatch = matches.find(
          m => m.event_id === event_id
        )

        if (!currentMatch)
          throw new Error("Match not found")

        setMatch(currentMatch)

        // 2️⃣ Pedir predicción REAL
        const predictRes = await fetch(
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
              home_team: currentMatch.home,
              away_team: currentMatch.away,
            }),
          }
        )

        if (!predictRes.ok)
          throw new Error("Prediction error")

        const data: PredictionResponse =
          await predictRes.json()

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

    fetchData()
  }, [event_id])

  // 🔹 LOADING
  if (state === "idle" || state === "loading") {
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

  if (!prediction || !match) return null

  return (
    <main className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">
          {match.home} vs {match.away}
        </h1>
        <p className="text-sm text-slate-500">
          Event ID: {event_id}
        </p>
      </header>

      {/* CONCLUSIÓN DEL MERCADO */}
      <MarketConclusion prediction={prediction} />

      {/* GUÍA */}
      <UsageGuidelines />

      {/* PLAYER PROPS */}
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
