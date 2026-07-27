'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboard } from '@/context/DashboardContext';
import { Landmark, Search, Database, Sparkles, Settings } from 'lucide-react';

export function Header() {
  const {
    filters,
    updateFilter,
    lastScrapingDate,
    allProperties,
  } = useDashboard();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--border-main)] bg-[var(--bg-header)]/95 backdrop-blur transition-colors">
      <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Commercial Minimalist Logo & Title */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20 border border-white/20">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[var(--text-main)] font-sans">
                Painel <span className="text-[var(--color-primary)]">Imobiliário</span>
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                <Sparkles className="h-3 w-3" /> By WMSD
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Plataforma Analítica de Oportunidades CAIXA
            </p>
          </div>
        </Link>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Buscar por bairro, endereço, ID Caixa..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] pl-10 pr-4 py-2 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-primary)] focus:bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => updateFilter('searchQuery', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Right: Scraping Date Badge & Atalho para Configurações */}
        <div className="flex items-center gap-3">
          
          {/* Dynamic Scraping Date Version Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] px-2.5 py-1.5 text-xs">
            <Database className="h-3.5 w-3.5 text-emerald-500" />
            <span className="rounded bg-[var(--border-main)] px-2 py-0.5 text-[11px] font-extrabold text-[var(--text-main)]">
              {lastScrapingDate}
            </span>
            <span className="rounded bg-[var(--border-main)] px-2 py-0.5 text-[11px] font-extrabold text-[var(--text-main)]">
              {allProperties.length} lotes
            </span>
          </div>

          {/* Atalho para Subitem de Configurações no Sidebar (Substitui botão de alternar tema) */}
          <Link
            href="/configuracoes"
            title="Ir para Configurações Globais & Preferências de Tema"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-main)] hover:border-[var(--color-primary)] hover:bg-[var(--bg-card)] transition-colors"
          >
            <Settings className="h-4 w-4 text-[var(--color-primary)]" />
          </Link>

        </div>

      </div>
    </header>
  );
}
