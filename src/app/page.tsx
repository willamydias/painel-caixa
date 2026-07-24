'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { FilterBar } from '@/components/layout/FilterBar';
import { AssessmentGrid } from '@/components/grid/AssessmentGrid';
import { MapWrapper } from '@/components/map/MapWrapper';
import { OpportunityDetailDrawer } from '@/components/detail/OpportunityDetailDrawer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-main)] transition-colors">
      
      {/* 1. Header Fixo & Filtros Globais com botão AGENDA integrado */}
      <Header />
      <FilterBar />

      {/* 2. Container Principal Split-Screen (Grade 60% / Mapa 40%) */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-160px)] min-h-[550px]">
          
          {/* Painel Esquerdo: Grade e Lista de Oportunidades (7 cols = ~58-60%) */}
          <div className="lg:col-span-7 h-full overflow-y-auto pr-1">
            <AssessmentGrid />
          </div>

          {/* Painel Direito: Mapa Interativo Cartográfico com Pins de Fotos 50px (5 cols = ~40-42%) */}
          <div className="lg:col-span-5 h-full sticky top-20">
            <MapWrapper />
          </div>

        </div>
      </main>

      {/* 3. Painel Lateral Deslizante de Detalhes com Galeria de Fotos e Mídias (Drawer) */}
      <OpportunityDetailDrawer />

    </div>
  );
}
