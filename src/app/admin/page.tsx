'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ShieldCheck, Database, RefreshCw, AlertTriangle, FileCheck, Server, Cpu } from 'lucide-react';

export default function AdminPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-600 border border-purple-500/20 mb-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Controle Operacional Mestre
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Painel Administrativo & Gestão de Jobs
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Monitore a rotina de scraping, reprocessamento de score por IA e deduplicação de ativos da CAIXA.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2.5 text-xs font-bold shadow-md transition-all">
            <RefreshCw className="h-4 w-4 animate-spin-slow" />
            <span>Disparar Scraping Manual</span>
          </button>
        </div>

        {/* Grid de Métricas de Infraestrutura */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 shadow-sm space-y-1">
            <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Total Imóveis Na Base</span>
            <div className="text-2xl font-extrabold text-[var(--text-main)]">12.480</div>
            <div className="text-[10px] text-emerald-600 font-bold">89 atualizados hoje</div>
          </div>

          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 shadow-sm space-y-1">
            <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Última Importação</span>
            <div className="text-2xl font-extrabold text-[var(--text-main)]">07:00 AM</div>
            <div className="text-[10px] text-emerald-600 font-bold">Status: Sucesso (100%)</div>
          </div>

          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 shadow-sm space-y-1">
            <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Erros de Certidão (DF)</span>
            <div className="text-2xl font-extrabold text-amber-500">2 pendentes</div>
            <div className="text-[10px] text-[var(--text-muted)] font-bold">Aguardando Captcha HITL</div>
          </div>

          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 shadow-sm space-y-1">
            <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Fila de Processamento IA</span>
            <div className="text-2xl font-extrabold text-blue-600">0 em fila</div>
            <div className="text-[10px] text-emerald-600 font-bold">100% sintetizados</div>
          </div>
        </div>

        {/* Tabela de Logs de Ingestão */}
        <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[var(--text-main)] flex items-center gap-2">
            <Server className="h-4 w-4 text-[var(--color-primary)]" /> Log de Execuções e Cronjobs
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="p-3">Data/Hora</th>
                  <th className="p-3">Módulo Job</th>
                  <th className="p-3">Itens Processados</th>
                  <th className="p-3">Sucessos</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-main)]">
                <tr className="hover:bg-[var(--bg-sub)] transition-colors">
                  <td className="p-3 font-bold">27/07/2026 07:00:02</td>
                  <td className="p-3 font-semibold">caixa-scraper + caixa-diff</td>
                  <td className="p-3">89 imóveis</td>
                  <td className="p-3 font-bold text-emerald-600">89 / 89</td>
                  <td className="p-3">
                    <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 text-[10px] font-extrabold border border-emerald-500/20">
                      Concluído
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-[var(--color-primary)] hover:underline font-bold text-[11px]">Ver Log</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
