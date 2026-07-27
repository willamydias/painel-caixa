'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Kanban, Plus, MoreVertical, FileText, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LabelsPage() {
  const columns = [
    {
      id: 'analise',
      title: 'Em Análise Inicial',
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      items: [
        { id: '1013765-3', title: 'Casa QNL 14 - Taguatinga', preco: 'R$ 210.000', score: 92, veredicto: 'COMPRAR' },
      ],
    },
    {
      id: 'diligencia',
      title: 'Diligência Jurídica',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      items: [
        { id: '854129-0', title: 'Apto Rua 36 Sul - Águas Claras', preco: 'R$ 315.000', score: 76, veredicto: 'COMPRAR (Atenção)' },
      ],
    },
    {
      id: 'pronto',
      title: 'Pronto para Lance',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      items: [],
    },
    {
      id: 'arrematado',
      title: 'Proposta Enviada / Arrematado',
      badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      items: [],
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto">
        {/* Header da Tela */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-2">
              <Kanban className="h-3.5 w-3.5" /> Esteira Visual Kanban
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Gestão de Labels & Estágios de Análise
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Organize a evolução de seus leilões por colunas de atendimento e esteira de decisão.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2.5 text-xs font-bold shadow-md transition-all">
            <Plus className="h-4 w-4" />
            <span>Nova Etiqueta / Label</span>
          </button>
        </div>

        {/* Board Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {columns.map((col) => (
            <div key={col.id} className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-sub)]/50 p-4 space-y-4 min-h-[500px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold border ${col.badgeColor}`}>
                    {col.title}
                  </span>
                  <span className="text-xs font-bold text-[var(--text-muted)]">({col.items.length})</span>
                </div>
                <button className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {/* Cards na Coluna */}
              <div className="space-y-3">
                {col.items.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--border-main)] p-6 text-center text-xs text-[var(--text-muted)]">
                    Nenhum imóvel nesta etapa
                  </div>
                ) : (
                  col.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 shadow-sm space-y-3 hover:border-[var(--color-primary)] transition-all cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-[var(--text-main)] line-clamp-2">{item.title}</h4>
                        <span className="text-[10px] font-extrabold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded">
                          Score {item.score}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-main)]">
                        <span className="font-extrabold text-emerald-600">{item.preco}</span>
                        <Link href="/oportunidades" className="text-[11px] font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                          Ver <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
