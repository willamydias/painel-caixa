import { NextResponse } from 'next/server';
import { initDbSchema, fetchUserSettingsFromDb, saveUserSettingsToDb } from '@/lib/db';

export async function GET(req: Request) {
  await initDbSchema();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || 'usr_willamy';

  const { settings, isDb } = await fetchUserSettingsFromDb(userId);
  return NextResponse.json({
    status: 'online',
    isDbSynced: isDb,
    user_id: userId,
    preferences: settings,
  });
}

export async function POST(req: Request) {
  try {
    await initDbSchema();
    const body = await req.json();
    const userId = body.user_id || body.userId || 'usr_willamy';

    const settingsToSave = {
      user_id: userId,
      theme: body.theme || 'light',
      color_palette: body.colorPalette || body.color_palette || 'citrico',
      min_preco: Number(body.minPreco ?? body.min_preco ?? 50000),
      max_preco: Number(body.maxPreco ?? body.max_preco ?? 800000),
      aceita_fgts: Boolean(body.aceitaFGTS ?? body.aceita_fgts ?? true),
      aceita_financiamento: Boolean(body.aceitaFinanciamento ?? body.aceita_financiamento ?? true),
      updated_at: new Date().toISOString(),
    };

    const isDbSynced = await saveUserSettingsToDb(settingsToSave);
    return NextResponse.json({ success: true, isDbSynced, preferences: settingsToSave });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
