export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  // Format DD/MM/YYYY or DD/MM/YYYY HHhMM
  const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return null;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const year = parseInt(match[3], 10);
  return new Date(year, month, day);
}

export function getScoreColorCategory(score: number): {
  badgeBg: string;
  badgeText: string;
  borderHex: string;
  bgHex: string;
  label: string;
} {
  if (score >= 85) {
    return {
      badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      badgeText: 'text-emerald-500 dark:text-emerald-400',
      borderHex: '#059669',
      bgHex: 'rgba(5, 150, 105, 0.15)',
      label: 'EXCELENTE',
    };
  }
  if (score >= 70) {
    return {
      badgeBg: 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
      badgeText: 'text-green-500 dark:text-green-400',
      borderHex: '#22c55e',
      bgHex: 'rgba(34, 197, 94, 0.15)',
      label: 'BOA',
    };
  }
  if (score >= 50) {
    return {
      badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
      badgeText: 'text-amber-500 dark:text-amber-400',
      borderHex: '#f59e0b',
      bgHex: 'rgba(245, 158, 11, 0.15)',
      label: 'MODERADA',
    };
  }
  return {
    badgeBg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
    badgeText: 'text-rose-500 dark:text-rose-400',
    borderHex: '#e11d48',
    bgHex: 'rgba(225, 29, 72, 0.15)',
    label: 'ALERTA',
  };
}
