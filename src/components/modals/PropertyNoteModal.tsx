'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { useUser } from '@/context/UserContext';
import { X, Save, FileText, Tag, DollarSign, CheckCircle2, Bookmark, Sparkles, Building2 } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/formatters';

export function PropertyNoteModal() {
  const { activeNoteProperty, setActiveNoteProperty, propertyNotes, updatePropertyNote } = useDashboard();
  const { currentUser } = useUser();

  const [kanbanStatus, setKanbanStatus] = useState<'Interessante' | 'Em Análise' | 'Lance Agendado' | 'Descartado'>('Interessante');
  const [noteText, setNoteText] = useState('');
  const [maxLance, setMaxLance] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (activeNoteProperty) {
      const existing = propertyNotes[activeNoteProperty.id];
      if (existing) {
        setKanbanStatus(existing.kanban_status || 'Interessante');
        setNoteText(existing.note_text || '');
        setMaxLance(existing.max_lance ? String(existing.max_lance) : '');
        setTags(existing.tags || []);
      } else {
        setKanbanStatus('Interessante');
        setNoteText('');
        setMaxLance('');
        setTags([]);
      }
    }
  }, [activeNoteProperty, propertyNotes]);

  if (!activeNoteProperty) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updatePropertyNote(activeNoteProperty.id, {
      kanban_status: kanbanStatus,
      note_text: noteText,
      max_lance: maxLance ? Number(maxLance) : undefined,
      tags,
    });
    setIsSaving(false);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      setActiveNoteProperty(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header do Modal */}
        <div className="flex items-start justify-between border-b border-[var(--border-main)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-1">
                <Sparkles className="h-3 w-3" /> Anotação em Banco de Dados • {currentUser.full_name}
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text-main)] truncate max-w-md">
                {activeNoteProperty.endereco || activeNoteProperty.bairro || 'Imóvel CAIXA'}
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                ID Caixa: {activeNoteProperty.id} • {activeNoteProperty.cidade_satelite} (DF)
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveNoteProperty(null)}
            className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Resumo do Imóvel */}
        <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-sub)] p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-[var(--text-muted)] font-medium block">Valor Mínimo CAIXA</span>
            <span className="text-base font-extrabold text-[var(--text-main)]">
              {formatCurrency(activeNoteProperty.valor_minimo_num || 0)}
            </span>
          </div>
          {activeNoteProperty.desconto_pct > 0 && (
            <div>
              <span className="text-[var(--text-muted)] font-medium block">Deságio Oficial</span>
              <span className="text-base font-extrabold text-emerald-600">
                {formatPercent(activeNoteProperty.desconto_pct)} OFF
              </span>
            </div>
          )}
          <div>
            <span className="text-[var(--text-muted)] font-medium block">Modalidade</span>
            <span className="font-bold text-[var(--color-primary)]">
              {activeNoteProperty.modalidade || 'Venda Direta Online'}
            </span>
          </div>
        </div>

        {/* Form de Anotações e Kanban */}
        <div className="space-y-5 text-xs">
          {/* Status do Kanban */}
          <div>
            <label className="block uppercase font-extrabold text-[var(--text-muted)] tracking-wider mb-2">
              Status na Esteira de Investimento (Kanban)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Interessante', color: 'border-blue-500/30 bg-blue-500/10 text-blue-600' },
                { id: 'Em Análise', color: 'border-amber-500/30 bg-amber-500/10 text-amber-600' },
                { id: 'Lance Agendado', color: 'border-purple-500/30 bg-purple-500/10 text-purple-600' },
                { id: 'Descartado', color: 'border-slate-500/30 bg-slate-500/10 text-slate-500' },
              ].map((st) => {
                const isSelected = kanbanStatus === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setKanbanStatus(st.id as any)}
                    className={`rounded-xl border p-3 font-bold transition-all text-center ${
                      isSelected
                        ? `${st.color} ring-2 ring-[var(--color-primary)]/30 shadow-sm`
                        : 'border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {st.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lance Máximo Planejado */}
          <div>
            <label className="block uppercase font-extrabold text-[var(--text-muted)] tracking-wider mb-1.5 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" /> Teto Máximo de Lance Planejado (R$)
            </label>
            <input
              type="number"
              placeholder="Ex: 210000"
              value={maxLance}
              onChange={(e) => setMaxLance(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-4 py-2.5 text-sm font-bold text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-primary)] focus:bg-[var(--bg-card)] focus:outline-none"
            />
          </div>

          {/* Tags Personalizadas */}
          <div>
            <label className="block uppercase font-extrabold text-[var(--text-muted)] tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-[var(--color-primary)]" /> Marcadores & Tags (Pressione Enter)
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 px-2.5 py-1 text-xs font-bold"
                >
                  #{tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Digite uma tag (ex: Reformar, Ocupado, Aceita FGTS) e dê Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-4 py-2.5 text-xs font-semibold text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>

          {/* Anotação em Texto Livre */}
          <div>
            <label className="block uppercase font-extrabold text-[var(--text-muted)] tracking-wider mb-1.5">
              Parecer Técnico & Notas do Investidor
            </label>
            <textarea
              rows={4}
              placeholder="Insira aqui observações de visita ao local, débitos de IPTU confirmados na Receita DF, opiniões do advogado..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] p-4 text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-primary)] focus:bg-[var(--bg-card)] focus:outline-none"
            />
          </div>
        </div>

        {/* Feedback de confirmação */}
        {savedFeedback && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Anotação gravada com sucesso no PostgreSQL e vinculada ao perfil {currentUser.full_name}!</span>
          </div>
        )}

        {/* Footer do Modal */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--border-main)] pt-4">
          <button
            onClick={() => setActiveNoteProperty(null)}
            className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-5 py-2.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-2.5 text-xs font-bold shadow-md shadow-[var(--color-primary)]/20 transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Gravando no Banco...' : 'Gravar Anotação'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
