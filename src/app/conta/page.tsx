'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/context/UserContext';
import { User, CreditCard, ShieldCheck, Key, Sparkles, CheckCircle2, Save, Users } from 'lucide-react';

export default function ContaPage() {
  const { currentUser, updateUserProfile, isDbConnected } = useUser();
  const [activeTab, setActiveTab] = useState<'perfil' | 'plano' | 'seguranca' | 'api'>('perfil');

  const [fullName, setFullName] = useState(currentUser.full_name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [role, setRole] = useState(currentUser.role);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    setFullName(currentUser.full_name);
    setEmail(currentUser.email);
    setPhone(currentUser.phone);
    setRole(currentUser.role);
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      full_name: fullName,
      email,
      phone,
      role,
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
              Minha Conta & Perfil de Investidor
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Gerencie seus dados pessoais, papel de acesso RBAC e parâmetros da sua conta no PostgreSQL.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>DB {isDbConnected ? 'PostgreSQL Conectado' : 'Modo Local'}</span>
          </div>
        </div>

        {/* Tabs da Conta */}
        <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
          {[
            { id: 'perfil', label: 'Dados de Perfil', icon: User },
            { id: 'plano', label: 'Plano & Faturamento', icon: CreditCard },
            { id: 'seguranca', label: 'Segurança & RBAC', icon: ShieldCheck },
            { id: 'api', label: 'Integrações & API', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-sub)] hover:text-[var(--text-main)]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {savedFeedback && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Perfil atualizado com sucesso no PostgreSQL e sincronizado na sessão!</span>
          </div>
        )}

        {/* Conteúdo da Tab */}
        {activeTab === 'perfil' && (
          <form onSubmit={handleSaveProfile} className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm space-y-6 max-w-2xl">
            <h3 className="text-base font-bold text-[var(--text-main)] border-b border-[var(--border-main)] pb-3 flex items-center justify-between">
              <span>Informações do Usuário Ativo</span>
              <span className="text-xs text-[var(--color-primary)] font-semibold">ID: {currentUser.id}</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-[var(--text-muted)] mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-4 py-2.5 text-sm text-[var(--text-main)] font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-[var(--text-muted)] mb-1">E-mail de Acesso</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-4 py-2.5 text-sm text-[var(--text-main)] font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-[var(--text-muted)] mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-4 py-2.5 text-sm text-[var(--text-main)] font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-[var(--text-muted)] mb-1">Papel no Sistema (RBAC)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-4 py-2.5 text-sm font-bold text-[var(--text-main)]"
                >
                  <option value="admin">Administrador Sistema (Acesso Total)</option>
                  <option value="investor">Investidor Pro (Favoritos & Anotações)</option>
                  <option value="analyst">Analista Jurídico (Certidões & Diligência)</option>
                </select>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] text-white px-5 py-2.5 text-xs font-bold shadow-md hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Salvar Alterações no Banco</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === 'plano' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border-main)] bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--bg-card)] to-[var(--bg-card)] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] text-white px-3 py-1 text-xs font-bold mb-2">
                  <Sparkles className="h-3.5 w-3.5" /> Plano Investor Pro
                </span>
                <h3 className="text-xl font-extrabold text-[var(--text-main)]">R$ 297,00 / mês</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Sua assinatura renova automaticamente em 25/08/2026.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-main)] px-4 py-2.5 text-xs font-bold hover:bg-[var(--bg-card)]">
                  Gerenciar Faturamento
                </button>
                <button className="rounded-xl bg-[var(--color-primary)] text-white px-4 py-2.5 text-xs font-bold shadow-md hover:bg-[var(--color-primary-hover)]">
                  Upgrade para Enterprise
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
