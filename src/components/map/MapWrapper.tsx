'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-400">
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-xs font-semibold">Carregando Mapa Leaflet...</span>
      </div>
    </div>
  ),
});

export function MapWrapper() {
  return <InteractiveMap />;
}
