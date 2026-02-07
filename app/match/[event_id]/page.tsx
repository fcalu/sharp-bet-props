"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import PlayerCard from "@/components/PlayerCard"
import UsageGuidelines from "@/components/UsageGuidelines"

import { Match, PredictionResponse } from "@/lib/types"
import FinalConclusion from "@/components/FinalConclusion"

type PredictionState =
  | "idle"
  | "loading"
  | "ready"
  | "no-edge"
  | "error"

export default function MatchPage() {
  const { event_id } = useParams<{ event_id: string }>()

  const [match, setMatch] = useState<Match | null>(null)
  const [prediction, setPrediction] =
    useState<PredictionResponse | null>(null)
  const [state, setState] =
    useState<PredictionState>("loading")

  const isProUser = true // luego auth real

  useEffect(() => {
    if (!event_id) return

    const loadPrediction = async () => {
      try {
        setState("loading")

        // 1️⃣ Traer partidos próximos
        const matchesRes = await fetch(
          "https://sportia-api.onrender.com/api/v1/matches/upcoming?sport=nba"
        )

        if (!matchesRes.ok)
          throw new Error("Error cargando partidos")

        const matches: Match[] = await matchesRes.json()

        // 2️⃣ Buscar el partido correcto
        const foundMatch = matches.find(
          m => m.event_id === event_id
        )

        if (!foundMatch)
          throw new Error("Partido no encontrado")

        setMatch(foundMatch)

        // 3️⃣ Pedir predicción REAL
        const predictionRes = await fetch(
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
              event_id: foundMatch.event_id,
              home_team: foundMatch.home,
              away_team: foundMatch.away,
            }),
          }
        )

        if (!predictionRes.ok)
          throw new Error("Error en predicción")

        const data: PredictionResponse =
          await predictionRes.json()

        setPrediction(data)

        if (!data.player_props || data.player_props.length === 0) {
          setState("no-edge")
        } else {
          setState("ready")
        }
      } catch (err) {
        console.error(err)
        setState("error")
      }
    }

    loadPrediction()
  }, [event_id])

  if (state === "loading") {
    return (
      <main className="p-6 max-w-3xl mx-auto text-center">
        <p className="text-slate-500">Cargando partido…</p>
      </main>
    )
  }

  if (state === "error" || !match) {
    return (
      <main className="p-6 max-w-3xl mx-auto text-center">
        <p className="text-red-600">
          Error al cargar la predicción.
        </p>
      </main>
    )
  }

  return (
    <main className="p-6 space-y-8 max-w-3xl mx-auto">
      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold">
          {match.home} vs {match.away}
        </h1>
        <p className="text-sm text-slate-500">
          Event ID: {match.event_id}
        </p>
      </header>

      {/* CONTEXTO */}
      <div className="border rounded-xl p-4 bg-slate-50">
        <p>
          <strong>Script del juego:</strong>{" "}
          {prediction?.game_script === "high_scoring"
            ? "Puntuación alta"
            : "Puntuación baja"}
        </p>
        <p>
          <strong>Casa de apuestas:</strong>{" "}
          {prediction?.odds.provider}
        </p>
      </div>

      <UsageGuidelines />
      {prediction && (
        <FinalConclusion props={prediction.player_props} />
        )}
      {/* PLAYER PROPS */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Análisis de jugadores
        </h2>

        {state === "no-edge" && (
          <p className="text-slate-500">
            No se detectaron apuestas con valor en este partido.
          </p>
        )}

        {prediction?.player_props.map((prop, idx) => (
          <PlayerCard
            key={idx}
            prop={prop}
            isProUser={isProUser}
          />
        ))}
      </section>
    </main>
  )
}
