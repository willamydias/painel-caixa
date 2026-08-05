'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useDashboard } from '@/context/DashboardContext';
import { useUser } from '@/context/UserContext';
import { Bookmark, FileText, Trash2, ExternalLink, Grid, List, MapPin, Zap, Star, FileEdit } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import Link from 'next/link';

export default function FavoritosPage() {
  const { allProperties, favorites, toggleFavorite, propertyNotes, setActiveNoteProperty } = useDashboard();
  const { currentUser } = useUser();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedTag, setSelectedTag] = useState<string>('Todos');

  // Filtrar imóveis favoritos do usuário ativo
  const favoriteProperties = allProperties.filter((p) => favorites.includes(p.id));

  // Filtrar por tag/estágio se selecionado
  const filteredFavorites = favoriteProperties.filter((p) => {
    if (selectedTag === 'Todos') return true;
    const note = propertyNotes[p.id];
    return note && note.kanban_status === selectedTag;
  });

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto">
        
        {/* Header do Módulo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-2">
              <Bookmark className="h-3.5 w-3.5" /> Carteira em Banco de Dados • {currentUser.full_name}
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Meus Imóveis Favoritos ({favoriteProperties.length})
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Imóveis salvos e sincronizados com a conta de {currentUser.full_name} no PostgreSQL.
            </p>
          </div>

          {/* Toggle de Modos de Visão */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] p-1 shadow-sm">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Grid className="h-3.5 w-3.5" /> Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <List className="h-3.5 w-3.5" /> Tabela
              </button>
            </div>
          </div>
        </div>

        {/* Filtros por Label/Estágio */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-main)] pb-4">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mr-2">Filtrar por Estágio:</span>
          {['Todos', 'Interessante', 'Em Análise', 'Lance Agendado', 'Descartado'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                selectedTag === tag
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'border border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-sub)]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Listagem de Favoritos */}
        {filteredFavorites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border-main)] bg-[var(--bg-card)] p-12 text-center space-y-3">
            <Star className="h-10 w-10 text-[var(--text-muted)] mx-auto" />
            <h3 className="text-base font-bold text-[var(--text-main)]">Nenhum imóvel nos favoritos</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
              Clique na estrela ★ em qualquer imóvel na aba Oportunidades para salvá-lo em sua carteira do banco de dados.
            </p>
            <Link
              href="/oportunidades"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] text-white px-4 py-2 text-xs font-bold shadow-md"
            >
              Explorar Oportunidades
            </Link>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((prop) => {
              const note = propertyNotes[prop.id];
              return (
                <div
                  key={prop.id}
                  className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 shadow-sm space-y-4 hover:border-[var(--color-primary)] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {note?.kanban_status && (
                          <span className="inline-block rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2.5 py-0.5 text-[10px] font-extrabold uppercase border border-[var(--color-primary)]/20 mb-2">
                            {note.kanban_status}
                          </span>
                        )}
                        <h3 className="text-sm font-bold text-[var(--text-main)] line-clamp-1">{prop.endereco}</h3>
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-[var(--color-primary)]" />
                          {prop.cidade_satelite} • {prop.bairro}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-extrabold text-sm">
                        {prop.score}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[var(--bg-sub)] border border-[var(--border-main)] text-xs">
                      <div>
                        <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Valor Mínimo</span>
                        <span className="font-extrabold text-emerald-600">{formatCurrency(prop.valor_minimo_num)}</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Desconto</span>
                        <span className="font-extrabold text-[var(--text-main)]">-{formatPercent(prop.desconto_pct)}</span>
                      </div>
                    </div>

                    {/* Bloco de Nota do Investidor */}
                    {note && (note.note_text || note.max_lance) ? (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                        <div className="flex items-center justify-between font-bold text-amber-700 dark:text-amber-400">
                          <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Nota Privada:</span>
                          {note.max_lance && <span className="text-emerald-600 font-extrabold">Teto: R$ {note.max_lance.toLocaleString('pt-BR')}</span>}
                        </div>
                        <p className="text-[11px] leading-relaxed">{note.note_text}</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveNoteProperty(prop)}
                        className="w-full rounded-xl border border-dashed border-[var(--border-main)] bg-[var(--bg-sub)] p-2.5 text-xs text-[var(--text-muted)] hover:text-[var(--color-primary)] flex items-center justify-center gap-1.5"
                      >
                        <FileEdit className="h-3.5 w-3.5" />
                        <span>Adicionar Anotação Privada</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-main)] text-xs">
                    <button
                      onClick={() => toggleFavorite(prop.id)}
                      className="text-[var(--text-muted)] hover:text-red-500 flex items-center gap-1 font-bold text-[11px]"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remover
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveNoteProperty(prop)}
                        className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] px-2.5 py-1 text-[11px] font-bold text-[var(--text-main)] hover:bg-[var(--bg-card)]"
                      >
                        Anotação
                      </button>

                      <Link
                        href={`/detalhes/${prop.id}`}
                        className="flex items-center gap-1 rounded-lg bg-[var(--color-primary)] text-white px-3 py-1.5 text-xs font-bold hover:bg-[var(--color-primary-hover)] transition-colors"
                      >
                        <span>Ver Análise</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">Imóvel & Endereço</th>
                  <th className="p-3.5">Estágio Kanban</th>
                  <th className="p-3.5">Valor Mínimo</th>
                  <th className="p-3.5">Desconto</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5">Nota Privada</th>
                  <th className="p-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-main)]">
                {filteredFavorites.map((prop) => {
                  const note = propertyNotes[prop.id];
                  return (
                    <tr key={prop.id} className="hover:bg-[var(--bg-sub)] transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-[var(--text-main)]">{prop.endereco}</div>
                        <div className="text-[11px] text-[var(--text-muted)]">{prop.cidade_satelite} • {prop.bairro}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-block rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 text-[10px] font-extrabold uppercase border border-[var(--color-primary)]/20">
                          {note?.kanban_status || 'Sem status'}
                        </span>
                      </td>
                      <td className="p-3.5 font-extrabold text-emerald-600">{formatCurrency(prop.valor_minimo_num)}</td>
                      <td className="p-3.5 font-bold text-[var(--text-main)]">-{formatPercent(prop.desconto_pct)}</td>
                      <td className="p-3.5 font-extrabold text-[var(--color-primary)]">{prop.score}</td>
                      <td className="p-3.5 text-[11px] text-[var(--text-muted)] max-w-xs truncate">{note?.note_text || '-'}</td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/detalhes/${prop.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-primary)] text-white px-2.5 py-1 text-[11px] font-bold"
                        >
                          Detalhes
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </AppShell>
  );
}
