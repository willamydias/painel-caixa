'use client';

import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'emerald';
  badgeText?: string;
}

export function KPICard({ title, value, subtitle, icon, variant = 'primary', badgeText }: KPICardProps) {
  const variantStyles = {
    primary: 'border-blue-500/20 bg-blue-500/10 text-blue-500',
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
    success: 'border-green-500/20 bg-green-500/10 text-green-500',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-500',
    info: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-500',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-4 shadow-sm transition-all hover:border-blue-500">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          {title}
        </span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${variantStyles[variant]}`}>
          {icon}
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-extrabold tracking-tight text-[var(--text-main)] font-sans">
          {value}
        </div>
        {badgeText && (
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs font-medium text-[var(--text-muted)] truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
}
