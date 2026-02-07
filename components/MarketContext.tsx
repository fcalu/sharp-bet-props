type Props = {
  league: string
  gameScript: string
  modelStance: string
}

export default function MarketContext({
  league,
  gameScript,
  modelStance,
}: Props) {
  return (
    <div className="bg-slate-50 border rounded-xl p-3 sm:p-4 space-y-1">
      <p className="text-sm text-slate-500">
        {league} · Hoy
      </p>

      <p className="text-sm">
        <span className="font-medium">Script del juego:</span>{" "}
        {gameScript}
      </p>

      <p className="text-sm">
        <span className="font-medium">Postura del modelo:</span>{" "}
        {modelStance}
      </p>
    </div>
  )
}
