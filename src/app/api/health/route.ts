import { NextResponse } from 'next/server';
import { getDbHealthStatus } from '@/lib/db';

export async function GET() {
  const dbHealth = await getDbHealthStatus();
  const isHealthy = dbHealth.primary || dbHealth.secondary;

  return NextResponse.json(
    {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealth,
      environment: process.env.NODE_ENV,
    },
    { status: 200 }
  );
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
