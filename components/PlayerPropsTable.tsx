"use client"

import { PlayerProp } from "@/lib/types"

type Props = {
  props: PlayerProp[]
}

export default function PlayerPropsTable({ props }: Props) {
  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="p-3 text-left">Jugador</th>
            <th>Línea</th>
            <th>Decisión</th>
            <th>Edge</th>
            <th>Confianza</th>
            <th>Proyección</th>
          </tr>
        </thead>

        <tbody>
          {props.map((p, i) => (
            <tr
              key={i}
              className="border-t hover:bg-slate-50"
            >
              <td className="p-3 font-medium">
                {p.name}
                <div className="text-xs text-slate-400">
                  {p.team}
                </div>
              </td>

              <td className="text-center">
                {p.line}
              </td>

              <td
                className={`text-center font-semibold ${
                  p.bet_decision === "OVER"
                    ? "text-green-600"
                    : p.bet_decision === "UNDER"
                    ? "text-red-600"
                    : "text-slate-400"
                }`}
              >
                {p.bet_decision}
              </td>

              <td className="text-center text-green-700">
                +{(p.edge_over * 100).toFixed(1)}%
              </td>

              <td className="text-center">
                <div className="w-16 mx-auto bg-slate-200 h-2 rounded">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{
                      width: `${p.confidence}%`,
                    }}
                  />
                </div>
                <div className="text-xs">
                  {p.confidence}%
                </div>
              </td>

              <td className="text-center">
                {p.model_mean.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
