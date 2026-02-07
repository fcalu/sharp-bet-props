"use client"

import { useEffect, useState } from "react"

import UsageGuidelines from "@/components/UsageGuidelines"
import DecisionSection from "@/components/DecisionSection"
import PlayerCard from "@/components/PlayerCard"

import { Match, PredictionResponse } from "@/lib/types"

type PredictionState =
  | "idle"
  | "loading"
  | "ready"
  | "no-edge"
  | "error"

type Props = {
  params: {
    event_id: string
  }
}

export default function MatchPage({ params }: Props) {
  const { event_id } = params

  const [match, setMatch] = useState<Match | null>(null)
  const [prediction, setPrediction] =
    useState<PredictionResponse | null>(null)

  const [predictionState, setPredictionState] =
    useState<PredictionState>("idle")

  /* =====================================================
     1️⃣ CARGAR PARTIDO REAL DESDE API
  ===================================================== */
  useEffect(() => {
    fetch(
      "https://sportia-api.onrender.com/api/v1/matches/upcoming?sport=nba"
    )
      .then(res => res.json())
      .then((matches: Match[]) => {
        const found = matches.find(
          m => m.event_id === event_id
        )
        if (!found) throw new Error("Match not found")
        setMatch(found)
      })
      .catch(err => {
        console.error(err)
        setPredictionState("error")
      })
  }, [event_id])

  /* =====================================================
     2️⃣ FETCH DE PREDICCIÓN (SIN HARDCODEOS)
  ===================================================== */
  const fetchPrediction = async () => {
    if (!match) return

    try {
      setPredictionState("loading")

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
            event_id: match.event_id,
            home_team: match.home,
            away_team: match.away,
          }),
        }
      )

      if (!res.ok) throw new Error("Prediction error")

      const data: PredictionResponse = await res.json()
      setPrediction(data)

      setPredictionState(
        !data.player_props || data.player_props.length === 0
          ? "no-edge"
          : "ready"
      )
    } catch (err) {
      console.error(err)
      setPredictionState("error")
    }
  }

  /* =====================================================
     3️⃣ DISPARAR PREDICCIÓN CUANDO YA TENEMOS MATCH
  ===================================================== */
  useEffect(() => {
    if (match) fetchPrediction()
  }, [match])

  /* =====================================================
     4️⃣ ESTADOS DE UI
  ===================================================== */
  if (!match) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <p className="text-slate-500">
          Cargando partido…
        </p>
      </main>
    )
  }

  return (
    <main className="p-6 space-y-8 max-w-3xl mx-auto">
      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">
          {match.home} vs {match.away}
        </h1>
        <p className="text-sm text-slate-500">
          Event ID: {match.event_id}
        </p>
      </header>

      {/* CONTEXTO */}
      {prediction && (
        <div className="border rounded-xl p-4 bg-slate-50 space-y-1">
          <p>
            <strong>Script del juego:</strong>{" "}
            {prediction.game_script === "high_scoring"
              ? "Puntuación alta"
              : "Puntuación baja"}
          </p>
          <p>
            <strong>Casa de apuestas:</strong>{" "}
            {prediction.odds.provider}
          </p>
        </div>
      )}

      {/* GUÍA */}
      <UsageGuidelines />

      {/* ESTADOS */}
      {predictionState === "loading" && (
        <p className="text-slate-500 text-center">
          Ejecutando modelo…
        </p>
      )}

      {predictionState === "error" && (
        <p className="text-red-600 text-center">
          Error al generar la predicción.
        </p>
      )}

      {predictionState === "no-edge" && (
        <p className="text-slate-600 text-center">
          El modelo no detectó valor en este partido.
        </p>
      )}

      {/* RESULTADOS */}
      {predictionState === "ready" && prediction && (
        <>
          <DecisionSection
            title="Análisis de jugadores"
            description="Evaluación estadística generada por el modelo"
          >
            {prediction.player_props.map((prop, idx) => (
              <PlayerCard
                key={idx}
                prop={prop}
                isProUser={true}
              />
            ))}
          </DecisionSection>

          <div className="border rounded-xl p-4 bg-white">
            <h3 className="font-semibold mb-2">
              Conclusión del modelo
            </h3>
            <p className="text-sm text-slate-700 whitespace-pre-line">
              {prediction.analysis}
            </p>
          </div>
        </>
      )}
    </main>
  )
}
