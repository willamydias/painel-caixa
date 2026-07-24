'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { KPICard } from './KPICard';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { Building, Zap, DollarSign, TrendingDown, Award } from 'lucide-react';

export function ExecutiveKPIs() {
  const { kpis } = useDashboard();

  return (
    <div className="w-full bg-[var(--bg-sub)] px-4 py-4 sm:px-6 lg:px-8 border-b border-[var(--border-main)] transition-colors">
      <div className="mx-auto grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-[1920px]">
        
        {/* Card 1: Total Filtrado */}
        <KPICard
          title="Oportunidades"
          value={kpis.filteredCount}
          subtitle={`De um total de ${kpis.totalCount} imóveis na base`}
          icon={<Building className="h-4 w-4" />}
          variant="primary"
        />

        {/* Card 2: Venda Direta Online */}
        <KPICard
          title="Venda Direta Online"
          value={kpis.vendasDiretasCount}
          subtitle="Compra rápida instantânea"
          icon={<Zap className="h-4 w-4" />}
          variant="info"
          badgeText="Prioridade"
        />

        {/* Card 3: Ticket Médio */}
        <KPICard
          title="Ticket Médio"
          value={formatCurrency(kpis.ticketMedio)}
          subtitle="Valor mínimo médio das ofertas"
          icon={<DollarSign className="h-4 w-4" />}
          variant="warning"
        />

        {/* Card 4: Desconto Médio */}
        <KPICard
          title="Desconto Médio"
          value={formatPercent(kpis.descontoMedio)}
          subtitle="Deságio sobre a avaliação"
          icon={<TrendingDown className="h-4 w-4" />}
          variant="emerald"
          badgeText="Economia"
        />

        {/* Card 5: Oportunidades Top (Score >= 80) */}
        <KPICard
          title="Top Score (≥ 80)"
          value={kpis.novidadesHojeCount}
          subtitle="Imóveis de atratividade máxima"
          icon={<Award className="h-4 w-4" />}
          variant="success"
        />

      </div>
    </div>
  );
}
