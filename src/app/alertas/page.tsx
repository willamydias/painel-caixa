'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/context/UserContext';
import { Bell, Plus, Mail, MessageSquare, Trash2, CheckCircle2 } from 'lucide-react';
import { UserAlertDB } from '@/lib/db';

export default function AlertasPage() {
  const { currentUser } = useUser();
  const [alerts, setAlerts] = useState<UserAlertDB[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('Diária por E-mail');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await fetch(`/api/alerts?userId=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setAlerts(data.alerts || []);
        }
      } catch (err) {
        console.warn('Erro ao carregar alertas:', err);
      }
    }
    loadAlerts();
  }, [currentUser]);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          name,
          frequency,
          searchQuery,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAlerts([data.alert, ...alerts]);
        setName('');
        setSearchQuery('');
        setShowModal(false);
        setSavedFeedback(true);
        setTimeout(() => setSavedFeedback(false), 3000);
      }
    } catch (err) {
      console.error('Erro ao salvar alerta:', err);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-2">
              <Bell className="h-3.5 w-3.5" /> Automação em Banco de Dados • {currentUser.full_name}
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Buscas Salvas & Central de Alertas ({alerts.length})
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Configure regras de monitoramento salvas no PostgreSQL para receber notificações de leilões da CAIXA.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Criar Nova Busca Salva</span>
          </button>
        </div>

        {savedFeedback && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Alerta gravado com sucesso no PostgreSQL!</span>
          </div>
        )}

        {/* Tabela de Alertas */}
        <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] font-extrabold uppercase text-[10px] tracking-wider">
                <th className="p-4">Status & Nome da Busca</th>
                <th className="p-4">Filtros / Query</th>
                <th className="p-4">Frequência</th>
                <th className="p-4">Canal</th>
                <th className="p-4">Data de Criação</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-main)]">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[var(--text-muted)] italic">
                    Nenhum alerta cadastrado para esta conta. Clique em "Criar Nova Busca Salva" para configurar.
                  </td>
                </tr>
              ) : (
                alerts.map((alerta) => (
                  <tr key={alerta.id} className="hover:bg-[var(--bg-sub)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                          <div className="font-bold text-[var(--text-main)] text-sm">{alerta.name}</div>
                          <div className="text-[10px] text-[var(--text-muted)] font-medium">ID: {alerta.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs font-mono text-[11px] text-[var(--text-main)] truncate">
                      {alerta.search_query || 'Sem filtro textual (Geral DF)'}
                    </td>
                    <td className="p-4 font-semibold text-[var(--text-muted)]">{alerta.frequency}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] px-2.5 py-1 text-[11px] font-bold text-[var(--text-main)]">
                        <Mail className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                        E-mail
                      </span>
                    </td>
                    <td className="p-4 text-[var(--text-muted)]">
                      {new Date(alerta.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setAlerts(alerts.filter((a) => a.id !== alerta.id))}
                        className="p-1.5 rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-red-500"
                        title="Excluir Alerta"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de Criação de Alerta */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <form onSubmit={handleCreateAlert} className="w-full max-w-md rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-extrabold text-[var(--text-main)] border-b border-[var(--border-main)] pb-3">
                Gravar Novo Alerta no PostgreSQL
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[var(--text-muted)] uppercase mb-1">Nome do Alerta</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Casas em Águas Claras com FGTS"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-2 text-xs font-semibold text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-muted)] uppercase mb-1">Termos de Busca / Filtro</label>
                  <input
                    type="text"
                    placeholder="Ex: desagio > 40% & bairro = Taguatinga"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-2 text-xs font-semibold text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-muted)] uppercase mb-1">Frequência</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-2 text-xs font-bold text-[var(--text-main)]"
                  >
                    <option value="Diária por E-mail">Diária por E-mail</option>
                    <option value="Tempo Real (WhatsApp)">Tempo Real (WhatsApp)</option>
                    <option value="Semanal">Semanal</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-main)] text-xs">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-4 py-2 font-bold text-[var(--text-muted)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[var(--color-primary)] text-white px-4 py-2 font-bold shadow-md"
                >
                  Gravar Alerta
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </AppShell>
  );
}
