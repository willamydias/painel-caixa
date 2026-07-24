'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { OpportunityCard } from './OpportunityCard';
import { OpportunityTable } from './OpportunityTable';
import { LayoutGrid, Table, SearchX, Sparkles } from 'lucide-react';

export function AssessmentGrid() {
  const { filteredProperties, viewMode, setViewMode, isLoading, resetFilters } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-xs font-semibold text-slate-500">Carregando imóveis da CAIXA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      
      {/* Header bar of the Grid: Controls & View Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Grade de Oportunidades
          </h2>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            {filteredProperties.length} encontrados
          </span>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1 shadow-sm">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition-colors ${
              viewMode === 'cards'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition-colors ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Table className="h-3.5 w-3.5" />
            <span>Tabela</span>
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {filteredProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-12 text-center">
          <SearchX className="h-12 w-12 text-slate-400 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhum imóvel encontrado</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Nenhum imóvel corresponde aos filtros selecionados. Tente ajustar a busca ou limpar os filtros.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            Resetar Filtros
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {filteredProperties.map((property) => (
            <OpportunityCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <OpportunityTable properties={filteredProperties} />
      )}
    </div>
  );
}
