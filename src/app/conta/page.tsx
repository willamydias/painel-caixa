'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { User, CreditCard, ShieldCheck, Bell, Key, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ContaPage() {
  const [activeTab, setActiveTab] = useState<'perfil' | 'plano' | 'seguranca' | 'api'>('perfil');

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Minha Conta & Assinatura
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Gerencie seus dados pessoais, plano Pro, faturamento e preferências de acesso.
            </p>
          </div>
        </div>

        {/* Tabs da Conta */}
        <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
          {[
            { id: 'perfil', label: 'Dados de Perfil', icon: User },
            { id: 'plano', label: 'Plano & Faturamento', icon: CreditCard },
            { id: 'seguranca', label: 'Segurança & Senha', icon: ShieldCheck },
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

        {/* Conteúdo da Tab */}
        {activeTab === 'perfil' && (
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm space-y-6 max-w-2xl">
            <h3 className="text-base font-bold text-[var(--text-main)] border-b border-[var(--border-main)] pb-3">
              Informações do Usuário
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-[var(--text-muted)] mb-1">Nome Completo</label>
                <input
                  type="text"
                  defaultValue="Wagner Junior"
                  className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-4 py-2.5 text-sm text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-[var(--text-muted)] mb-1">E-mail de Acesso</label>
                <input
                  type="email"
                  defaultValue="advwagnerjunior@gmail.com"
                  className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-4 py-2.5 text-sm text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-[var(--text-muted)] mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  defaultValue="(61) 99999-8888"
                  className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-4 py-2.5 text-sm text-[var(--text-main)]"
                />
              </div>

              <button className="rounded-xl bg-[var(--color-primary)] text-white px-5 py-2.5 font-bold shadow-md hover:bg-[var(--color-primary-hover)] transition-colors">
                Salvar Alterações
              </button>
            </div>
          </div>
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

            {/* Histórico de Faturas */}
            <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-[var(--text-main)]">Histórico de Pagamentos</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)]">
                  <div>
                    <div className="font-bold text-[var(--text-main)]">Fatura #INV-2026-07</div>
                    <div className="text-[10px] text-[var(--text-muted)]">25/07/2026 • Cartão de Crédito **** 4022</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-emerald-600">R$ 297,00</span>
                    <button className="text-[var(--color-primary)] hover:underline font-bold">PDF</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
