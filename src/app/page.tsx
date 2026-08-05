'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import DashboardPage from './dashboard/page';

export default function Home() {
  const { isAuthenticated, isAuthLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoaded && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isAuthLoaded, router]);

  if (!isAuthLoaded || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-[var(--text-main)] text-xs font-bold">
        Verificando autenticação...
      </div>
    );
  }

  return <DashboardPage />;
}
