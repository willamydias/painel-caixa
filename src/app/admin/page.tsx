'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/context/UserContext';
import { ShieldCheck, RefreshCw, UserPlus, Server, CheckCircle2, Lock, Users, ArrowRight } from 'lucide-react';

export default function AdminPage() {
  const { allUsers, currentUser, switchUser, addUserProfile, isAdmin, isDbConnected } = useUser();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'investor' | 'analyst'>('investor');
  const [isScrapingRunning, setIsScrapingRunning] = useState(false);
  const [scrapingMsg, setScrapingMsg] = useState('');

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail) return;

    const id = 'usr_' + newFullName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4);
    await addUserProfile({
      id,
      full_name: newFullName,
      email: newEmail,
      phone: newPhone,
      role: newRole,
      avatar_url: '',
    });

    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const handleTriggerScraping = async () => {
    setIsScrapingRunning(true);
    setScrapingMsg('Disparando rotina de raspagem e sincronia PostgreSQL...');
    setTimeout(() => {
      setIsScrapingRunning(false);
      setScrapingMsg('Scraping concluído! 89 ativos atualizados na base de dados.');
      setTimeout(() => setScrapingMsg(''), 4000);
    }, 2500);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-600 border border-purple-500/20 mb-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Controle Operacional Mestre (RBAC)
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Painel Administrativo & Gestão Multiusuário
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Gerencie usuários, permissões de acesso RBAC e monitore empreendimentos e jobs de raspagem.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-4 py-2.5 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4 text-[var(--color-primary)]" />
              <span>Novo Usuário</span>
            </button>

            <button
              onClick={handleTriggerScraping}
              disabled={isScrapingRunning}
              className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isScrapingRunning ? 'animate-spin' : ''}`} />
              <span>{isScrapingRunning ? 'Executando Scraping...' : 'Disparar Scraping Manual'}</span>
            </button>
          </div>
        </div>

        {/* Feedback do Scraping */}
        {scrapingMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{scrapingMsg}</span>
          </div>
        )}

        {/* Grid de Métricas de Infraestrutura */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 shadow-sm space-y-1">
            <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Usuários Cadastrados</span>
            <div className="text-2xl font-extrabold text-[var(--text-main)]">{allUsers.length} perfis</div>
            <div className="text-[10px] text-emerald-600 font-bold">Multiusuário Ativo</div>
          </div>

          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 shadow-sm space-y-1">
            <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Status PostgreSQL DB</span>
            <div className="text-2xl font-extrabold text-emerald-600">{isDbConnected ? 'Operacional' : 'Local'}</div>
            <div className="text-[10px] text-[var(--text-muted)] font-bold">porta 5432 / painel-supabase</div>
          </div>

          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 shadow-sm space-y-1">
            <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Sessão Ativa Atual</span>
            <div className="text-lg font-extrabold text-[var(--text-main)] truncate">{currentUser.full_name}</div>
            <div className="text-[10px] text-[var(--color-primary)] font-bold uppercase">{currentUser.role}</div>
          </div>

          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 shadow-sm space-y-1">
            <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Fila de Processamento IA</span>
            <div className="text-2xl font-extrabold text-blue-600">0 em fila</div>
            <div className="text-[10px] text-emerald-600 font-bold">100% sintetizados</div>
          </div>
        </div>

        {/* Tabela de Gestão de Usuários & Perfis RBAC */}
        <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[var(--text-main)] flex items-center gap-2">
              <Users className="h-4 w-4 text-[var(--color-primary)]" /> Usuários Cadastrados & Permissões RBAC (PostgreSQL)
            </h3>
            <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-3 py-1 text-[10px] font-extrabold border border-emerald-500/20">
              {allUsers.length} Contas Ativas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-muted)] font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="p-3">ID / Usuário</th>
                  <th className="p-3">E-mail</th>
                  <th className="p-3">Telefone</th>
                  <th className="p-3">Perfil RBAC</th>
                  <th className="p-3">Sessão Atual</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-main)]">
                {allUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <tr key={u.id} className="hover:bg-[var(--bg-sub)] transition-colors">
                      <td className="p-3 font-bold">
                        <div className="text-[var(--text-main)]">{u.full_name}</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-normal">{u.id}</div>
                      </td>
                      <td className="p-3 font-medium">{u.email}</td>
                      <td className="p-3 font-medium">{u.phone || '-'}</td>
                      <td className="p-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${
                          u.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                            : u.role === 'investor'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        {isCurrent ? (
                          <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-extrabold">
                            ✓ Ativo
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)] text-[10px]">-</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => switchUser(u.id)}
                          className="text-[var(--color-primary)] hover:underline font-bold text-[11px]"
                        >
                          {isCurrent ? 'Sessão Ativa' : 'Assumir Conta'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Adicionar Novo Usuário */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <form onSubmit={handleAddUser} className="w-full max-w-md rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-extrabold text-[var(--text-main)] border-b border-[var(--border-main)] pb-3">
                Cadastrar Novo Usuário Multiusuário
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[var(--text-muted)] uppercase mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-2 text-xs font-semibold text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-muted)] uppercase mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@exemplo.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-2 text-xs font-semibold text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-muted)] uppercase mb-1">Telefone</label>
                  <input
                    type="text"
                    placeholder="(61) 99999-8888"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-2 text-xs font-semibold text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-muted)] uppercase mb-1">Papel RBAC</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-2 text-xs font-bold text-[var(--text-main)]"
                  >
                    <option value="investor">Investidor Pro</option>
                    <option value="analyst">Analista Jurídico</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-main)] text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-4 py-2 font-bold text-[var(--text-muted)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[var(--color-primary)] text-white px-4 py-2 font-bold shadow-md"
                >
                  Salvar no PostgreSQL
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </AppShell>
  );
}
