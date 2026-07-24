'use client';

import React, { useMemo, useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Calendar as CalendarIcon, Clock, ChevronDown, ChevronUp, Filter, Sparkles, X } from 'lucide-react';
import { parseDate } from '@/lib/formatters';

export function AuctionCalendar() {
  const { allProperties, filters, updateFilter } = useDashboard();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Extract all unique auction dates and group properties by date
  const eventsByDate = useMemo(() => {
    const map: { [dateStr: string]: number } = {};
    allProperties.forEach((p) => {
      if (p.data_1) {
        const cleanD1 = p.data_1.split(' ')[0];
        map[cleanD1] = (map[cleanD1] || 0) + 1;
      }
      if (p.data_2) {
        const cleanD2 = p.data_2.split(' ')[0];
        map[cleanD2] = (map[cleanD2] || 0) + 1;
      }
    });
    return Object.entries(map).sort((a, b) => {
      const da = parseDate(a[0]);
      const db = parseDate(b[0]);
      if (!da || !db) return 0;
      return da.getTime() - db.getTime();
    });
  }, [allProperties]);

  // Find closest future auction date
  const closestEvent = useMemo(() => {
    if (eventsByDate.length === 0) return null;
    const now = new Date();
    for (const [dateStr, count] of eventsByDate) {
      const dt = parseDate(dateStr);
      if (dt && dt.getTime() >= now.getTime() - 86400000) {
        return { dateStr, count, dt };
      }
    }
    return { dateStr: eventsByDate[0][0], count: eventsByDate[0][1], dt: parseDate(eventsByDate[0][0]) };
  }, [eventsByDate]);

  if (eventsByDate.length === 0) return null;

  const handleSelectDate = (dateStr: string | null) => {
    updateFilter('selectedDate', dateStr);
    // Autorretratação: recolhe automaticamente após selecionar uma data
    setIsOpen(false);
  };

  return (
    <div className="w-full bg-[var(--bg-sub)] border-b border-[var(--border-main)] px-4 py-2 sm:px-6 lg:px-8 transition-all">
      <div className="mx-auto max-w-[1920px] relative">
        
        {/* State 1: Compact Suspended Button (Esquerda da Seção Cinza) */}
        {!isOpen ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] px-3.5 py-1.5 text-xs font-extrabold text-[var(--text-main)] shadow-sm hover:border-blue-500 transition-all hover:scale-[1.02]"
              >
                <CalendarIcon className="h-4 w-4 text-blue-500" />
                <span>Calendário de Leilões</span>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-extrabold text-blue-500 border border-blue-500/20">
                  {eventsByDate.length} datas
                </span>
                <ChevronDown className="h-4 w-4 text-[var(--text-muted)] ml-1" />
              </button>

              {filters.selectedDate && (
                <div className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  <span>Data: {filters.selectedDate}</span>
                  <button
                    onClick={() => handleSelectDate(null)}
                    className="hover:bg-blue-700 rounded p-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {closestEvent && (
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
                <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                <span>Próxima Data: <strong className="text-[var(--text-main)]">{closestEvent.dateStr}</strong> ({closestEvent.count} lotes)</span>
              </div>
            )}
          </div>
        ) : (
          /* State 2: Expanded Full-Width Panel (Restrito à Seção Cinza com Autorretratação ao Clicar) */
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Header of Expanded Panel */}
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-500" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-main)]">
                  Selecione uma Data do Calendário de Leilões
                </h4>
                <span className="text-[10px] text-[var(--text-muted)] italic">
                  (O painel recolhe automaticamente ao escolher)
                </span>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1 rounded-lg bg-[var(--bg-sub)] px-2.5 py-1 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Fechar</span>
              </button>
            </div>

            {/* Dates Grid Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={() => handleSelectDate(null)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all shrink-0 border ${
                  filters.selectedDate === null
                    ? 'border-blue-500 bg-blue-600 text-white shadow-md'
                    : 'border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                <span>Todas as Datas</span>
              </button>

              {eventsByDate.map(([dateStr, count]) => {
                const isSelected = filters.selectedDate === dateStr;
                return (
                  <button
                    key={dateStr}
                    onClick={() => handleSelectDate(dateStr)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all shrink-0 border ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600 text-white shadow-md scale-105'
                        : 'border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-main)] hover:border-blue-500'
                    }`}
                  >
                    <span>{dateStr}</span>
                    <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-black text-blue-500">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
