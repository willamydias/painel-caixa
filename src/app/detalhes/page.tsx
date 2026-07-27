'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PropertyDetailFullView } from '@/components/detail/PropertyDetailFullView';

export default function DetalhesDefaultPage() {
  return (
    <AppShell>
      <PropertyDetailFullView />
    </AppShell>
  );
}
