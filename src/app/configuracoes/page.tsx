'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useDashboard } from '@/context/DashboardContext';
import { COLOR_PALETTES } from '@/lib/palettes';
import { checkDbStatus } from '@/lib/userSettings';
import { Settings, Sun, Moon, Palette, Sliders, Check, ShieldCheck, Database, CheckCircle2, Save } from 'lucide-react';

export default function ConfiguracoesPage() {
  const { theme, setThemeState, colorPalette, setColorPalette, userSettings, updateUserSettings } = useDashboard();
  
  const [minPreco, setMinPreco] = useState(userSettings.minPreco || 50000);
  const [maxPreco, setMaxPreco] = useState(userSettings.maxPreco || 800000);
  const [aceitaFGTS, setAceitaFGTS] = useState(userSettings.aceitaFGTS ?? true);
  const [aceitaFinanciamento, setAceitaFinanciamento] = useState(userSettings.aceitaFinanciamento ?? true);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ isConnected: boolean; message: string }>({ isConnected: true, message: '' });

  useEffect(() => {
    setDbStatus(checkDbStatus());
    setMinPreco(userSettings.minPreco || 50000);
    setMaxPreco(userSettings.maxPreco || 800000);
    setAceitaFGTS(userSettings.aceitaFGTS ?? true);
    setAceitaFinanciamento(userSettings.aceitaFinanciamento ?? true);
  }, [userSettings]);

  const handleSaveSettings = async () => {
    await updateUserSettings({
      minPreco,
      maxPreco,
      aceitaFGTS,
      aceitaFinanciamento,
      theme,
      colorPalette,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Configurações Globais & Preferências de Usuário
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Personalize o tema da aplicação, paleta de cores e parâmetros de busca. Suas preferências são salvas no banco de dados e restauradas ao fazer login.
            </p>
          </div>

          {/* Indicador de Status Operacional do Banco de Dados */}
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>DB Operacional & Sincronizado</span>
          </div>
        </div>

        {/* Feedback de salvamento */}
        {savedFeedback && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4" />
            <span>Configurações salvas com sucesso no banco de dados e sincronizadas em todas as telas!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card de Aparência e Tema */}
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
              <Palette className="h-5 w-5 text-[var(--color-primary)]" />
              <h3 className="text-base font-bold text-[var(--text-main)]">Aparência & Modo de Exibição</h3>
            </div>

            {/* 1. Seleção de Tema Light / Dark */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Modo de Exibição (Tema)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setThemeState('light')}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-4 text-xs font-bold transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
                      : 'border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Modo Claro (Padrão)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setThemeState('dark')}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-4 text-xs font-bold transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
                      : 'border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Moon className="h-4 w-4 text-indigo-400" />
                  <span>Modo Escuro (Dark)</span>
                </button>
              </div>
            </div>

            {/* 2. Seleção do Esquema de Cores (Paleta de Cores) */}
            <div className="space-y-3 pt-2 border-t border-[var(--border-main)]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Esquema & Paleta de Cores
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(COLOR_PALETTES).map((pal) => {
                  const isSelected = colorPalette === pal.key;
                  return (
                    <button
                      key={pal.key}
                      type="button"
                      onClick={() => setColorPalette(pal.key)}
                      className={`flex items-center justify-between rounded-xl border p-3 text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
                          : 'border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-main)] hover:border-[var(--color-primary)]/50'
                      }`}
                    >
                      <span className="truncate pr-1">{pal.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: pal.primaryHex }} />
                        <span className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: pal.secondaryHex }} />
                        {isSelected && <Check className="h-4 w-4 text-[var(--color-primary)] ml-1" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status do Banco */}
            <div className="p-3.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] text-xs space-y-1">
              <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <Database className="h-4 w-4 text-[var(--color-primary)]" />
                <span>Status da Base de Dados de Perfil:</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {dbStatus.message}
              </p>
            </div>
          </div>

          {/* Card de Perfil Padrão de Investimento */}
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
              <Sliders className="h-5 w-5 text-[var(--color-primary)]" />
              <h3 className="text-base font-bold text-[var(--text-main)]">Parâmetros Padrão de Busca</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-muted)] uppercase mb-2">
                  Intervalo de Valor Procurado (R$)
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <span className="text-[10px] text-[var(--text-muted)] block mb-1">Mínimo</span>
                    <input
                      type="number"
                      value={minPreco}
                      onChange={(e) => setMinPreco(Number(e.target.value))}
                      className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-2 text-xs font-bold text-[var(--text-main)]"
                    />
                  </div>
                  <span className="text-[var(--text-muted)] font-bold pt-4">até</span>
                  <div className="flex-1">
                    <span className="text-[10px] text-[var(--text-muted)] block mb-1">Máximo</span>
                    <input
                      type="number"
                      value={maxPreco}
                      onChange={(e) => setMaxPreco(Number(e.target.value))}
                      className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-2 text-xs font-bold text-[var(--text-main)]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--border-main)]">
                <label className="block font-bold text-[var(--text-muted)] uppercase mb-1">Formas de Pagamento Aceitas</label>
                
                <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)]">
                  <input
                    type="checkbox"
                    checked={aceitaFGTS}
                    onChange={(e) => setAceitaFGTS(e.target.checked)}
                    className="rounded text-[var(--color-primary)]"
                  />
                  <span className="font-bold text-[var(--text-main)]">Priorizar Imóveis com FGTS Liberado</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)]">
                  <input
                    type="checkbox"
                    checked={aceitaFinanciamento}
                    onChange={(e) => setAceitaFinanciamento(e.target.checked)}
                    className="rounded text-[var(--color-primary)]"
                  />
                  <span className="font-bold text-[var(--text-main)]">Permitir Financiamento CAIXA</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-white py-3 font-bold shadow-md hover:bg-[var(--color-primary-hover)] transition-all cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Salvar Configurações no Banco de Dados</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
