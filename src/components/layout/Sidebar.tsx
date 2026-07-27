'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';
import {
  LayoutDashboard,
  Search,
  MapPin,
  Calendar,
  FileText,
  Bookmark,
  Kanban,
  Bell,
  Settings,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { selectedPropertyId, filters } = useDashboard();

  // Verificar se existe um imóvel selecionado ou filtro ativo
  const hasActiveFilterOrProperty =
    selectedPropertyId !== null ||
    filters.searchQuery !== '' ||
    filters.cidadeSatelite !== 'Todos' ||
    filters.bairro !== 'Todos' ||
    filters.modalidade !== 'Todos' ||
    filters.veredictoFilter !== 'Todos' ||
    filters.fgtsOnly ||
    filters.minDescontoPct > 0;

  const coreNav: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Oportunidades', href: '/oportunidades', icon: Search, badge: 'Caixa' },
    { label: 'Mapa de Imóveis', href: '/mapa', icon: MapPin },
    { label: 'Calendário de Leilões', href: '/calendario', icon: Calendar },
    // O subitem "Detalhes do Imóvel" fica escondido até selecionar um imóvel ou filtro
    ...(hasActiveFilterOrProperty
      ? [{ label: 'Detalhes do Imóvel', href: '/detalhes', icon: FileText, badge: 'Ativo' }]
      : []),
  ];

  const investorNav: NavItem[] = [
    { label: 'Meus Favoritos', href: '/favoritos', icon: Bookmark },
    { label: 'Labels & Kanban', href: '/labels', icon: Kanban },
    { label: 'Buscas & Alertas', href: '/alertas', icon: Bell },
  ];

  const systemNav: NavItem[] = [
    { label: 'Minha Conta', href: '/conta', icon: User },
    { label: 'Configurações', href: '/configuracoes', icon: Settings },
    { label: 'Estados Especiais', href: '/estados-especiais', icon: AlertTriangle },
    { label: 'Painel Admin', href: '/admin', icon: ShieldCheck, badge: 'Pro' },
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-6">
      {!collapsed && (
        <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
          {title}
        </div>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white shadow-sm shadow-[var(--color-primary)]/20'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-sub)] hover:text-[var(--text-main)]'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-[var(--text-muted)]'}`} />
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside
      className={`sticky top-16 z-20 hidden md:flex flex-col border-r border-[var(--border-main)] bg-[var(--bg-card)] transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      } h-[calc(100vh-4rem)] p-3 justify-between`}
    >
      <div className="overflow-y-auto">
        {renderNavGroup('Core Analítico', coreNav)}
        {renderNavGroup('Investidor', investorNav)}
        {renderNavGroup('Sistema', systemNav)}
      </div>

      {/* Footer / Perfil resumido & botão recolher */}
      <div className="border-t border-[var(--border-main)] pt-3">
        {!collapsed && (
          <div className="mb-3 rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] p-2.5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white text-xs font-bold shrink-0">
              W
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-[var(--text-main)] truncate">Wagner Jr.</div>
              <div className="text-[10px] text-[var(--color-primary)] font-semibold flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" /> Plano Pro (Ativo)
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-all"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Recolher Menu</span>}
        </button>
      </div>
    </aside>
  );
}
