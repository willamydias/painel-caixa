'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useDashboard } from '@/context/DashboardContext';
import { useUser } from '@/context/UserContext';
import { Kanban, FileText, ArrowRight, Sparkles, FileEdit, Building2, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import Link from 'next/link';

export default function LabelsPage() {
  const { allProperties, propertyNotes, updatePropertyNote, setActiveNoteProperty } = useDashboard();
  const { currentUser } = useUser();

  const columns: Array<{
    id: 'Interessante' | 'Em Análise' | 'Lance Agendado' | 'Descartado';
    title: string;
    badgeColor: string;
  }> = [
    {
      id: 'Interessante',
      title: 'Interessante / Oportunidade',
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    },
    {
      id: 'Em Análise',
      title: 'Diligência / Em Análise',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    },
    {
      id: 'Lance Agendado',
      title: 'Pronto p/ Lance / Agendado',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    },
    {
      id: 'Descartado',
      title: 'Arquivado / Descartado',
      badgeColor: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto">
        
        {/* Header da Tela */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-2">
              <Kanban className="h-3.5 w-3.5" /> Esteira Visual em Banco de Dados • {currentUser.full_name}
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Gestão de Labels & Esteira Kanban
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Organize os imóveis por estágio de análise. As mudanças são salvas em tempo real na tabela de anotações do PostgreSQL.
            </p>
          </div>
        </div>

        {/* Board Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {columns.map((col) => {
            // Filtrar imóveis marcados nesta coluna
            const itemsInCol = allProperties.filter((p) => {
              const note = propertyNotes[p.id];
              if (!note && col.id === 'Interessante') {
                return false; // só mostrar os que têm nota gravada ou favoritos
              }
              return note?.kanban_status === col.id;
            });

            return (
              <div key={col.id} className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-sub)]/50 p-4 space-y-4 min-h-[500px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold border ${col.badgeColor}`}>
                      {col.title}
                    </span>
                    <span className="text-xs font-bold text-[var(--text-muted)]">({itemsInCol.length})</span>
                  </div>
                </div>

                {/* Cards na Coluna */}
                <div className="space-y-3">
                  {itemsInCol.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[var(--border-main)] p-6 text-center text-xs text-[var(--text-muted)] italic">
                      Nenhum imóvel neste estágio
                    </div>
                  ) : (
                    itemsInCol.map((prop) => {
                      const note = propertyNotes[prop.id];
                      return (
                        <div
                          key={prop.id}
                          className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 shadow-sm space-y-3 hover:border-[var(--color-primary)] transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-[var(--text-main)] line-clamp-2">{prop.endereco}</h4>
                            <span className="text-[10px] font-extrabold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded shrink-0">
                              Score {prop.score}
                            </span>
                          </div>

                          <div className="text-[11px] text-[var(--text-muted)]">
                            {prop.cidade_satelite} • {prop.bairro}
                          </div>

                          {/* Se houver parecer em texto */}
                          {note?.note_text && (
                            <div className="rounded-lg bg-[var(--bg-sub)] p-2 text-[11px] text-[var(--text-muted)] italic line-clamp-2 border border-[var(--border-main)]">
                              "{note.note_text}"
                            </div>
                          )}

                          {note?.max_lance && (
                            <div className="text-[11px] font-extrabold text-emerald-600">
                              Teto Lance: R$ {note.max_lance.toLocaleString('pt-BR')}
                            </div>
                          )}

                          {/* Seleção Rápida para Mover de Coluna */}
                          <div className="pt-2 border-t border-[var(--border-main)] flex items-center justify-between gap-2 text-xs">
                            <select
                              value={note?.kanban_status || col.id}
                              onChange={(e) => updatePropertyNote(prop.id, { kanban_status: e.target.value as any })}
                              className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] px-2 py-1 text-[10px] font-bold text-[var(--text-main)]"
                            >
                              <option value="Interessante">Interessante</option>
                              <option value="Em Análise">Em Análise</option>
                              <option value="Lance Agendado">Lance Agendado</option>
                              <option value="Descartado">Descartado</option>
                            </select>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setActiveNoteProperty(prop)}
                                className="p-1 rounded text-[var(--color-primary)] hover:bg-[var(--bg-sub)]"
                                title="Editar Anotação"
                              >
                                <FileEdit className="h-3.5 w-3.5" />
                              </button>
                              <Link
                                href={`/detalhes/${prop.id}`}
                                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)]"
                                title="Ver Detalhes"
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
