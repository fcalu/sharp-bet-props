type Props = {
  period: string
  picks: number
  winRate: number
  roi: number
}

export default function PerformanceSummary({
  period,
  picks,
  winRate,
  roi,
}: Props) {
  return (
    <div className="border rounded-xl p-4 bg-white space-y-2">
      <h3 className="text-sm font-semibold text-slate-900">
        Rendimiento del modelo · {period}
      </h3>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-slate-500">Picks</p>
          <p className="font-semibold">{picks}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Win rate</p>
          <p className="font-semibold">{winRate}%</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">ROI</p>
          <p
            className={`font-semibold ${
              roi >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {roi}%
          </p>
        </div>
      </div>
    </div>
  )
}
