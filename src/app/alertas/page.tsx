'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Bell, Plus, Mail, MessageSquare, Smartphone, Play, Pause, Edit, Trash2, SlidersHorizontal, Check } from 'lucide-react';

export default function AlertasPage() {
  const alertasMock = [
    {
      id: '1',
      nome: 'Casas em Taguatinga & Ceilândia',
      filtros: 'Taguatinga, Ceilândia | Desconto > 40% | Com FGTS',
      frequencia: 'Diária (08:00 AM)',
      canal: 'E-mail + In-App',
      canalIcon: Mail,
      ativo: true,
      ultimaExecucao: 'Hoje às 08:00',
      matchesHoje: 5,
    },
    {
      id: '2',
      nome: 'Venda Direta Online - DF Inteiro',
      filtros: 'Modalidade Venda Direta | Valor até R$ 500k',
      frequencia: 'Tempo Real',
      canal: 'WhatsApp',
      canalIcon: MessageSquare,
      ativo: true,
      ultimaExecucao: 'Há 12 minutos',
      matchesHoje: 12,
    },
    {
      id: '3',
      nome: 'Oportunidades Score > 90',
      filtros: 'Veredito COMPRAR | Score >= 90',
      frequencia: 'Semanal (Segunda-feira)',
      canal: 'E-mail Digest',
      canalIcon: Mail,
      ativo: false,
      ultimaExecucao: 'Ontem',
      matchesHoje: 0,
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-2">
              <Bell className="h-3.5 w-3.5" /> Automação de Monitoramento
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Buscas Salvas & Central de Alertas
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Configure regras de filtro para receber novas oportunidades automaticamente no seu E-mail ou WhatsApp.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2.5 text-xs font-bold shadow-md transition-all">
            <Plus className="h-4 w-4" />
            <span>Criar Nova Busca Salva</span>
          </button>
        </div>

        {/* Tabela de Alertas */}
        <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] font-extrabold uppercase text-[10px] tracking-wider">
                <th className="p-4">Status & Nome da Busca</th>
                <th className="p-4">Filtros Configurados</th>
                <th className="p-4">Frequência</th>
                <th className="p-4">Canal</th>
                <th className="p-4">Última Execução</th>
                <th className="p-4 text-center">Oportunidades Hoje</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-main)]">
              {alertasMock.map((alerta) => {
                const Icon = alerta.canalIcon;
                return (
                  <tr key={alerta.id} className="hover:bg-[var(--bg-sub)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-3 w-3 rounded-full shrink-0 ${
                            alerta.ativo ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        <div>
                          <div className="font-bold text-[var(--text-main)] text-sm">{alerta.nome}</div>
                          <div className="text-[10px] text-[var(--text-muted)] font-medium">ID: #{alerta.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="text-xs text-[var(--text-main)] font-semibold truncate">{alerta.filtros}</div>
                    </td>
                    <td className="p-4 font-semibold text-[var(--text-muted)]">{alerta.frequencia}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] px-2.5 py-1 text-[11px] font-bold text-[var(--text-main)]">
                        <Icon className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                        {alerta.canal}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--text-muted)]">{alerta.ultimaExecucao}</td>
                    <td className="p-4 text-center">
                      <span className="inline-block rounded-full bg-emerald-500/10 text-emerald-600 px-3 py-1 font-extrabold text-xs">
                        {alerta.matchesHoje} imóveis
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button className="p-1.5 rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-[var(--text-main)]">
                        {alerta.ativo ? <Pause className="h-3.5 w-3.5 text-amber-500" /> : <Play className="h-3.5 w-3.5 text-emerald-500" />}
                      </button>
                      <button className="p-1.5 rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-[var(--text-main)]">
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
