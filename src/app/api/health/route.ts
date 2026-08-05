import { NextResponse } from 'next/server';
import { getDbHealthStatus } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbHealth = await getDbHealthStatus();
  
  const status = {
    status: dbHealth.primary || dbHealth.secondary ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbHealth,
    environment: process.env.NODE_ENV || 'development',
  };

  return NextResponse.json(status, {
    status: status.status === 'ok' ? 200 : 503,
  });
}
