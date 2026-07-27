'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Landmark, ArrowRight, ShieldCheck, Zap, TrendingUp, Lock, Mail, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em produção via Supabase Auth
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-page)] text-[var(--text-main)]">
      {/* Coluna Esquerda: Formulário de Login */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-xl mx-auto w-full">
        {/* Header da Marca */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-md">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-[var(--text-main)]">
                Leilão<span className="text-[var(--color-primary)]">Ninja</span> Pro
              </span>
              <span className="block text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider">
                Inteligência Imobiliária CAIXA
              </span>
            </div>
          </Link>
          <Link
            href="mailto:comercial@leilaoninja.com.br"
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
          >
            Falar com Vendas
          </Link>
        </div>

        {/* Card do Formulário */}
        <div className="my-auto py-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Acesso Exclusivo para Investidores
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
              Acesse sua conta
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              Digite suas credenciais de acesso ou entre com sua conta Google cadastrada.
            </p>
          </div>

          <div className="space-y-4">
            {/* Botão Google */}
            <button
              onClick={() => (window.location.href = '/dashboard')}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] px-4 py-3 text-sm font-bold text-[var(--text-main)] hover:bg-[var(--bg-sub)] transition-all shadow-sm"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Entrar com Google</span>
            </button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-main)]" />
              </div>
              <span className="relative bg-[var(--bg-page)] px-3 text-xs uppercase font-extrabold text-[var(--text-muted)] tracking-wider">
                ou continue com e-mail
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  E-mail corporativo ou pessoal
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    required
                    placeholder="investidor@exemplo.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] pl-10 pr-4 py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Senha de acesso
                  </label>
                  <a href="#" className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
                    Esqueceu sua senha?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] pl-10 pr-4 py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[var(--border-main)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <span className="text-xs font-medium text-[var(--text-main)]">Lembrar-me neste dispositivo</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-3 px-4 text-sm font-bold shadow-md shadow-[var(--color-primary)]/20 transition-all cursor-pointer"
              >
                <span>Acessar Plataforma</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer do Form */}
        <div className="text-xs text-[var(--text-muted)] text-center sm:text-left">
          Ao entrar, você concorda com nossos{' '}
          <a href="#" className="underline hover:text-[var(--text-main)]">Termos de Uso</a> e{' '}
          <a href="#" className="underline hover:text-[var(--text-main)]">Política de Privacidade</a>.
        </div>
      </div>

      {/* Coluna Direita: Showroom editorial & proposta de valor (Oculta em mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden border-l border-[var(--border-main)]">
        {/* Background Overlay com padrão sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/80 via-slate-900 to-slate-950 z-0" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-300 border border-teal-500/30">
            <Zap className="h-3.5 w-3.5 text-teal-400" /> Plataforma SaaS v2.4
          </span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Decisões de Investimento Imobiliário Pautadas por Inteligência de Dados
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Monitore oportunidades da CAIXA Econômica Federal em tempo real com cálculo automático de ROI, pareceres jurídicos por IA e certidões atualizadas.
          </p>

          {/* Cards de Proposta de Valor */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 border border-white/10 backdrop-blur">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-slate-950 font-bold">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Algoritmo de Score & Deságio</div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Avaliação automatizada de preço de mercado vs lance mínimo e potencial de rentabilidade.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 border border-white/10 backdrop-blur">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-slate-950 font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Diligência Jurídica & Certidões</div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Verificação de FGTS, financiamento, débitos de IPTU e veredito analítico por IA.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800 pt-6">
          <span>© 2026 Leilão Ninja Inc. Todos os direitos reservados.</span>
          <span>Status: Operacional 100%</span>
        </div>
      </div>
    </div>
  );
}
