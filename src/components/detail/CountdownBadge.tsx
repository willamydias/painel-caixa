'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { parseDate } from '@/lib/formatters';

interface CountdownBadgeProps {
  targetDateStr?: string;
  label?: string;
}

export function CountdownBadge({ targetDateStr, label }: CountdownBadgeProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!targetDateStr) return;
    const targetDate = parseDate(targetDateStr);
    if (!targetDate) return;

    // Default target time to 23:59:59 of target date
    targetDate.setHours(23, 59, 59);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!targetDateStr) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <Clock className="h-3.5 w-3.5 text-slate-400" />
        <span>Prazo contínuo (Venda Direta)</span>
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Clock className="h-3.5 w-3.5" />
        <span>Data limite: {targetDateStr}</span>
      </div>
    );
  }

  const isUrgent = timeLeft.days < 2;

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold shadow-sm ${
        isUrgent
          ? 'animate-pulse bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
      }`}
    >
      {isUrgent ? <AlertTriangle className="h-4 w-4 text-rose-500" /> : <Clock className="h-4 w-4 text-indigo-500" />}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-80">
          {label || 'Encerramento da Oferta'}
        </span>
        <span className="font-mono text-sm tracking-tight font-extrabold">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
}
