"use client"

import { use, useEffect, useState } from "react"
import PlayerCard from "@/components/PlayerCard"
import DecisionSection from "@/components/DecisionSection"
import UsageGuidelines from "@/components/UsageGuidelines"

/* =======================
   Tipos
======================= */

type PageProps = {
  params: Promise<{
    event_id: string
  }>
}

type PredictionState =
  | "idle"
  | "loading"
  | "ready"
  | "no-edge"
  | "error"

type PredictionResponse = {
  match: string
  league: string
  odds: {
    provider: string
  }
  game_script: string
  player_props: any[]
  analysis: string
}

/* =======================
   Página
======================= */

export default function MatchPage({ params }: PageProps) {
  // ✅ AQUÍ ESTÁ LA CLAVE
  const { event_id } = use(params)

  const [predictionState, setPredictionState] =
    useState<PredictionState>("idle")

  const [prediction, setPrediction] =
    useState<PredictionResponse | null>(null)

  /* =======================
     Fetch REAL del backend
  ======================= */
  useEffect(() => {
    if (!event_id) return

    const fetchPrediction = async () => {
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
              sport: "basketball",
              league: "basketball/nba",
              event_id,
              home_team: "Orlando Magic",
              away_team: "Utah Jazz",
            }),
          }
        )

        if (!res.ok) throw new Error("Backend error")

        const data: PredictionResponse = await res.json()

        setPrediction(data)

        if (!data.player_props || data.player_props.length === 0) {
          setPredictionState("no-edge")
        } else {
          setPredictionState("ready")
        }
      } catch (err) {
        console.error(err)
        setPredictionState("error")
      }
    }

    fetchPrediction()
  }, [event_id]) // ✅ dependencia correcta

  /* =======================
     Render
  ======================= */

  return (
    <main className="p-6 space-y-8 max-w-3xl mx-auto">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          {prediction?.match ?? "Análisis del partido"}
        </h1>
        <p className="text-sm text-slate-500">
          Event ID: {event_id}
        </p>
      </header>

      {prediction && (
        <div className="border rounded-xl p-4 bg-slate-50 space-y-1">
          <p>
            <strong>Script del juego:</strong>{" "}
            {prediction.game_script === "low_scoring"
              ? "Puntuación baja"
              : "Puntuación alta"}
          </p>
          <p>
            <strong>Casa de apuestas:</strong>{" "}
            {prediction.odds.provider}
          </p>
        </div>
      )}

      {predictionState === "loading" && (
        <div className="p-4 text-center text-slate-500">
          Cargando análisis del modelo…
        </div>
      )}

      {predictionState === "error" && (
        <div className="p-4 text-center text-red-600">
          Error al cargar la predicción.
        </div>
      )}

      {predictionState === "no-edge" && (
        <div className="p-4 text-center text-slate-600">
          El modelo no detectó oportunidades con valor.
        </div>
      )}

      {predictionState === "ready" && prediction && (
        <>
          <UsageGuidelines />

          <DecisionSection
            title="Análisis de jugadores"
            description="Evaluación estadística generada por el modelo"
          >
            {prediction.player_props.map((prop, index) => (
              <PlayerCard
  key={index}
  prop={{
    name: prop.name,
    team: prop.team,
    type: prop.type,
    line: prop.line,
    confidence: prop.confidence,
    model_mean: prop.projection_model?.mean ?? null,
    edge_over: prop.edge_over,
    bet_tier: prop.bet_tier,
    bet_decision: prop.bet_decision,
    explanation_factors: prop.explanation_factors ?? [],
  }}
  isProUser={true}
/>
            ))}
          </DecisionSection>

          <div className="border rounded-xl p-4 bg-white space-y-2">
            <h3 className="font-semibold text-slate-900">
              Análisis del modelo
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
