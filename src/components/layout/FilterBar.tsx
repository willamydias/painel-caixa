'use client';

import React, { useMemo, useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { RotateCcw, Check, SlidersHorizontal, Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { parseDate } from '@/lib/formatters';

const MODALIDADES = [
  'Todos',
  'Venda Direta Online',
  'Venda Online',
  'Licitação Aberta',
  'Leilão SFI',
];

export function FilterBar() {
  const { filters, updateFilter, resetFilters, kpis, allProperties } = useDashboard();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  // Hierarchical Location Mapping (RA -> Bairros)
  const locationHierarchy = useMemo(() => {
    const map: { [ra: string]: Set<string> } = {};
    allProperties.forEach((p) => {
      const ra = p.cidade_satelite || 'Brasília';
      if (!map[ra]) map[ra] = new Set();
      if (p.bairro && p.bairro !== ra) {
        map[ra].add(p.bairro);
      }
    });

    return Object.entries(map)
      .map(([ra, bairroSet]) => ({
        ra,
        bairros: Array.from(bairroSet).sort(),
      }))
      .sort((a, b) => a.ra.localeCompare(b.ra));
  }, [allProperties]);

  // Determine current selected location value for the combined select
  const currentLocValue = useMemo(() => {
    if (filters.bairro && filters.bairro !== 'Todos') {
      return `BAIRRO:${filters.bairro}`;
    }
    if (filters.cidadeSatelite && filters.cidadeSatelite !== 'Todos') {
      return `RA:${filters.cidadeSatelite}`;
    }
    return 'ALL';
  }, [filters.bairro, filters.cidadeSatelite]);

  const handleLocationChange = (val: string) => {
    if (val === 'ALL') {
      updateFilter('cidadeSatelite', 'Todos');
      updateFilter('bairro', 'Todos');
    } else if (val.startsWith('RA:')) {
      const ra = val.replace('RA:', '');
      updateFilter('cidadeSatelite', ra);
      updateFilter('bairro', 'Todos');
    } else if (val.startsWith('BAIRRO:')) {
      const b = val.replace('BAIRRO:', '');
      const prop = allProperties.find((p) => p.bairro === b);
      updateFilter('bairro', b);
      if (prop && prop.cidade_satelite) {
        updateFilter('cidadeSatelite', prop.cidade_satelite);
      }
    }
  };

  // Extract unique clean auctioneer domain names
  const leiloeirosUnicos = useMemo(() => {
    const set = new Set<string>();
    allProperties.forEach((p) => {
      if (p.site_leiloeiro_clean) {
        set.add(p.site_leiloeiro_clean);
      }
    });
    return Array.from(set).sort();
  }, [allProperties]);

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.cidadeSatelite !== 'Todos' ||
    filters.bairro !== 'Todos' ||
    filters.modalidade !== 'Todos' ||
    filters.leiloeiro !== 'Todos' ||
    filters.fgtsOnly ||
    filters.minDescontoPct > 0 ||
    filters.veredictoFilter !== 'Todos' ||
    filters.selectedDate !== null;

  const handleSelectDate = (dateStr: string | null) => {
    updateFilter('selectedDate', dateStr);
    setIsCalendarOpen(false);
  };

  return (
    <div className="w-full border-b border-[var(--border-main)] bg-[var(--bg-sub)] px-4 py-2.5 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-[1920px]">

        {/* 1. Única Linha Horizontal com Todos os Filtros + Botão AGENDA */}
        <div className="flex items-center justify-between gap-2.5 overflow-x-auto scrollbar-none py-0.5">

          {/* Left: FILTROS Label, Botão AGENDA e Filtros Globais */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Label FILTROS: */}
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] mr-1 shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--color-primary)]" />
              <span>FILTROS:</span>
            </div>

            {/* Botão AGENDA */}
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-extrabold transition-all shrink-0 ${isCalendarOpen || filters.selectedDate
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm'
                : 'border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-[var(--color-primary)]'
                }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>AGENDA</span>
              {filters.selectedDate && (
                <span className="ml-1 rounded bg-white/20 px-1.5 py-0.2 text-[10px]">
                  {filters.selectedDate}
                </span>
              )}
            </button>

            {/* FGTS Button Toggle */}
            <button
              onClick={() => updateFilter('fgtsOnly', !filters.fgtsOnly)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-all shrink-0 ${filters.fgtsOnly
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 shadow-sm'
                : 'border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
            >
              {filters.fgtsOnly && <Check className="h-3.5 w-3.5 text-cyan-500" />}
              <span>Permite FGTS</span>
            </button>

            {/* Seletor Combinado Hierárquico: Cidade / RA -> Bairro / Setor */}
            <select
              value={currentLocValue}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-bold text-[var(--text-main)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none shrink-0 max-w-[240px] truncate"
            >
              <option value="ALL">📍 Localização: Todas</option>
              {locationHierarchy.map((item) => (
                <optgroup key={item.ra} label={`📍 ${item.ra}`}>
                  <option value={`RA:${item.ra}`}>{item.ra} (Toda a RA)</option>
                  {item.bairros.map((b) => (
                    <option key={b} value={`BAIRRO:${b}`}>
                      └ {b}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Modalidade Select */}
            <select
              value={filters.modalidade}
              onChange={(e) => updateFilter('modalidade', e.target.value)}
              className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-bold text-[var(--text-main)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none shrink-0"
            >
              <option value="Todos">Modalidade: Todas</option>
              {MODALIDADES.slice(1).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Site do Leiloeiro Select (Domínio Limpo) */}
            <select
              value={filters.leiloeiro}
              onChange={(e) => updateFilter('leiloeiro', e.target.value)}
              className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-bold text-[var(--text-main)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none shrink-0"
            >
              <option value="Todos">Leiloeiro: Todos ({leiloeirosUnicos.length})</option>
              {leiloeirosUnicos.map((lei) => (
                <option key={lei} value={lei}>
                  {lei}
                </option>
              ))}
            </select>

            {/* COMBO DE DESCONTO (Substitui os botões/pills anteriores) */}
            <select
              value={filters.minDescontoPct}
              onChange={(e) => updateFilter('minDescontoPct', Number(e.target.value))}
              className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-bold text-[var(--text-main)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none shrink-0"
            >
              <option value={0}>Desconto: Todos</option>
              <option value={30}>- 30%</option>
              <option value={50}>- 50%</option>
              <option value={65}>- 65%</option>
            </select>

            {/* Veredito Combo (Substituído Veredicto IA: por ⇅ Veredito:) */}
            <select
              value={filters.veredictoFilter}
              onChange={(e) => updateFilter('veredictoFilter', e.target.value)}
              className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-bold text-[var(--text-main)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none shrink-0"
            >
              <option value="Todos">Veredito: Todos</option>
              <option value="COMPRAR">COMPRAR</option>
              <option value="Atenção">Com Atenção</option>
              <option value="NÃO COMPRAR">NÃO COMPRAR</option>
            </select>

            {/* Limpar Filtros */}
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/20 transition-colors shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Limpar</span>
              </button>
            )}
          </div>

          {/* Right: Select de Ordenação NATIVO com opção de palavra única */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Combo Ordenar por (exibe: ⇅ Ordenar por: Score, ⇅ Ordenar por: Desconto, etc.) */}
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-extrabold text-[var(--text-main)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none cursor-pointer shrink-0"
              title="Escolha a Ordenação"
            >
              <option value="score">⇅ Ordenar: Score</option>
              <option value="desconto">⇅ Ordenar: Desconto</option>
              <option value="preco_asc">⇅ Ordenar: Menor Preço</option>
              <option value="preco_desc">⇅ Ordenar: Maior Preço</option>
              <option value="data">⇅ Ordenar: Encerramento</option>
            </select>

            {/* Count Badge */}
            <div className="rounded-lg bg-[var(--color-primary)]/10 px-2.5 py-1.5 text-xs font-extrabold text-[var(--color-primary)] border border-[var(--color-primary)]/20 shrink-0">
              {kpis.filteredCount} de {kpis.totalCount} imóveis
            </div>

          </div>

        </div>

        {/* 2. Painel de Datas Expansível da AGENDA */}
        {isCalendarOpen && (
          <div className="mt-3 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-3 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-[var(--color-primary)]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-main)]">
                  Datas Programadas ({eventsByDate.length} datas)
                </span>
              </div>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="flex items-center gap-1 rounded-lg bg-[var(--bg-sub)] px-2 py-0.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                <span>Fechar</span>
              </button>
            </div>

            {/* Timeline Horizontal de Datas */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              <button
                onClick={() => handleSelectDate(null)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all shrink-0 border ${filters.selectedDate === null
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-md'
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
                    className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all shrink-0 border ${isSelected
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-md scale-105'
                      : 'border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-main)] hover:border-[var(--color-primary)]'
                      }`}
                  >
                    <span>{dateStr}</span>
                    <span className="rounded-full bg-[var(--color-primary)]/20 px-2 py-0.5 text-[10px] font-black text-[var(--color-primary)]">
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
