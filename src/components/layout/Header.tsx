'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '@/context/DashboardContext';
import { useUser } from '@/context/UserContext';
import { Landmark, Search, Database, Sparkles, Settings, Users, ChevronDown, Check, UserPlus, LogOut } from 'lucide-react';

export function Header() {
  const { filters, updateFilter, lastScrapingDate, allProperties } = useDashboard();
  const { currentUser, allUsers, switchUser, logout, isDbConnected } = useUser();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--border-main)] bg-[var(--bg-header)]/95 backdrop-blur transition-colors">
      <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Commercial Minimalist Logo & Title */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20 border border-white/20">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[var(--text-main)] font-sans">
                Painel <span className="text-[var(--color-primary)]">Imobiliário</span>
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                <Sparkles className="h-3 w-3" /> By WMSD
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Plataforma Analítica de Oportunidades CAIXA
            </p>
          </div>
        </Link>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Buscar por bairro, endereço, ID Caixa..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] pl-10 pr-4 py-2 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-primary)] focus:bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => updateFilter('searchQuery', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Right: DB Status, Scraping Date & Seletor de Multiusuário */}
        <div className="flex items-center gap-3">
          
          {/* Dynamic Scraping Date & DB Badge */}
          <div className="hidden lg:flex items-center gap-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-1.5 text-xs">
            <div className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-[11px] font-bold text-[var(--text-main)]">
                {isDbConnected ? 'PostgreSQL ON' : 'DB Offline (Local)'}
              </span>
            </div>
            <span className="text-[var(--border-main)]">|</span>
            <span className="font-extrabold text-[var(--text-muted)] text-[11px]">
              {lastScrapingDate} ({allProperties.length} imóveis)
            </span>
          </div>

          {/* User Switcher Dropdown (Multiusuário) */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-1.5 hover:border-[var(--color-primary)] hover:bg-[var(--bg-card)] transition-all cursor-pointer shadow-sm"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white text-xs font-extrabold">
                {currentUser.full_name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-extrabold text-[var(--text-main)] leading-tight truncate max-w-[110px]">
                  {currentUser.full_name.split(' ')[0]}
                </div>
                <div className="text-[9px] text-[var(--color-primary)] font-bold uppercase tracking-wider">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-2 shadow-2xl z-50 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-[var(--border-main)]">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[var(--color-primary)]" /> Alternar Conta (Multiusuário)
                  </div>
                </div>

                <div className="py-1 space-y-1">
                  {allUsers.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUser(user.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs text-left transition-all ${
                          isSelected
                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold border border-[var(--color-primary)]/20'
                            : 'hover:bg-[var(--bg-sub)] text-[var(--text-main)] font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold text-xs">
                            {user.full_name.charAt(0)}
                          </div>
                          <div className="truncate">
                            <div className="truncate leading-tight">{user.full_name}</div>
                            <div className="text-[10px] text-[var(--text-muted)] font-medium truncate">{user.email}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-[var(--color-primary)] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-[var(--border-main)] pt-1 mt-1 space-y-1">
                  <Link
                    href="/admin"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Gerenciar Perfis & Cadastrar</span>
                  </Link>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair / Encerrar Sessão</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Atalho para Configurações */}
          <Link
            href="/configuracoes"
            title="Ir para Configurações Globais & Preferências de Tema"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-main)] hover:border-[var(--color-primary)] hover:bg-[var(--bg-card)] transition-colors"
          >
            <Settings className="h-4 w-4 text-[var(--color-primary)]" />
          </Link>

        </div>

      </div>
    </header>
  );
}
