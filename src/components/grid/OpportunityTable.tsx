'use client';

import React from 'react';
import { Property } from '@/types/property';
import { useDashboard } from '@/context/DashboardContext';
import { ScoreBadge } from './ScoreBadge';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { FileEdit, Star } from 'lucide-react';

interface OpportunityTableProps {
  properties: Property[];
}

export function OpportunityTable({ properties }: OpportunityTableProps) {
  const { setSelectedPropertyId, hoveredPropertyId, setHoveredPropertyId, favorites, toggleFavorite, setActiveNoteProperty, propertyNotes } = useDashboard();

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-[var(--border-main)] bg-[var(--bg-sub)] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          <tr>
            <th className="p-3 w-10 text-center">Fav</th>
            <th className="p-3">Score</th>
            <th className="p-3">ID / Imóvel</th>
            <th className="p-3">Bairro</th>
            <th className="p-3">Modalidade</th>
            <th className="p-3 text-right">Valor Mínimo</th>
            <th className="p-3 text-right">Avaliação</th>
            <th className="p-3 text-center">Desconto</th>
            <th className="p-3 text-center">Anotação DB</th>
            <th className="p-3 text-center">Veredicto</th>
            <th className="p-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-main)] font-medium">
          {properties.map((p) => {
            const isHovered = hoveredPropertyId === p.id;
            const isFavorite = favorites.includes(p.id);
            const note = propertyNotes[p.id];

            return (
              <tr
                key={p.id}
                onMouseEnter={() => setHoveredPropertyId(p.id)}
                onMouseLeave={() => setHoveredPropertyId(null)}
                onClick={() => {
                  setSelectedPropertyId(p.id);
                  window.location.href = `/detalhes/${p.id}`;
                }}
                className={`cursor-pointer transition-colors ${
                  isHovered
                    ? 'bg-[var(--color-primary)]/10'
                    : 'hover:bg-[var(--bg-sub)]'
                }`}
              >
                <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleFavorite(p.id)}
                    className="text-[var(--text-muted)] hover:text-amber-400"
                  >
                    <Star className={`h-4 w-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </td>
                <td className="p-3">
                  <ScoreBadge score={p.score} size="sm" />
                </td>
                <td className="p-3 font-semibold text-[var(--text-main)] max-w-[200px] truncate">
                  <span className="text-[10px] text-[var(--color-primary)] font-bold block">{p.id}</span>
                  {p.endereco}
                </td>
                <td className="p-3 text-[var(--text-main)] font-bold">{p.bairro}</td>
                <td className="p-3 text-[var(--text-muted)]">{p.modalidade}</td>
                <td className="p-3 text-right font-extrabold text-emerald-600">
                  {formatCurrency(p.valor_minimo_num)}
                </td>
                <td className="p-3 text-right text-[var(--text-muted)] line-through">
                  {formatCurrency(p.valor_avaliacao_num)}
                </td>
                <td className="p-3 text-center">
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-bold text-emerald-600 border border-emerald-500/20">
                    -{formatPercent(p.desconto_pct)}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {note ? (
                    <span className="rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 text-[9px] font-bold">
                      {note.kanban_status}
                    </span>
                  ) : (
                    <span className="text-[var(--text-muted)] text-[10px] italic">-</span>
                  )}
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
                  <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setActiveNoteProperty(p)}
                      className="rounded-lg bg-[var(--bg-sub)] p-1.5 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                      title="Adicionar Anotação / Parecer"
                    >
                      <FileEdit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPropertyId(p.id);
                        window.location.href = `/detalhes/${p.id}`;
                      }}
                      className="rounded-lg bg-[var(--color-primary)] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                    >
                      Ver
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
