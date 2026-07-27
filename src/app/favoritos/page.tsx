'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Bookmark, Tag, FileText, CheckCircle2, Clock, Trash2, ExternalLink, SlidersHorizontal, Grid, List } from 'lucide-react';
import Link from 'next/link';

export default function FavoritosPage() {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedTag, setSelectedTag] = useState<string>('Todos');

  // Mock de favoritos armazenados pelo usuário
  const favoritosMock = [
    {
      id: '1013765-3',
      titulo: 'Casa 3 Quartos - Taguatinga Norte',
      endereco: 'QNL 14 Bloco B Casa 12, Taguatinga, DF',
      tipo: 'Casa',
      desconto: 48,
      valorMinimo: 'R$ 210.000,00',
      valorAvaliacao: 'R$ 403.846,15',
      veredicto: 'COMPRAR',
      score: 92,
      label: 'Pronto p/ Lance',
      labelColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      nota: 'Certidões OK. Débito de IPTU negociável diretamente na Receita DF.',
      dataEncerramento: '05/08/2026',
    },
    {
      id: '854129-0',
      titulo: 'Apartamento 2 Qts com Suíte - Águas Claras',
      endereco: 'Rua 36 Sul Lote 5 Apt 804, Águas Claras, DF',
      tipo: 'Apartamento',
      desconto: 38,
      valorMinimo: 'R$ 315.000,00',
      valorAvaliacao: 'R$ 508.064,51',
      veredicto: 'COMPRAR (Atenção)',
      score: 76,
      label: 'Diligência Jurídica',
      labelColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      nota: 'Verificar se aceita FGTS para abatimento do saldo devedor.',
      dataEncerramento: '12/08/2026',
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto">
        
        {/* Header do Módulo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-2">
              <Bookmark className="h-3.5 w-3.5" /> Carteira Pessoal de Investimento
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Meus Imóveis Favoritos & Esteira
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Gerencie seus imóveis favoritados, adicione notas privadas e organize por estágio de análise.
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

        {/* Filtros por Label/Etiqueta */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-main)] pb-4">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mr-2">Filtrar por Estágio:</span>
          {['Todos', 'Pronto p/ Lance', 'Diligência Jurídica', 'Vistoria', 'Arquivados'].map((tag) => (
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
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritosMock.map((fav) => (
              <div
                key={fav.id}
                className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 shadow-sm space-y-4 hover:border-[var(--color-primary)] transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border mb-2 ${fav.labelColor}`}>
                      {fav.label}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--text-main)] line-clamp-1">{fav.titulo}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">{fav.endereco}</p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-extrabold text-sm">
                    {fav.score}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[var(--bg-sub)] border border-[var(--border-main)] text-xs">
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Valor Mínimo</span>
                    <span className="font-extrabold text-emerald-600">{fav.valorMinimo}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Desconto</span>
                    <span className="font-extrabold text-[var(--text-main)]">-{fav.desconto}%</span>
                  </div>
                </div>

                {/* Bloco de Nota Privada */}
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-700 dark:text-amber-400">
                    <FileText className="h-3.5 w-3.5" /> Nota Privada:
                  </div>
                  <p className="text-[11px] leading-relaxed">{fav.nota}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-main)] text-xs">
                  <span className="text-[var(--text-muted)] flex items-center gap-1 text-[11px]">
                    <Clock className="h-3.5 w-3.5" /> Encerra em {fav.dataEncerramento}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="text-[var(--text-muted)] hover:text-red-500 p-1 transition-colors" title="Remover dos favoritos">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link
                      href="/oportunidades"
                      className="flex items-center gap-1 rounded-lg bg-[var(--color-primary)] text-white px-3 py-1.5 text-xs font-bold hover:bg-[var(--color-primary-hover)] transition-colors"
                    >
                      <span>Ver Análise</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">Imóvel & Endereço</th>
                  <th className="p-3.5">Estágio</th>
                  <th className="p-3.5">Valor Mínimo</th>
                  <th className="p-3.5">Desconto</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5">Nota Privada</th>
                  <th className="p-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-main)]">
                {favoritosMock.map((fav) => (
                  <tr key={fav.id} className="hover:bg-[var(--bg-sub)] transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-[var(--text-main)]">{fav.titulo}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{fav.endereco}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase border ${fav.labelColor}`}>
                        {fav.label}
                      </span>
                    </td>
                    <td className="p-3.5 font-extrabold text-emerald-600">{fav.valorMinimo}</td>
                    <td className="p-3.5 font-bold text-[var(--text-main)]">-{fav.desconto}%</td>
                    <td className="p-3.5 font-extrabold text-[var(--color-primary)]">{fav.score}</td>
                    <td className="p-3.5 text-[11px] text-[var(--text-muted)] max-w-xs truncate">{fav.nota}</td>
                    <td className="p-3.5 text-right">
                      <Link
                        href="/oportunidades"
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-primary)] text-white px-2.5 py-1 text-[11px] font-bold"
                      >
                        Detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </AppShell>
  );
}
