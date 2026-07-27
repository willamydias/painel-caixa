'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { AlertTriangle, SearchX, RefreshCw, FileQuestion, Sparkles, Inbox, ServerOff } from 'lucide-react';

export default function EstadosEspeciaisPage() {
  return (
    <AppShell>
      <div className="space-y-8 max-w-[1500px] mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
            Galeria de Estados Especiais & Exceções (UX Resilience)
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Demonstração dos componentes de feedback para fallbacks, vazios, erros de API e carregamento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Estado Sem Resultados */}
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-8 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-sub)] text-[var(--text-muted)]">
              <SearchX className="h-7 w-7" />
            </div>
            <div className="max-w-xs mx-auto">
              <h3 className="text-sm font-extrabold text-[var(--text-main)]">Nenhum imóvel encontrado</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Tente ajustar os filtros de busca ou limpar a pesquisa por palavras-chave.
              </p>
            </div>
            <button className="rounded-xl bg-[var(--color-primary)] text-white px-4 py-2 text-xs font-bold shadow-md hover:bg-[var(--color-primary-hover)]">
              Limpar Filtros de Busca
            </button>
          </div>

          {/* 2. Estado IA Indisponível */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="max-w-xs mx-auto">
              <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-300">Análise de IA Indisponível</h3>
              <p className="text-xs text-amber-800 dark:text-amber-400 mt-1">
                O serviço de parecer sintético está em manutenção. Os dados do leilão permanecem 100% acessíveis.
              </p>
            </div>
            <button className="flex items-center gap-2 mx-auto rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 px-4 py-2 text-xs font-bold hover:bg-amber-500/20">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Tentar Novamente</span>
            </button>
          </div>

          {/* 3. Estado Sem Documentos */}
          <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] p-8 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-sub)] text-[var(--text-muted)]">
              <FileQuestion className="h-7 w-7" />
            </div>
            <div className="max-w-xs mx-auto">
              <h3 className="text-sm font-extrabold text-[var(--text-main)]">Certidões Não Baixadas</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Edital e Ficha Cadastral pendentes de extração na Receita DF para este lote.
              </p>
            </div>
            <button className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-main)] px-4 py-2 text-xs font-bold hover:bg-[var(--bg-card)]">
              Solicitar Segunda Via
            </button>
          </div>

          {/* 4. Estado Erro de Conexão */}
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-600">
              <ServerOff className="h-7 w-7" />
            </div>
            <div className="max-w-xs mx-auto">
              <h3 className="text-sm font-extrabold text-red-900 dark:text-red-300">Falha de Integração Supabase</h3>
              <p className="text-xs text-red-800 dark:text-red-400 mt-1">
                Não foi possível conectar ao banco de dados. Verifique o Docker Compose local.
              </p>
            </div>
            <button className="rounded-xl bg-red-600 text-white px-4 py-2 text-xs font-bold shadow-md hover:bg-red-700">
              Verificar Conexão
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
