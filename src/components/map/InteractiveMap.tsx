'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { getScoreColorCategory, formatCurrency } from '@/lib/formatters';
import { Layers, Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface GeoLayerState {
  ras: boolean;
  localidades: boolean;
  quadras: boolean;
  vias: boolean;
  subdistritos: boolean;
  setores: boolean;
  distrito: boolean;
}

export default function InteractiveMap() {
  const {
    filteredProperties,
    hoveredPropertyId,
    setHoveredPropertyId,
    selectedPropertyId,
    setSelectedPropertyId,
    theme,
  } = useDashboard();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});
  const geoJsonLayersRef = useRef<{ [key: string]: any }>({});

  const [activeGeoLayers, setActiveGeoLayers] = useState<GeoLayerState>({
    ras: true,
    localidades: true,
    quadras: false,
    vias: false,
    subdistritos: false,
    setores: false,
    distrito: false,
  });

  const [loadingLayers, setLoadingLayers] = useState<{ [key: string]: boolean }>({});
  const [isGeoPanelOpen, setIsGeoPanelOpen] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    import('leaflet').then((L) => {
      const map = L.map(mapContainerRef.current!, {
        center: [-15.794, -47.882],
        zoom: 11,
        zoomControl: true,
      });

      const tileUrl =
        theme === 'dark'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Tile layer when theme changes
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then((L) => {
      mapRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          mapRef.current.removeLayer(layer);
        }
      });

      const tileUrl =
        theme === 'dark'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapRef.current);
    });
  }, [theme]);

  // Handle GIS GeoJSON Layers Toggle & Async Fetching
  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet').then((L) => {
      const layerConfigs: {
        key: keyof GeoLayerState;
        url: string;
        style: any;
        onEachFeature?: (feature: any, layer: any) => void;
        pointToLayer?: (feature: any, latlng: any) => any;
      }[] = [
        {
          key: 'ras',
          url: '/geo/regioes_administrativas.json',
          style: {
            color: '#3b82f6',
            weight: 1.5,
            opacity: 0.8,
            dashArray: '4,4',
            fillColor: '#3b82f6',
            fillOpacity: 0.05,
          },
          onEachFeature: (f, l) => {
            const ra = f.properties?.ra_nome || f.properties?.nome || 'RA';
            l.bindTooltip(`📍 RA: ${ra}`, { sticky: true });
          },
        },
        {
          key: 'localidades',
          url: '/geo/localidades.json',
          style: {},
          pointToLayer: (f, latlng) => {
            return L.circleMarker(latlng, {
              radius: 5,
              color: '#ec4899',
              fillColor: '#ec4899',
              fillOpacity: 0.9,
              weight: 1,
            });
          },
          onEachFeature: (f, l) => {
            const nome = f.properties?.nome || 'Localidade';
            l.bindTooltip(`📍 ${nome}`, { sticky: true });
          },
        },
        {
          key: 'quadras',
          url: '/geo/quadras.json',
          style: {
            color: '#10b981',
            weight: 0.8,
            opacity: 0.7,
            fillColor: '#10b981',
            fillOpacity: 0.04,
          },
          onEachFeature: (f, l) => {
            const setor = f.properties?.qu_setor || '';
            const quadra = f.properties?.qu_quadra || '';
            l.bindTooltip(`📐 Quadra: ${setor} ${quadra}`, { sticky: true });
          },
        },
        {
          key: 'vias',
          url: '/geo/faces_logradouros.json',
          style: {
            color: '#f59e0b',
            weight: 1.5,
            opacity: 0.8,
          },
          onEachFeature: (f, l) => {
            const log = f.properties?.log || '';
            const tipo = f.properties?.tipo || '';
            l.bindTooltip(`🛣️ ${tipo} ${log}`, { sticky: true });
          },
        },
        {
          key: 'subdistritos',
          url: '/geo/ibge_subdistritos.json',
          style: {
            color: '#8b5cf6',
            weight: 1.2,
            opacity: 0.7,
            fillColor: '#8b5cf6',
            fillOpacity: 0.04,
          },
          onEachFeature: (f, l) => {
            const sub = f.properties?.NM_SUBDIST || 'Subdistrito';
            l.bindTooltip(`🏛️ Subdistrito IBGE: ${sub}`, { sticky: true });
          },
        },
        {
          key: 'setores',
          url: '/geo/ibge_setores.json',
          style: {
            color: '#06b6d4',
            weight: 0.6,
            opacity: 0.6,
            fillColor: '#06b6d4',
            fillOpacity: 0.03,
          },
          onEachFeature: (f, l) => {
            const cod = f.properties?.CD_SETOR || '';
            const sit = f.properties?.SITUACAO || '';
            l.bindTooltip(`📊 Setor Censitário: ${cod} (${sit})`, { sticky: true });
          },
        },
        {
          key: 'distrito',
          url: '/geo/ibge_distrito.json',
          style: {
            color: '#ef4444',
            weight: 2.5,
            opacity: 0.9,
            fillColor: 'transparent',
          },
          onEachFeature: (f, l) => {
            l.bindTooltip(`🌐 Perímetro DF (IBGE 2022)`, { sticky: true });
          },
        },
      ];

      layerConfigs.forEach(async (cfg) => {
        const isActive = activeGeoLayers[cfg.key];

        if (isActive) {
          if (!geoJsonLayersRef.current[cfg.key]) {
            // Fetch GeoJSON asynchronously
            setLoadingLayers((prev) => ({ ...prev, [cfg.key]: true }));
            try {
              const res = await fetch(cfg.url);
              if (res.ok) {
                const data = await res.json();
                const layer = L.geoJSON(data, {
                  style: cfg.style,
                  pointToLayer: cfg.pointToLayer,
                  onEachFeature: cfg.onEachFeature,
                });

                geoJsonLayersRef.current[cfg.key] = layer;
                if (mapRef.current && activeGeoLayers[cfg.key]) {
                  layer.addTo(mapRef.current);
                }
              }
            } catch (e) {
              console.error(`Erro ao carregar camada ${cfg.key}:`, e);
            } finally {
              setLoadingLayers((prev) => ({ ...prev, [cfg.key]: false }));
            }
          } else {
            if (mapRef.current && !mapRef.current.hasLayer(geoJsonLayersRef.current[cfg.key])) {
              geoJsonLayersRef.current[cfg.key].addTo(mapRef.current);
            }
          }
        } else {
          if (geoJsonLayersRef.current[cfg.key] && mapRef.current) {
            mapRef.current.removeLayer(geoJsonLayersRef.current[cfg.key]);
          }
        }
      });
    });
  }, [activeGeoLayers]);

  // Render Custom 50px Photo Pin Markers
  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet').then((L) => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      if (filteredProperties.length === 0) return;

      const bounds = L.latLngBounds([]);

      filteredProperties.forEach((p) => {
        if (!p.lat || !p.lng) return;

        const cat = getScoreColorCategory(p.score);
        const isHovered = hoveredPropertyId === p.id;
        const isSelected = selectedPropertyId === p.id;
        const photoUrl = p.has_photo ? `/fotos/${p.id}.jpg` : null;

        const iconHtml = `
          <div style="
            position: relative;
            width: 56px;
            height: 64px;
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: scale(${isHovered || isSelected ? 1.25 : 1});
            transition: transform 0.2s ease, z-index 0.2s ease;
            z-index: ${isHovered || isSelected ? 9999 : 100};
            cursor: pointer;
          ">
            <div style="
              width: 50px;
              height: 50px;
              border-radius: 8px;
              overflow: hidden;
              background-color: #0f172a;
              border: 3px solid ${isHovered || isSelected ? '#3b82f6' : cat.borderHex};
              box-shadow: 0 4px 14px rgba(0,0,0,0.5);
              position: relative;
            ">
              ${
                photoUrl
                  ? `<img src="${photoUrl}" style="width:100%; height:100%; object-fit:cover;" />`
                  : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:10px; font-weight:700; background:#1e293b;">${p.tipo.substring(0, 4)}</div>`
              }
              <div style="
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: ${cat.borderHex};
                color: #ffffff;
                font-size: 9px;
                font-weight: 800;
                text-align: center;
                padding: 1px 0;
                line-height: 1.1;
              ">
                -${p.desconto_pct.toFixed(0)}%
              </div>
            </div>

            <div style="
              width: 0;
              height: 0;
              border-left: 7px solid transparent;
              border-right: 7px solid transparent;
              border-top: 9px solid ${isHovered || isSelected ? '#3b82f6' : cat.borderHex};
              margin-top: -1px;
            "></div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-leaflet-photo-marker',
          iconSize: [56, 64],
          iconAnchor: [28, 64],
        });

        const marker = L.marker([p.lat, p.lng], { icon: customIcon }).addTo(mapRef.current);

        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px; max-width: 220px;">
            <div style="font-size: 10px; font-weight: 700; color: #3b82f6; text-transform: uppercase;">${p.bairro} • ${p.tipo}</div>
            <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin: 2px 0;">${p.endereco}</div>
            <div style="font-size: 14px; font-weight: 800; color: #059669; margin-top: 4px;">${formatCurrency(p.valor_minimo_num)}</div>
            <div style="font-size: 10px; color: #64748b;">Desconto: -${p.desconto_pct}% | Score: ${p.score}</div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('mouseover', () => setHoveredPropertyId(p.id));
        marker.on('mouseout', () => setHoveredPropertyId(null));
        marker.on('click', () => setSelectedPropertyId(p.id));

        markersRef.current[p.id] = marker;
        bounds.extend([p.lat, p.lng]);
      });

      if (filteredProperties.length > 0 && bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    });
  }, [filteredProperties, hoveredPropertyId, selectedPropertyId, setHoveredPropertyId, setSelectedPropertyId]);

  const activeCount = Object.values(activeGeoLayers).filter(Boolean).length;

  const toggleLayer = (key: keyof GeoLayerState) => {
    setActiveGeoLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[var(--border-main)] shadow-sm bg-[var(--bg-card)]">
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Floating Layer Control Overlay (Glassmorphism Top-Right) */}
      <div className="absolute top-3 right-3 z-10">
        <div className="relative">
          <button
            onClick={() => setIsGeoPanelOpen(!isGeoPanelOpen)}
            className="flex items-center gap-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)]/90 px-3 py-2 text-xs font-extrabold text-[var(--text-main)] shadow-lg backdrop-blur hover:border-[var(--color-primary)] transition-all"
          >
            <Layers className="h-4 w-4 text-[var(--color-primary)]" />
            <span>Camadas GeoIntel</span>
            <span className="rounded-full bg-[var(--color-primary)]/20 px-1.5 py-0.5 text-[10px] font-black text-[var(--color-primary)]">
              {activeCount}
            </span>
            {isGeoPanelOpen ? (
              <ChevronUp className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            )}
          </button>

          {isGeoPanelOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-3 shadow-2xl backdrop-blur z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-main)] pb-1.5 mb-2">
                Camadas do Mapa (Ligar / Desligar)
              </div>

              <div className="space-y-1.5 text-xs font-bold">
                {[
                  { key: 'ras', label: '🗺️ Limites das RAs GDF', count: '37 RAs', color: '#3b82f6' },
                  { key: 'localidades', label: '📍 Núcleos & Localidades', count: '106 Polos', color: '#ec4899' },
                  { key: 'quadras', label: '📐 Quadras Cadastrais', count: '5.177 Quadras', color: '#10b981' },
                  { key: 'vias', label: '🛣️ Vias & Logradouros IBGE', count: '51.952 Vias', color: '#f59e0b' },
                  { key: 'subdistritos', label: '🏛️ Subdistritos IBGE', count: '33 Subdistritos', color: '#8b5cf6' },
                  { key: 'setores', label: '📊 Setores Censitários IBGE', count: '5.418 Setores', color: '#06b6d4' },
                  { key: 'distrito', label: '🌐 Perímetro Oficial DF', count: 'IBGE 2022', color: '#ef4444' },
                ].map((item) => {
                  const key = item.key as keyof GeoLayerState;
                  const isChecked = activeGeoLayers[key];
                  const isLoading = loadingLayers[key];

                  return (
                    <button
                      key={key}
                      onClick={() => toggleLayer(key)}
                      className={`w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 transition-all text-left border ${
                        isChecked
                          ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--text-main)] shadow-sm'
                          : 'border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-sub)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin text-[var(--color-primary)]" />
                        ) : isChecked ? (
                          <div className="rounded-md bg-[var(--color-primary)] p-0.5 text-white">
                            <Check className="h-3 w-3" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-[var(--text-muted)]">{item.count}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Score Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 rounded-xl bg-[var(--bg-card)]/90 p-2.5 backdrop-blur border border-[var(--border-main)] shadow-lg text-[10px] font-bold text-[var(--text-main)] flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
          <span>≥85 (Excelente)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
          <span>70-84 (Boa)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
          <span>50-69 (Moderada)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
          <span>&lt;50 (Alerta)</span>
        </div>
      </div>
    </div>
  );
}
