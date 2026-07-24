'use client';

import React from 'react';
import { Property } from '@/types/property';
import { useDashboard } from '@/context/DashboardContext';
import { ScoreBadge } from './ScoreBadge';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { ExternalLink, Star } from 'lucide-react';

interface OpportunityTableProps {
  properties: Property[];
}

export function OpportunityTable({ properties }: OpportunityTableProps) {
  const { setSelectedPropertyId, hoveredPropertyId, setHoveredPropertyId, favorites, toggleFavorite } = useDashboard();

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <tr>
            <th className="p-3 w-10 text-center">Fav</th>
            <th className="p-3">Score</th>
            <th className="p-3">ID / Imóvel</th>
            <th className="p-3">Bairro</th>
            <th className="p-3">Modalidade</th>
            <th className="p-3 text-right">Valor Mínimo</th>
            <th className="p-3 text-right">Avaliação</th>
            <th className="p-3 text-center">Desconto</th>
            <th className="p-3 text-center">Veredicto</th>
            <th className="p-3 text-center">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
          {properties.map((p) => {
            const isHovered = hoveredPropertyId === p.id;
            const isFavorite = favorites.includes(p.id);

            return (
              <tr
                key={p.id}
                onMouseEnter={() => setHoveredPropertyId(p.id)}
                onMouseLeave={() => setHoveredPropertyId(null)}
                onClick={() => setSelectedPropertyId(p.id)}
                className={`cursor-pointer transition-colors ${
                  isHovered
                    ? 'bg-blue-50/60 dark:bg-blue-950/40'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleFavorite(p.id)}
                    className="text-slate-300 hover:text-amber-400 dark:text-slate-600"
                  >
                    <Star className={`h-4 w-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </td>
                <td className="p-3">
                  <ScoreBadge score={p.score} size="sm" />
                </td>
                <td className="p-3 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block">{p.id}</span>
                  {p.endereco}
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-300 font-bold">{p.bairro}</td>
                <td className="p-3 text-slate-600 dark:text-slate-400">{p.modalidade}</td>
                <td className="p-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(p.valor_minimo_num)}
                </td>
                <td className="p-3 text-right text-slate-400 line-through">
                  {formatCurrency(p.valor_avaliacao_num)}
                </td>
                <td className="p-3 text-center">
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    -{formatPercent(p.desconto_pct)}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`rounded px-2 py-0.5 font-bold text-[10px] ${
                      p.veredicto.includes('NÃO COMPRAR')
                        ? 'bg-rose-500/10 text-rose-600'
                        : p.veredicto.includes('Atenção')
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-emerald-500/10 text-emerald-600'
                    }`}
                  >
                    {p.veredicto}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => setSelectedPropertyId(p.id)}
                    className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-blue-700 transition-colors"
                  >
                    Detalhes
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
