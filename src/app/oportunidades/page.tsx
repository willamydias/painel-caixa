'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { FilterBar } from '@/components/layout/FilterBar';
import { AssessmentGrid } from '@/components/grid/AssessmentGrid';

export default function OportunidadesPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto">
        {/* Topbar de Título do Módulo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Oportunidades & Busca Avançada
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Explore a listagem completa de imóveis da CAIXA no DF e Entorno com filtros refinados e análise de IA.
            </p>
          </div>
        </div>

        {/* Toolbar de Filtros Globais */}
        <FilterBar />

        {/* Grade de Imóveis / Tabela / Visualização */}
        <div className="min-h-[600px]">
          <AssessmentGrid />
        </div>
      </div>
    </AppShell>
  );
}
