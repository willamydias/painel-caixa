'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { MapWrapper } from '@/components/map/MapWrapper';
import { AssessmentGrid } from '@/components/grid/AssessmentGrid';
import { MapPin, Layers, SlidersHorizontal } from 'lucide-react';

export default function MapaPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-[1920px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-2">
              <MapPin className="h-3.5 w-3.5" /> Geointeligência Cartográfica
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Exploração Geográfica & Mapa Interativo
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Navegue pelos imóveis mapeados com fotos reais nos pins e legenda semântica de score.
            </p>
          </div>
        </div>

        {/* Split Screen Mapa (60%) e Grade Sincronizada (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-220px)] min-h-[600px]">
          <div className="lg:col-span-7 h-full sticky top-20 rounded-2xl overflow-hidden border border-[var(--border-main)] shadow-sm">
            <MapWrapper />
          </div>

          <div className="lg:col-span-5 h-full overflow-y-auto pr-1">
            <AssessmentGrid />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
