'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ExecutiveKPIs } from '@/components/kpi/ExecutiveKPIs';
import { AssessmentGrid } from '@/components/grid/AssessmentGrid';
import {
  Sparkles,
  Search,
  Zap,
  Bookmark,
  Calendar,
  Bell,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  SlidersHorizontal,
  Clock,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8 max-w-[1700px] mx-auto">
        
        {/* 1. Header do Dashboard & Hero de Busca em Linguagem Natural */}
        <div className="rounded-3xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-2">
                <Sparkles className="h-3.5 w-3.5" /> Inteligência de Mercado Ativa
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                Olá, Investidor Wagner 👋
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Confira as melhores oportunidades de imóveis CAIXA atualizadas hoje com veredito de IA.
              </p>
            </div>

            {/* Status Operacional & Perfil Resumido */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Base CAIXA Atualizada (07:00 AM)</span>
              </div>
              <Link
                href="/conta"
                className="hidden sm:flex items-center gap-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3.5 py-2 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors"
              >
                <span>Plano Pro</span>
                <span className="rounded bg-[var(--color-primary)] text-white text-[10px] px-1.5 py-0.5 font-extrabold">ATIVO</span>
              </Link>
            </div>
          </div>

          {/* Hero Input de Busca Inteligente (NLP) */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Ex: Apartamento em Santos até 400 mil aceitando FGTS e deságio > 40%..."
                className="w-full rounded-2xl border-2 border-[var(--border-main)] bg-[var(--bg-sub)] pl-12 pr-32 py-4 text-sm sm:text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-primary)] focus:bg-[var(--bg-card)] focus:outline-none transition-all shadow-inner"
              />
              <button
                onClick={() => (window.location.href = '/oportunidades')}
                className="absolute right-2 flex items-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2.5 text-sm font-bold shadow-md shadow-[var(--color-primary)]/20 transition-all cursor-pointer"
              >
                <span>Buscar</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            
            {/* Sugestões de Busca Rápida */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-[var(--text-muted)]">
              <span className="font-semibold">Sugestões rápidas:</span>
              <button onClick={() => (window.location.href = '/oportunidades')} className="rounded-lg bg-[var(--bg-sub)] px-2.5 py-1 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border border-transparent transition-all">
                Apartamento em Brasília com FGTS
              </button>
              <button onClick={() => (window.location.href = '/oportunidades')} className="rounded-lg bg-[var(--bg-sub)] px-2.5 py-1 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border border-transparent transition-all">
                Venda Direta Online &gt; 50% Desconto
              </button>
              <button onClick={() => (window.location.href = '/oportunidades')} className="rounded-lg bg-[var(--bg-sub)] px-2.5 py-1 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border border-transparent transition-all">
                Leilão SFI encerrando esta semana
              </button>
            </div>
          </div>
        </div>

        {/* 2. KPIs Executivos */}
        <ExecutiveKPIs />

        {/* 3. Acessos Rápidos & Atalhos de Ação */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-2">
              <Zap className="h-4 w-4 text-[var(--color-primary)]" /> Acesso Rápido & Módulos
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/oportunidades"
              className="flex items-center gap-3 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-main)]">Busca Avançada</div>
                <div className="text-xs text-[var(--text-muted)]">Filtros finos de leilão</div>
              </div>
            </Link>

            <Link
              href="/mapa"
              className="flex items-center gap-3 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-main)]">Mapa Interativo</div>
                <div className="text-xs text-[var(--text-muted)]">Geointeligência de áreas</div>
              </div>
            </Link>

            <Link
              href="/calendario"
              className="flex items-center gap-3 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-main)]">Calendário Leilões</div>
                <div className="text-xs text-[var(--text-muted)]">Prazos de praças</div>
              </div>
            </Link>

            <Link
              href="/favoritos"
              className="flex items-center gap-3 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Bookmark className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-main)]">Meus Favoritos</div>
                <div className="text-xs text-[var(--text-muted)]">Esteira de análise</div>
              </div>
            </Link>
          </div>
        </div>

        {/* 4. Grid Principal: Oportunidades Em Destaque (Esquerda 8) & Alertas/Agenda (Direita 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Coluna Esquerda: Oportunidades em Destaque */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[var(--text-main)] flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" /> Oportunidades de Maior ROI Hoje
                </h2>
                <p className="text-xs text-[var(--text-muted)]">Imóveis filtrados com Veredito COMPRAR e deságio superior a 40%</p>
              </div>
              <Link
                href="/oportunidades"
                className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
              >
                Ver todas (89) <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <AssessmentGrid />
          </div>

          {/* Coluna Direita: Alertas do Dia, Buscas Salvas & Status do Perfil */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card de Alertas do Dia */}
            <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
                <h3 className="text-sm font-extrabold text-[var(--text-main)] flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-500" /> Alertas do Dia (3)
                </h3>
                <span className="rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-extrabold px-2 py-0.5">
                  NOVO
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[var(--text-main)]">
                    <span>Novo imóvel Venda Direta</span>
                    <span className="text-[10px] text-[var(--text-muted)]">Há 15 min</span>
                  </div>
                  <p className="text-[var(--text-muted)]">
                    Apartamento em Águas Claras com 45% de desconto adicionado hoje.
                  </p>
                  <Link href="/oportunidades" className="text-[11px] font-bold text-[var(--color-primary)] hover:underline inline-block pt-1">
                    Ver Oportunidade →
                  </Link>
                </div>

                <div className="p-3 rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[var(--text-main)]">
                    <span>Encerramento Próximo</span>
                    <span className="text-[10px] text-amber-600 font-bold">24h restantes</span>
                  </div>
                  <p className="text-[var(--text-muted)]">
                    Casa em Taguatinga encerra a 2ª Praça amanhã às 14:00.
                  </p>
                </div>
              </div>
            </div>

            {/* Card de Buscas Salvas */}
            <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
                <h3 className="text-sm font-extrabold text-[var(--text-main)] flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[var(--color-primary)]" /> Buscas Salvas
                </h3>
                <Link href="/alertas" className="text-xs font-bold text-[var(--color-primary)] hover:underline">
                  Gerenciar
                </Link>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-main)] hover:bg-[var(--bg-sub)] transition-colors text-xs">
                  <div>
                    <div className="font-bold text-[var(--text-main)]">Casas DF até 350k</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Frequência: Diária por E-mail</div>
                  </div>
                  <span className="rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-[10px] px-2 py-1">
                    12 novos
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-main)] hover:bg-[var(--bg-sub)] transition-colors text-xs">
                  <div>
                    <div className="font-bold text-[var(--text-main)]">Venda Direta com FGTS</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Frequência: Imediata</div>
                  </div>
                  <span className="rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-[10px] px-2 py-1">
                    5 novos
                  </span>
                </div>
              </div>
            </div>

            {/* Card de Perfil & Retomar Análises */}
            <div className="rounded-2xl border border-[var(--border-main)] bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--bg-card)] to-[var(--bg-card)] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white text-lg font-bold">
                  W
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[var(--text-main)]">Wagner Junior</div>
                  <div className="text-xs text-[var(--text-muted)]">Plano Investor Pro Active</div>
                </div>
              </div>
              <div className="space-y-1 pt-2 border-t border-[var(--border-main)] text-xs text-[var(--text-muted)]">
                <div className="flex justify-between">
                  <span>Análises este mês:</span>
                  <span className="font-bold text-[var(--text-main)]">42 / ilimitado</span>
                </div>
                <div className="flex justify-between">
                  <span>Alertas ativos:</span>
                  <span className="font-bold text-[var(--text-main)]">4 configurados</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
