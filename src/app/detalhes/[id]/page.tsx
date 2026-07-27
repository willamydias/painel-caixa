'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PropertyDetailFullView } from '@/components/detail/PropertyDetailFullView';

export default function DetalhesIdPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <AppShell>
      <PropertyDetailFullView propertyId={id} />
    </AppShell>
  );
}
