'use client';

import React, { useEffect, useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { ScoreBadge } from '../grid/ScoreBadge';
import { CountdownBadge } from './CountdownBadge';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  X,
  ExternalLink,
  Building,
  FileText,
  Star,
  Share2,
  Check,
  Calculator,
  Download,
  Image as ImageIcon,
  FolderDown,
  FileCode,
  Globe,
  Maximize2,
  Clock,
  MapPin,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

function getCleanAddress(address: string): string {
  if (!address) return '';
  let clean = address;
  clean = clean.replace(/,\s*(SAMAMBAIA|TAGUATINGA|BRASILIA|CEILANDIA|AGUAS CLARAS|PLANALTINA|GAMA|RECANTO DOS DOURADOS|SOBRADINHO|GUARA|NUCLEO BANDEIRANTE|CANDANGOLANDIA|PARANOA|SANTA MARIA|SUDOESTE|OCTOGONAL|CRUZEIRO|LAGO NORTE|LAGO SUL|JARDIM BOTANICO|ITARARE)\s*(?=\s*-?\s*CEP:|\b)/gi, '');
  clean = clean.replace(/,\s*TAGUATINGA\s*-\s*DISTRITO\s*FEDERAL/gi, '');
  clean = clean.replace(/,\s*BRASILIA\s*-\s*DISTRITO\s*FEDERAL/gi, '');
  clean = clean.replace(/,\s*SAMAMBAIA\s*-\s*DISTRITO\s*FEDERAL/gi, '');
  clean = clean.replace(/,\s*CEILANDIA\s*-\s*DISTRITO\s*FEDERAL/gi, '');
  clean = clean.replace(/NORTE\s*\([^)]*\)\s*-\s*/gi, '');
  clean = clean.replace(/SUL\s*\([^)]*\)\s*-\s*/gi, '');
  clean = clean.replace(/\s*-\s*DISTRITO\s*FEDERAL/gi, '');
  clean = clean.replace(/\s*-?\s*CEP:/gi, ' - CEP:');
  clean = clean.replace(/,\s*-/gi, ' -');
  return clean.trim();
}

