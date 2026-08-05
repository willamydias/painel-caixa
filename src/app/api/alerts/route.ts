import { NextResponse } from 'next/server';
import { initDbSchema, fetchUserAlertsFromDb, saveUserAlertToDb, UserAlertDB } from '@/lib/db';

export async function GET(req: Request) {
  await initDbSchema();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || 'usr_willamy';

  const { alerts, isDb } = await fetchUserAlertsFromDb(userId);
  return NextResponse.json({
    success: true,
    isDbSynced: isDb,
    userId,
    alerts,
  });
}

export async function POST(req: Request) {
  try {
    await initDbSchema();
    const body = await req.json();
    const { userId, name, searchQuery, frequency } = body;

    if (!userId || !name) {
      return NextResponse.json({ success: false, error: 'userId e name são obrigatórios' }, { status: 400 });
    }

    const alertToSave: UserAlertDB = {
      id: 'alt_' + Date.now(),
      user_id: userId,
      name,
      search_query: searchQuery || '',
      frequency: frequency || 'Diária por E-mail',
      created_at: new Date().toISOString(),
    };

    const { isDb } = await saveUserAlertToDb(alertToSave);
    return NextResponse.json({
      success: true,
      isDbSynced: isDb,
      alert: alertToSave,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
