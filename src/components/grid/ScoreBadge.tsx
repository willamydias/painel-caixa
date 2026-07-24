'use client';

import React from 'react';
import { getScoreColorCategory } from '@/lib/formatters';
import { ShieldCheck, Award, AlertTriangle, AlertCircle } from 'lucide-react';

interface ScoreBadgeProps {
  score: number;
  classificacao?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const cat = getScoreColorCategory(score);

  const getIcon = () => {
    if (score >= 85) return <Award className="h-3.5 w-3.5" />;
    if (score >= 70) return <ShieldCheck className="h-3.5 w-3.5" />;
    if (score >= 50) return <AlertTriangle className="h-3.5 w-3.5" />;
    return <AlertCircle className="h-3.5 w-3.5" />;
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm font-extrabold',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg border font-bold uppercase tracking-wider shadow-sm transition-all ${cat.badgeBg} ${sizeClasses[size]}`}
    >
      {getIcon()}
      <span>Score {score}</span>
      <span className="opacity-75">({cat.label})</span>
    </div>
  );
}
