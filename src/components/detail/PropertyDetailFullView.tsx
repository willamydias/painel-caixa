'use client';

import React, { useEffect, useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { ScoreBadge } from '../grid/ScoreBadge';
import { CountdownBadge } from './CountdownBadge';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
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
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Maximize2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface PropertyDetailFullViewProps {
  propertyId?: string;
}

export function PropertyDetailFullView({ propertyId }: PropertyDetailFullViewProps) {
  const { selectedPropertyId, allProperties, favorites, toggleFavorite } = useDashboard();

  // Property to display (target propertyId, selectedPropertyId, or fallback to first)
  const targetId = propertyId || selectedPropertyId || (allProperties[0] ? allProperties[0].id : '1013765-3');
  const property = allProperties.find((p) => p.id === targetId) || allProperties[0];

  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoadingMarkdown, setIsLoadingMarkdown] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showScreenshotModal, setShowScreenshotModal] = useState<boolean>(false);

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
    if (!targetId) return;

    async function loadMarkdown() {
      setIsLoadingMarkdown(true);
      try {
        const res = await fetch(`/data/ativos/${targetId}/Analise_${targetId}.md`);
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
  }, [targetId]);

  if (!property) return null;

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
  const screenshotUrl = `/data/ativos/${property.id}/screenshot.png`;

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto pb-12">

      {/* 1. Header do Detalhe do Imóvel & Controles de Ação */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-main)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/oportunidades"
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline mr-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Voltar para Oportunidades
            </Link>
            <span className="rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 text-[11px] font-mono font-bold border border-[var(--color-primary)]/20">
              ID CAIXA: #{property.id}
            </span>
            <span className="rounded-md bg-[var(--bg-sub)] text-[var(--text-muted)] px-2 py-0.5 text-[11px] font-bold uppercase">
              {property.modalidade}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
            {property.endereco}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
            <span>{property.cidade_satelite || 'DF'} • {property.bairro} • Tipo: {property.tipo} • Área: {property.area}</span>
          </p>
        </div>

        {/* Botões de Ação Topo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(property.id)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${isFavorite
              ? 'border-amber-500 bg-amber-500 text-white shadow-md'
              : 'border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-amber-500 hover:text-amber-500'
              }`}
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{isFavorite ? 'Favoritado' : 'Favoritar'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] px-4 py-2.5 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-sub)] transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
            <span>{copied ? 'Link Copiado' : 'Compartilhar'}</span>
          </button>

          <a
            href={mainLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2.5 text-xs font-bold shadow-md transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>Ir para o Leiloeiro</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* 2. Banner de Destaque: Score rings & Veredito */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 p-6 text-white shadow-md border border-slate-800">
        <div className="flex items-center gap-4">
          <ScoreBadge score={property.score} size="lg" />
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Score de Oportunidade: {property.score}/100 ({property.classificacao})
            </div>
            <div className="text-lg font-extrabold text-emerald-400 flex items-center gap-2 mt-0.5">
              <span>Veredito da IA: {property.veredicto}</span>
            </div>
          </div>
        </div>

        <CountdownBadge targetDateStr={property.data_1 || property.data_2} />
      </div>

      {/* 3. Grid Principal: ESQUERDA (Parecer IA) & DIREITA (Galeria, Resumo Financeiro, Leiloeiro, Central de Documentos) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* COLUNA ESQUERDA (7 cols): PARECER ANALÍTICO IA EXCLUSIVO NA ESQUERDA */}
        <div className="lg:col-span-7 space-y-6">

          {/* PARECER ANALÍTICO TÉCNICO & JURÍDICO (IA) */}
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-4">
              <h3 className="text-sm font-extrabold text-[var(--text-main)] flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[var(--color-primary)]" />
                Parecer Analítico Técnico & Jurídico (IA)
              </h3>
              <span className="rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-extrabold px-2.5 py-1 border border-[var(--color-primary)]/20">
                SÍNTESE UNIFICADA
              </span>
            </div>

            {/* Elemento HTML Estruturado 1: Card de Veredito & Diagnóstico Mestre */}
            <div className={`p-4 rounded-xl border space-y-2 ${property.veredicto.includes('NÃO COMPRAR')
              ? 'bg-red-500/5 border-red-500/20 text-red-900 dark:text-red-300'
              : property.veredicto.includes('Atenção')
                ? 'bg-amber-500/5 border-amber-500/20 text-amber-900 dark:text-amber-300'
                : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-900 dark:text-emerald-300'
              }`}>
              <div className="flex items-center justify-between font-extrabold text-sm">
                <span className="flex items-center gap-2">
                  {property.veredicto.includes('NÃO COMPRAR') ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  )}
                  Recomendação Final: {property.veredicto}
                </span>
                <span className="text-xs underline font-mono">ID #{property.id}</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                Imóvel avaliado com score <strong>{property.score}/100</strong>. Apresenta margem de deságio de <strong>{formatPercent(property.desconto_pct)}</strong> sobre a avaliação oficial da CAIXA.
              </p>
            </div>

            {/* Elemento HTML Estruturado 2: Grid de Atributos Legais e Regras de Pagamento */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Regras do Edital & Modalidade
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-sub)] border border-[var(--border-main)]">
                  <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] block">Recursos Próprios</span>
                  <span className="font-bold text-[var(--text-main)]">Exclusivo à Vista (Sinal 5%)</span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-sub)] border border-[var(--border-main)]">
                  <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] block">Uso de FGTS</span>
                  <span className={`font-bold ${property.fgts === 'Sim' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {property.fgts === 'Sim' ? 'Liberado conforme regras' : 'Não se Aplica neste Lote'}
                  </span>
                </div>
              </div>

              {/* Callout de Despesas de Condomínio e IPTU */}
              <div className="p-3.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] text-xs space-y-1.5">
                <span className="font-bold text-[var(--text-main)] block flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-[var(--color-primary)]" /> Responsabilidade de Débitos:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-[var(--text-muted)]">
                  <li><strong>Condomínio:</strong> Comprador assume até 10% da avaliação; CAIXA paga o excedente.</li>
                  <li><strong>Tributos/IPTU:</strong> Comprador assume quando débito for &lt; 10% da avaliação.</li>
                </ul>
              </div>
            </div>

            {/* Elemento HTML Estruturado 3: Parecer Técnico em Markdown Renderizado com Estilo HTML */}
            <div className="space-y-3 pt-2 border-t border-[var(--border-main)]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Dossie Completo da Análise
              </h4>

              <div className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] p-4 text-xs space-y-3">
                {isLoadingMarkdown ? (
                  <div className="flex h-20 items-center justify-center text-[var(--text-muted)]">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent"></div>
                  </div>
                ) : (
                  <article className="prose dark:prose-invert max-w-none text-[var(--text-main)] text-xs leading-relaxed font-medium prose-headings:font-bold prose-headings:text-[var(--color-primary)] prose-strong:text-[var(--text-main)]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {markdownContent}
                    </ReactMarkdown>
                  </article>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* COLUNA DIREITA (5 cols): Galeria de Fotos, Resumo Financeiro, Leiloeiro e Central de Documentos */}
        <div className="lg:col-span-5 space-y-6">
          {/* Atalhos Rápidos para o Leiloeiro Oficial */}
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 shadow-sm space-y-2">
            <a
              href={mainLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white p-3 text-xs font-bold shadow-md transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>Acessar Site do Leiloeiro Oficial</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Mídia & Galeria de Fotos */}
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
              <ImageIcon className="h-4 w-4 text-[var(--color-primary)]" /> Galeria de Fotos & Registro Imobiliário
            </h3>

            {/* Imagem Principal */}
            <div className="relative h-72 w-full overflow-hidden rounded-xl bg-slate-900 border border-[var(--border-main)] flex items-center justify-center">
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

            {/* Carrossel de Miniaturas */}
            {property.fotos_list && property.fotos_list.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {property.fotos_list.map((fUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhoto(fUrl)}
                    className={`h-14 w-14 overflow-hidden rounded-lg border-2 transition-all shrink-0 ${selectedPhoto === fUrl ? 'border-[var(--color-primary)] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img src={fUrl} alt={`Foto ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Resumo Financeiro & Calculadora de Custos */}
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                <Calculator className="h-4 w-4 text-blue-500" /> Resumo Financeiro & Composição de Custos
              </h3>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Deságio de -{formatPercent(property.desconto_pct)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-[var(--bg-sub)] p-3 border border-[var(--border-main)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Avaliação</span>
                <span className="text-xs font-bold text-[var(--text-muted)] line-through">{formatCurrency(avaliacao)}</span>
              </div>

              <div className="rounded-xl bg-blue-500/5 p-3 border border-blue-500/30">
                <span className="text-[10px] font-bold text-blue-500 uppercase block">Valor Mínimo</span>
                <span className="text-base font-extrabold text-blue-600">{formatCurrency(minimo)}</span>
              </div>

              <div className="rounded-xl bg-emerald-500/5 p-3 border border-emerald-500/30">
                <span className="text-[10px] font-bold text-emerald-500 uppercase block">Deságio Nominal</span>
                <span className="text-xs font-extrabold text-emerald-600">{formatCurrency(descontoNominal)}</span>
              </div>

              <div className="rounded-xl bg-[var(--bg-sub)] p-3 border border-[var(--border-main)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Custo Total Est.</span>
                <span className="text-xs font-bold text-[var(--text-main)]">{formatCurrency(custoTotalEstimado)}</span>
              </div>
            </div>

            <p className="text-[10px] text-[var(--text-muted)] italic pt-2 border-t border-[var(--border-main)]">
              * Custo total estimado inclui ~3% ITBI + ~1.5% emolumentos de escritura/registro cartorário.
            </p>
          </div>

          {/* Central de Documentos & Editais POSICIONADO NA DIREITA ABAIXO DO LEILOEIRO */}
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                <FolderDown className="h-4 w-4 text-emerald-600" /> Central de Documentos & Editais
              </h3>
              <span className="text-xs font-bold text-[var(--text-muted)]">
                {(property.documentos_list?.length || 0) + 1} arquivos disponíveis
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Botão de Documento para Captura Oficial (Screenshot) */}
              <button
                type="button"
                onClick={() => setShowScreenshotModal(true)}
                className="flex items-center justify-between rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] p-3 text-xs font-bold text-[var(--text-main)] hover:border-[var(--color-primary)] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <ImageIcon className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="truncate">Captura Oficial da Página CAIXA (Screenshot)</span>
                </div>
                <Maximize2 className="h-4 w-4 text-[var(--text-muted)] hover:text-[var(--color-primary)] shrink-0" />
              </button>

              {/* Listagem dos demais PDFs anexados */}
              {property.documentos_list && property.documentos_list.length > 0 &&
                property.documentos_list.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] p-3 text-xs font-bold text-[var(--text-main)] hover:border-[var(--color-primary)] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileCode className="h-4 w-4 text-red-500 shrink-0" />
                      <span className="truncate">{doc.nome}</span>
                    </div>
                    <Download className="h-4 w-4 text-[var(--text-muted)] hover:text-[var(--color-primary)] shrink-0" />
                  </a>
                ))}
            </div>
          </div>

        </div>

      </div>

      {/* Modal de Zoom da Screenshot Oficial */}
      {showScreenshotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="relative max-w-5xl w-full bg-[var(--bg-card)] rounded-2xl border border-[var(--border-main)] p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-[var(--color-primary)]" /> Captura Oficial da Página CAIXA — Imóvel #{property.id}
              </h3>
              <button
                onClick={() => setShowScreenshotModal(false)}
                className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-1 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-card)] cursor-pointer"
              >
                Fechar (ESC)
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto rounded-xl border border-[var(--border-main)] bg-slate-950">
              <img
                src={screenshotUrl}
                alt={`Screenshot da oportunidade ${property.id}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/data/ativos/1013765-3/screenshot.png';
                }}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