export function OpportunityDetailDrawer() {
  const { selectedPropertyId, setSelectedPropertyId, allProperties, favorites, toggleFavorite } = useDashboard();
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoadingMarkdown, setIsLoadingMarkdown] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState<{ nome: string; url: string } | null>(null);

  const property = allProperties.find((p) => p.id === selectedPropertyId);
  const isFavorite = property ? favorites.includes(property.id) : false;

  // Set initial selected photo
  useEffect(() => {
    if (property) {
      if (property.fotos_list && property.fotos_list.length > 0) {
        setSelectedPhoto(property.fotos_list[0]);
      } else if (property.has_photo) {
        setSelectedPhoto(`/fotos/${property.id}.jpg`);
      } else {
        setSelectedPhoto(null);
      }
    }
  }, [property]);

  // Fetch Markdown Parecer Analitico
  useEffect(() => {
    if (!selectedPropertyId) return;

    async function loadMarkdown() {
      setIsLoadingMarkdown(true);
      try {
        const res = await fetch(`/data/ativos/${selectedPropertyId}/Analise_${selectedPropertyId}.md`);
        if (res.ok) {
          const text = await res.text();
          setMarkdownContent(text);
        } else {
          setMarkdownContent('Parecer sintético não disponível em formato Markdown para este lote.');
        }
      } catch (err) {
        setMarkdownContent('Erro ao carregar o parecer Markdown.');
      } finally {
        setIsLoadingMarkdown(false);
      }
    }

    loadMarkdown();
  }, [selectedPropertyId]);

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPropertyId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedPropertyId]);

  if (!selectedPropertyId || !property) return null;

  // Financial calculations
  const avaliacao = property.valor_avaliacao_num || 0;
  const minimo = property.valor_minimo_num || 0;
  const descontoNominal = Math.max(0, avaliacao - minimo);
  const itbiEstimado = minimo * 0.03; // ~3% DF ITBI
  const escrituraEstimada = minimo * 0.015; // ~1.5% Escritura/Cartório
  const custoTotalEstimado = minimo + itbiEstimado + escrituraEstimada;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mainLink = property.url_leiloeiro || property.url_caixa || `https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnImovel=${property.id}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300">
      
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={() => setSelectedPropertyId(null)} />

      {/* Drawer Panel Slide-Over */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-2xl transform bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-4 sm:px-6 bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono font-bold text-sm">
                #{property.id}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-[10px] font-bold uppercase border border-blue-500/20">
                    {property.modalidade}
                  </span>

                  {/* Tag Score */}
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold border ${
                    property.score >= 70
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : property.score >= 45
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
                  }`}>
                    Score {property.score}
                  </span>

                  {/* Tag Veredicto */}
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase border ${
                    property.veredicto.includes('NÃO COMPRAR')
                      ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
                      : property.veredicto.includes('Atenção')
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  }`}>
                    {property.veredicto.includes('NÃO COMPRAR') ? 'NÃO COMPRAR' : property.veredicto.includes('Atenção') ? 'ATENÇÃO' : 'COMPRAR'}
                  </span>

                  {/* Tag Prazo Contínuo ou Relógio Regressivo */}
                  {property.modalidade.toLowerCase().includes('venda direta') || property.modalidade.toLowerCase().includes('compra direta') || (!property.data_1 && !property.data_2) ? (
                    <span className="rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Prazo contínuo
                    </span>
                  ) : (
                    <CountdownBadge targetDateStr={property.data_1 || property.data_2} />
                  )}
                </div>

                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                  {getCleanAddress(property.endereco)}
                </h2>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-1.5">
                  <span><strong>Região:</strong> {property.bairro}</span>
                  <span>•</span>
                  <span><strong>Cidade:</strong> {property.cidade_satelite || 'Samambaia'}</span>
                  <span>•</span>
                  <span><strong>Tipo:</strong> {property.tipo}</span>
                  <span>•</span>
                  <span><strong>Área:</strong> {property.area}</span>
                  <span>•</span>
                  <span className={`font-bold ${property.fgts === 'Sim' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    <strong>FGTS:</strong> {property.fgts === 'Sim' ? 'Permitido' : 'Não se Aplica'}
                  </span>
                </p>
              </div>
            </div>

            {/* Top Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(property.id)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                  isFavorite
                    ? 'border-amber-500 bg-amber-500 text-white'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-amber-500'
                }`}
              >
                <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleCopyLink}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Compartilhar Oportunidade"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setSelectedPropertyId(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

            {/* MÓDULO 6: DOCUMENTOS E MÍDIA (MediaDocGallery) */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-blue-500" /> Galeria de Fotos e Mídia Oficial
              </h4>

              {/* Main Photo Display */}
              <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                {selectedPhoto ? (
                  <img
                    src={selectedPhoto}
                    alt={property.endereco}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 p-4">
                    <Building className="h-12 w-12 mb-2" />
                    <span className="text-xs font-semibold">Foto principal não carregada</span>
                  </div>
                )}
              </div>

              {/* Photos Thumbnails List */}
              {property.fotos_list && property.fotos_list.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {property.fotos_list.map((fUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhoto(fUrl)}
                      className={`h-14 w-14 overflow-hidden rounded-lg border-2 transition-all shrink-0 ${
                        selectedPhoto === fUrl ? 'border-blue-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={fUrl} alt={`Foto ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Central de Documentos Jurídicos (PDFs: Edital, Matrícula) */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FolderDown className="h-4 w-4 text-emerald-500" /> Central de Documentos & Editais
                  </h5>
                  <span className="text-[10px] font-bold text-slate-500">
                    {property.documentos_list?.length || 0} arquivos disponíveis
                  </span>
                </div>

                {property.documentos_list && property.documentos_list.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {property.documentos_list.map((doc, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedPdfDoc({ nome: doc.nome, url: doc.url })}
                        className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode className="h-4 w-4 text-red-500 shrink-0" />
                          <span className="truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{doc.nome}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPdfDoc({ nome: doc.nome, url: doc.url });
                            }}
                            className="text-slate-400 hover:text-blue-500 p-1 transition-colors"
                            title="Visualizar em Janela Sobreposta"
                          >
                            <Maximize2 className="h-3.5 w-3.5" />
                          </button>
                          <a
                            href={doc.url}
                            download={doc.nome}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-400 hover:text-blue-500 p-1 transition-colors"
                            title="Baixar Arquivo PDF"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    Nenhum documento PDF adicional anexado diretamente neste lote.
                  </div>
                )}
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Calculator className="h-4 w-4 text-blue-500" /> Resumo Financeiro & Custos Estimados
                </h4>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Deságio -{formatPercent(property.desconto_pct)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Avaliação</span>
                  <span className="text-xs font-bold text-slate-500 line-through">{formatCurrency(avaliacao)}</span>
                </div>

                <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 border border-blue-500/30">
                  <span className="text-[10px] font-bold text-blue-500 uppercase block">Valor Mínimo</span>
                  <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">{formatCurrency(minimo)}</span>
                </div>

                <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 border border-emerald-500/30">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase block">Economia R$</span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(descontoNominal)}</span>
                </div>

                <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Custo Total Est.</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{formatCurrency(custoTotalEstimado)}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                * Custo total estimado inclui ~3% ITBI + ~1.5% emolumentos de escritura/registro cartorário.
              </p>
            </div>

            {/* Markdown Parecer Analitico Viewer (High Contrast Fix) */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-blue-500" /> Parecer Analítico Técnico & Jurídico (IA)
              </h4>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 shadow-inner text-slate-900 dark:text-slate-100">
                {isLoadingMarkdown ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  </div>
                ) : (
                  <article className="prose dark:prose-invert max-w-none text-slate-900 dark:text-slate-100 font-medium text-sm leading-relaxed prose-headings:font-bold prose-headings:text-blue-700 dark:prose-headings:text-blue-400 prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-bold">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {markdownContent}
                    </ReactMarkdown>
                  </article>
                )}
              </div>
            </div>

          </div>

          {/* Drawer Footer Actions (Link do Leiloeiro Priorizado) */}
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 sm:px-6 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3">
            <a
              href={mainLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>Acessar Site do Leiloeiro ({property.site_leiloeiro_nome || 'Oficial'})</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <button
              onClick={() => setSelectedPropertyId(null)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Fechar Painel
            </button>
          </div>

        </div>
      </div>

      {/* Modal de Visualização de Documentos PDF em Janela Sobreposta */}
      {selectedPdfDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="relative max-w-5xl w-full bg-[var(--bg-card)] rounded-2xl border border-[var(--border-main)] p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2 truncate pr-4">
                <FileCode className="h-4 w-4 text-red-500 shrink-0" />
                <span className="truncate">{selectedPdfDoc.nome}</span>
              </h3>
              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href={selectedPdfDoc.url}
                  download={selectedPdfDoc.nome}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-3.5 py-1.5 text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Baixar PDF</span>
                </a>
                <button
                  onClick={() => setSelectedPdfDoc(null)}
                  className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-1.5 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-card)] cursor-pointer transition-colors"
                >
                  Fechar (ESC)
                </button>
              </div>
            </div>

            <div className="h-[76vh] w-full rounded-xl border border-[var(--border-main)] overflow-hidden bg-slate-900">
              <iframe
                src={selectedPdfDoc.url}
                title={selectedPdfDoc.nome}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
