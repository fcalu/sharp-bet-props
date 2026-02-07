"use client"

import Link from "next/link"
import { Match } from "@/lib/types"

type Props = {
  matches: Match[]
}

export default function MatchSelector({ matches }: Props) {
  return (
    <div className="border rounded-xl p-4 bg-white space-y-3">
      <h3 className="font-semibold text-slate-900">
        Partidos NBA próximos
      </h3>

      <ul className="space-y-2">
        {matches.map(match => (
          <li key={match.event_id}>
            <Link
              href={`/match/${match.event_id}`}
              className="block p-3 border rounded-lg hover:bg-slate-50 transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {match.home} vs {match.away}
                </span>
                <span className="text-sm text-slate-500">
                  {new Date(match.start_time).toLocaleString()}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
