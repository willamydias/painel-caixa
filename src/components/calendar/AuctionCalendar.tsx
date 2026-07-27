'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Property } from '@/types/property';
import { formatCurrency } from '@/lib/formatters';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Grid,
  ListFilter,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export function AuctionCalendar() {
  const { allProperties, setSelectedPropertyId } = useDashboard();

  // Obter a data atual de hoje() dinamicamente
  const now = useMemo(() => new Date(), []);
  const todayDayNumber = now.getDate();
  const todayMonthNumber = now.getMonth() + 1;
  const todayYearNumber = now.getFullYear();

  const todayDateStr = useMemo(() => {
    const d = todayDayNumber < 10 ? `0${todayDayNumber}` : `${todayDayNumber}`;
    const m = todayMonthNumber < 10 ? `0${todayMonthNumber}` : `${todayMonthNumber}`;
    return `${d}/${m}/${todayYearNumber}`;
  }, [todayDayNumber, todayMonthNumber, todayYearNumber]);

  const todayMonthYearStr = useMemo(() => {
    const m = todayMonthNumber < 10 ? `0${todayMonthNumber}` : `${todayMonthNumber}`;
    return `${m}/${todayYearNumber}`;
  }, [todayMonthNumber, todayYearNumber]);

  // Estado inicial do calendário iniciando apresentação em Hoje()
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>(todayMonthYearStr);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('Todas');

  // Mapear imóveis por data de leilão/encerramento (DD/MM/YYYY)
  const propertiesByDate = useMemo(() => {
    const map: { [dateStr: string]: Property[] } = {};
    allProperties.forEach((p) => {
      const datesToProcess = [];
      if (p.data_1) datesToProcess.push(p.data_1.split(' ')[0]);
      if (p.data_2) datesToProcess.push(p.data_2.split(' ')[0]);
      
      datesToProcess.forEach((dateStr) => {
        if (!map[dateStr]) {
          map[dateStr] = [];
        }
        if (!map[dateStr].some((item) => item.id === p.id)) {
          map[dateStr].push(p);
        }
      });
    });
    return map;
  }, [allProperties]);

  // Obter lista de datas únicas ordenadas para o filtro de combo
  const uniqueDatesList = useMemo(() => {
    return Object.keys(propertiesByDate).sort((a, b) => {
      const [da, ma, ya] = a.split('/').map(Number);
      const [db, mb, yb] = b.split('/').map(Number);
      return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
    });
  }, [propertiesByDate]);

  // Se o mês de Hoje() não tiver leilões cadastrados, selecionar automaticamente o primeiro mês com imóveis
  useEffect(() => {
    if (uniqueDatesList.length > 0) {
      const firstEventDate = uniqueDatesList[0];
      const [, m, y] = firstEventDate.split('/');
      const firstEventMonthYear = `${m}/${y}`;
      
      // Se não houver imóveis no mês de hoje, ajusta suavemente para o primeiro mês com eventos
      const hasEventsInTodayMonth = Object.keys(propertiesByDate).some((d) => d.endsWith(todayMonthYearStr));
      if (!hasEventsInTodayMonth && firstEventMonthYear) {
        setSelectedMonthYear(firstEventMonthYear);
      }
    }
  }, [uniqueDatesList, propertiesByDate, todayMonthYearStr]);

  // Gerar dias do mês selecionado
  const monthCalendarDays = useMemo(() => {
    const [monthStr, yearStr] = selectedMonthYear.split('/');
    const month = parseInt(monthStr, 10) - 1;
    const year = parseInt(yearStr, 10);

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Dom) a 6 (Sáb)
    const daysInMonth = lastDayOfMonth.getDate();

    const daysArray = [];

    // Dias em branco do mês anterior para alinhar o grid
    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.push({ dayNumber: null, dateStr: null, isCurrentMonth: false });
    }

    // Dias do mês atual
    for (let d = 1; d <= daysInMonth; d++) {
      const dayFormatted = d < 10 ? `0${d}` : `${d}`;
      const monthFormatted = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
      const dateStr = `${dayFormatted}/${monthFormatted}/${year}`;
      daysArray.push({ dayNumber: d, dateStr, isCurrentMonth: true });
    }

    return daysArray;
  }, [selectedMonthYear]);

  // Gerar semana de exibição ancorada na data de hoje()
  const weekCalendarDays = useMemo(() => {
    const [monthStr, yearStr] = selectedMonthYear.split('/');
    const month = parseInt(monthStr, 10) - 1;
    const year = parseInt(yearStr, 10);
    
    // Ancorar no dia de Hoje ou dia 15 do mês
    const refDay = (now.getMonth() === month && now.getFullYear() === year) ? now.getDate() : 15;
    const refDate = new Date(year, month, refDay);
    const dayOfWeek = refDate.getDay();
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const dt = new Date(refDate);
      dt.setDate(refDate.getDate() - dayOfWeek + i);
      const d = dt.getDate();
      const m = dt.getMonth() + 1;
      const y = dt.getFullYear();
      const dayFormatted = d < 10 ? `0${d}` : `${d}`;
      const monthFormatted = m < 10 ? `0${m}` : `${m}`;
      const dateStr = `${dayFormatted}/${monthFormatted}/${y}`;
      weekDays.push({ dayNumber: d, dateStr, isCurrentMonth: true });
    }
    return weekDays;
  }, [selectedMonthYear, now]);

  const currentGridDays = viewMode === 'month' ? monthCalendarDays : weekCalendarDays;

  return (
    <div className="w-full space-y-6">
      
      {/* 1. Toolbar de Controle do Calendário Expandido */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 shadow-sm">
        
        {/* Lado Esquerdo: Título, Data de Hoje & Status */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-md">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[var(--text-main)] flex items-center gap-2">
              Agenda de Leilões Imobiliários
              <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 text-[10px] font-bold border border-emerald-500/20">
                Hoje: {todayDateStr}
              </span>
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Apresentação iniciada em Hoje ({todayDateStr}) com {uniqueDatesList.length} datas mapeadas
            </p>
          </div>
        </div>

        {/* Lado Direito: Modos (Mensal/Semanal) & Filtro de Data (Combo Select) */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Combo List de Filtro de Mês/Ano */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)]">
            <ListFilter className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <select
              value={selectedMonthYear}
              onChange={(e) => setSelectedMonthYear(e.target.value)}
              className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-2 text-xs font-bold text-[var(--text-main)] focus:border-[var(--color-primary)] focus:outline-none"
            >
              <option value="07/2026">Julho 2026</option>
              <option value="08/2026">Agosto 2026</option>
              <option value="09/2026">Setembro 2026</option>
            </select>
          </div>

          {/* Combo List de Filtro de Data Específica */}
          <select
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-2 text-xs font-bold text-[var(--text-main)] focus:border-[var(--color-primary)] focus:outline-none"
          >
            <option value="Todas">Todas as Datas Mapeadas</option>
            {uniqueDatesList.map((dt) => (
              <option key={dt} value={dt}>
                {dt} ({propertiesByDate[dt]?.length || 0} leilões)
              </option>
            ))}
          </select>

          {/* Toggle de Modo: Mensal vs Semanal */}
          <div className="flex items-center rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Grid className="h-3.5 w-3.5" /> Mensal
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Clock className="h-3.5 w-3.5" /> Semanal
            </button>
          </div>

        </div>

      </div>

      {/* 2. Grid de Dias do Calendário (Expandido Ocupando Todo o Painel Disponível) */}
      <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
        
        {/* Cabeçalho da Semana (Dom, Seg, Ter, Quar, Qui, Sex, Sáb) */}
        <div className="grid grid-cols-7 border-b border-[var(--border-main)] bg-[var(--bg-sub)] text-center text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] py-3">
          <span>Domingo</span>
          <span>Segunda</span>
          <span>Terça</span>
          <span>Quarta</span>
          <span>Quinta</span>
          <span>Sexta</span>
          <span>Sábado</span>
        </div>

        {/* Células de Dias do Calendário com os Imóveis Posicionados no Dia Exato */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[var(--border-main)] bg-[var(--bg-card)]">
          {currentGridDays.map((cell, idx) => {
            const dateStr = cell.dateStr;
            const dayProperties = dateStr && propertiesByDate[dateStr] ? propertiesByDate[dateStr] : [];
            const isFilterMatch = selectedDateFilter === 'Todas' || selectedDateFilter === dateStr;
            const isToday = dateStr === todayDateStr;

            return (
              <div
                key={idx}
                className={`min-h-[160px] p-2 flex flex-col justify-between transition-colors ${
                  isToday
                    ? 'bg-blue-500/10 dark:bg-blue-950/30 border-2 border-blue-500 ring-2 ring-blue-500/20'
                    : !cell.isCurrentMonth
                    ? 'bg-[var(--bg-sub)]/30 text-[var(--text-muted)]/40'
                    : dayProperties.length > 0
                    ? 'bg-[var(--bg-card)] hover:bg-[var(--bg-sub)]/50'
                    : 'bg-[var(--bg-card)]'
                }`}
              >
                {/* Header do Dia */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-xs font-extrabold rounded-full px-2 py-0.5 ${
                        isToday
                          ? 'bg-blue-600 text-white shadow-md'
                          : dayProperties.length > 0
                          ? 'bg-[var(--color-primary)] text-white shadow-sm'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {cell.dayNumber || ''}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-500/20 px-1.5 py-0.5 rounded">
                        Hoje
                      </span>
                    )}
                  </div>

                  {dayProperties.length > 0 && (
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {dayProperties.length} lotes
                    </span>
                  )}
                </div>

                {/* Lista de Imóveis no Dia Referente ao Leilão/Conclusão */}
                <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[180px] pr-0.5">
                  {isFilterMatch &&
                    dayProperties.map((p) => (
                      <Link
                        key={p.id}
                        href={`/detalhes/${p.id}`}
                        onClick={() => setSelectedPropertyId(p.id)}
                        className={`block rounded-lg p-2 border text-[11px] font-semibold transition-all hover:scale-[1.02] shadow-sm ${
                          p.veredicto.includes('NÃO COMPRAR')
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-900 dark:text-rose-300 hover:border-rose-500'
                            : p.veredicto.includes('Atenção')
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-300 hover:border-amber-500'
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-300 hover:border-emerald-500'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold truncate">
                          <span className="truncate">{p.bairro}</span>
                          <span className="text-[9px] font-black bg-[var(--color-primary)] text-white px-1 rounded">
                            {p.score}
                          </span>
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
                          {p.tipo} • {formatCurrency(p.valor_minimo_num)}
                        </div>
                      </Link>
                    ))}
                </div>

                {/* Footer do Dia */}
                {dayProperties.length > 0 && (
                  <div className="pt-1 text-[9px] font-bold text-[var(--text-muted)] text-right">
                    {dateStr}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
