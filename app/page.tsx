"use client"

import { useEffect, useState } from "react"

import MatchSelector from "@/components/MatchSelector"
import DecisionSection from "@/components/DecisionSection"
import PlayerCard from "@/components/PlayerCard"
import UsageGuidelines from "@/components/UsageGuidelines"

import { fetchUpcomingNBAMatches } from "@/lib/api"
import { mockProps } from "@/lib/mockData"
import { Match } from "@/lib/types"

export default function Home() {
  // 🔹 PARTIDOS DESDE BACKEND (CLIENT SIDE)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // 🔹 SIMULACIÓN DE USUARIO
  const isProUser = true

  useEffect(() => {
    fetchUpcomingNBAMatches()
      .then(setMatches)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  // 🔹 ORDENAMOS PROPS POR EDGE
  const sortedProps = [...mockProps].sort(
    (a, b) => b.edge_over - a.edge_over
  )

  const valueBets = sortedProps.filter(
    prop => prop.bet_tier === "VALUE BET"
  )

  const noActionBets = sortedProps.filter(
    prop => prop.bet_decision === "PASS"
  )

  if (loading) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <p className="text-slate-500">Cargando partidos NBA…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <p className="text-red-600">
          Error al cargar los partidos. Intenta más tarde.
        </p>
      </main>
    )
  }

  return (
    <main className="p-6 space-y-8 max-w-3xl mx-auto">
      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">
          Panel de Props NBA
        </h1>
        <p className="text-sm text-slate-500">
          Decisiones basadas en modelo · Riesgo controlado
        </p>
      </header>

      {/* CONTEXTO */}
      <div className="border rounded-xl p-4 bg-slate-50 space-y-1">
        <p className="text-sm text-slate-500">NBA · Hoy</p>
        <p>
          <strong>Script del juego:</strong> Ritmo alto /
          anotación elevada
        </p>
        <p>
          <strong>Postura del modelo:</strong> Enfoque ofensivo
        </p>
      </div>

      {/* PARTIDOS */}
      <MatchSelector matches={matches} />

      {/* GUÍA */}
      <UsageGuidelines />

      {/* VALUE BETS */}
      <DecisionSection
        title="Decisiones principales"
        description="Oportunidades con valor esperado positivo"
      >
        {valueBets.map((prop, index) => (
          <PlayerCard
            key={index}
            prop={prop}
            isProUser={isProUser}
          />
        ))}
      </DecisionSection>

      {/* INFORMATIVO */}
      <DecisionSection
        title="Análisis informativo"
        description="Líneas sin acción recomendada"
      >
        {noActionBets.map((prop, index) => (
          <PlayerCard
            key={index}
            prop={prop}
            isProUser={isProUser}
          />
        ))}
      </DecisionSection>
    </main>
  )
}
