import MatchSelector from "@/components/MatchSelector"
import DecisionSection from "@/components/DecisionSection"
import PlayerCard from "@/components/PlayerCard"
import UsageGuidelines from "@/components/UsageGuidelines"

import { fetchUpcomingNBAMatches } from "@/lib/api"
import { mockProps } from "@/lib/mockData"

export default async function Home() {
  // 🔹 PARTIDOS REALES DESDE BACKEND
  const matches = await fetchUpcomingNBAMatches()

  // 🔹 SIMULACIÓN DE USUARIO (luego vendrá auth real)
  const isProUser = true

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

      {/* CONTEXTO DEL MERCADO */}
      <div className="border rounded-xl p-4 bg-slate-50 space-y-1">
        <p className="text-sm text-slate-500">NBA · Hoy</p>
        <p>
          <strong>Script del juego:</strong> Ritmo alto /
          anotación elevada
        </p>
        <p>
          <strong>Postura del modelo:</strong> Enfoque
          ofensivo
        </p>
      </div>

      {/* PARTIDOS REALES */}
      <MatchSelector matches={matches} />

      {/* RENDIMIENTO DEL MODELO */}
      <div className="border rounded-xl p-4 bg-white">
        <h3 className="font-semibold text-slate-900 mb-3">
          Rendimiento del modelo · Últimos 30 días
        </h3>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-slate-500">Picks</p>
            <p className="text-lg font-bold">48</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Win rate</p>
            <p className="text-lg font-bold">56%</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">ROI</p>
            <p className="text-lg font-bold text-green-600">
              8.4%
            </p>
          </div>
        </div>
      </div>

      {/* GUÍA DE USO */}
      <UsageGuidelines />

      {/* DECISIONES PRINCIPALES */}
      <DecisionSection
        title="Decisiones principales"
        description="Oportunidades validadas por el modelo con valor esperado positivo"
      >
        {valueBets.map((prop, index) => (
          <PlayerCard
            key={index}
            prop={prop}
            isProUser={isProUser}
          />
        ))}
      </DecisionSection>

      {/* SOLO INFORMATIVO */}
      <DecisionSection
        title="Análisis informativo"
        description="Líneas con ventaja leve o varianza elevada (sin acción recomendada)"
      >
        {noActionBets.map((prop, index) => (
          <PlayerCard
            key={index}
            prop={prop}
            isProUser={isProUser}
          />
        ))}
      </DecisionSection>

      {/* CTA PRO */}
      {!isProUser && (
        <div className="border rounded-xl p-6 bg-slate-50 text-center space-y-3">
          <p className="font-medium">
            Accede a explicaciones completas del modelo y
            análisis avanzados
          </p>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg">
            Desbloquear versión PRO
          </button>
          <p className="text-xs text-slate-400">
            (Simulación · sin pago real por ahora)
          </p>
        </div>
      )}
    </main>
  )
}
