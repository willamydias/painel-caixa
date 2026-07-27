'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { AuctionCalendar } from '@/components/calendar/AuctionCalendar';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

export default function CalendarioPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto">
        {/* Componente Calendário */}
        <AuctionCalendar />
      </div>
    </AppShell>
  );
}
