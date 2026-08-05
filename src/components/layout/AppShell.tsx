'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { PropertyNoteModal } from '@/components/modals/PropertyNoteModal';

interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function AppShell({ children, showSidebar = true }: AppShellProps) {
  const { isAuthenticated, isAuthLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoaded && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isAuthLoaded, router]);

  // Aguardar carregamento síncrono da sessão
  if (!isAuthLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-[var(--text-main)] text-xs font-bold">
        Carregando sessão...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-[var(--text-main)] text-xs font-bold">
        Autenticação necessária. Redirecionando para login...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-main)] transition-colors">
      <Header />
      <div className="flex flex-1 w-full max-w-[1920px] mx-auto">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
      <PropertyNoteModal />
    </div>
  );
}
