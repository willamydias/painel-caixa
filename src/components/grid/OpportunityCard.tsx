'use client';

import React, { useState } from 'react';
import { Property } from '@/types/property';
import { useDashboard } from '@/context/DashboardContext';
import { ScoreBadge } from './ScoreBadge';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { MapPin, Building, Star, CheckCircle, AlertTriangle, ArrowRight, Zap, Globe } from 'lucide-react';

interface OpportunityCardProps {
  property: Property;
}

export function OpportunityCard({ property }: OpportunityCardProps) {
  const {
    setSelectedPropertyId,
    hoveredPropertyId,
    setHoveredPropertyId,
    favorites,
    toggleFavorite,
  } = useDashboard();

  const [imgError, setImgError] = useState<boolean>(false);
  const isHovered = hoveredPropertyId === property.id;
  const isFavorite = favorites.includes(property.id);

  const getModalidadeBadge = (mod: string) => {
    if (mod.includes('Venda Direta') || mod.includes('Compra Direta')) {
      return 'bg-indigo-600 text-white shadow-sm';
    }
    if (mod.includes('Venda Online')) {
      return 'bg-blue-600 text-white shadow-sm';
    }
    if (mod.includes('Licitação')) {
      return 'bg-amber-600 text-white';
    }
    return 'bg-slate-700 text-white';
  };

  const getVeredictoStyle = (ver: string) => {
    if (ver.includes('NÃO COMPRAR')) {
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    }
    if (ver.includes('Atenção')) {
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  };

  return (
    <div
      onMouseEnter={() => setHoveredPropertyId(property.id)}
      onMouseLeave={() => setHoveredPropertyId(null)}
      onClick={() => setSelectedPropertyId(property.id)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-[var(--bg-card)] shadow-sm transition-all duration-200 cursor-pointer ${
        isHovered
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg -translate-y-0.5'
          : 'border-[var(--border-main)] hover:border-blue-500/50'
      }`}
    >
      {/* Image Container */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        {!imgError && property.has_photo ? (
          <img
            src={`/fotos/${property.id}.jpg`}
            alt={property.endereco}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-400 p-4 text-center">
            <Building className="h-10 w-10 text-slate-500 mb-2" />
            <span className="text-xs font-semibold text-slate-300">{property.tipo}</span>
            <span className="text-[10px] text-slate-500">{property.cidade_satelite} • {property.bairro}</span>
          </div>
        )}

        {/* Modalidade Badge Overlay */}
        <div className="absolute left-3 top-3">
          <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${getModalidadeBadge(property.modalidade)}`}>
            {property.modalidade.includes('Venda Direta') && <Zap className="h-3 w-3" />}
            {property.modalidade}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-transform active:scale-95 ${
            isFavorite
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-slate-900/60 text-slate-300 hover:bg-slate-900/90 hover:text-amber-400'
          }`}
        >
          <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Score Badge Bottom Right Overlay */}
        <div className="absolute bottom-3 right-3">
          <ScoreBadge score={property.score} size="sm" />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* Header Info: RA & Bairro & Tipo */}
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] mb-1">
            <span className="flex items-center gap-1 text-blue-500 font-bold uppercase tracking-wider truncate max-w-[70%]">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {property.cidade_satelite || 'Brasília'} • {property.bairro}
            </span>
            <span>{property.tipo} • {property.area}</span>
          </div>

          {/* Address Title */}
          <h3 className="text-sm font-bold text-[var(--text-main)] line-clamp-2 leading-snug group-hover:text-blue-500 transition-colors">
            {property.endereco}
          </h3>

          {/* Pricing Box */}
          <div className="mt-3 rounded-xl bg-[var(--bg-sub)] p-3 border border-[var(--border-main)]">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Valor Mínimo
                </span>
                <span className="text-lg font-extrabold text-emerald-500">
                  {formatCurrency(property.valor_minimo_num)}
                </span>
              </div>

              {property.desconto_pct > 0 && (
                <div className="text-right">
                  <span className="inline-block rounded-lg bg-emerald-500/10 px-2 py-0.5 text-xs font-extrabold text-emerald-500 border border-emerald-500/20">
                    -{formatPercent(property.desconto_pct)}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] line-through block mt-0.5">
                    Aval: {formatCurrency(property.valor_avaliacao_num)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags & Action Footer */}
        <div className="mt-4 pt-3 border-t border-[var(--border-main)] flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border ${getVeredictoStyle(property.veredicto)}`}>
              {property.veredicto.includes('NÃO COMPRAR') ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <CheckCircle className="h-3 w-3" />
              )}
              {property.veredicto}
            </span>

            {property.fgts === 'Sim' && (
              <span className="inline-flex items-center rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-500 border border-cyan-500/20">
                FGTS
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={property.url_leiloeiro || property.url_caixa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--text-muted)] hover:text-blue-500 transition-colors"
              title={`Site do Leiloeiro: ${property.site_leiloeiro_clean || 'caixa'}`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{property.site_leiloeiro_clean || 'leiloeiro'}</span>
            </a>

            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-500 group-hover:translate-x-0.5 transition-transform">
              Detalhes <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
