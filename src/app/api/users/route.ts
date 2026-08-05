import { NextResponse } from 'next/server';
import { initDbSchema, fetchUsersFromDb, getDbPool } from '@/lib/db';

export async function GET() {
  await initDbSchema();
  const { users, isDb } = await fetchUsersFromDb();
  return NextResponse.json({
    success: true,
    isDbSynced: isDb,
    users,
  });
}

export async function POST(req: Request) {
  try {
    await initDbSchema();
    const body = await req.json();
    const { id, full_name, email, phone, role, avatar_url } = body;

    if (!id || !full_name || !email) {
      return NextResponse.json({ success: false, error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    try {
      const p = getDbPool();
      await p.query(
        `INSERT INTO public.user_profiles (id, full_name, email, phone, role, avatar_url, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (id) DO UPDATE SET
           full_name = EXCLUDED.full_name,
           email = EXCLUDED.email,
           phone = EXCLUDED.phone,
           role = EXCLUDED.role,
           avatar_url = EXCLUDED.avatar_url`,
        [id, full_name, email, phone || '', role || 'investor', avatar_url || '']
      );

      // Inicializar configurações padrão para novo usuário se não existirem
      await p.query(
        `INSERT INTO public.user_settings (user_id, theme, color_palette, min_preco, max_preco, aceita_fgts, aceita_financiamento, updated_at)
         VALUES ($1, 'light', 'citrico', 50000, 800000, true, true, NOW())
         ON CONFLICT (user_id) DO NOTHING`,
        [id]
      );
      return NextResponse.json({ success: true, isDbSynced: true, user: body });
    } catch (err: any) {
      return NextResponse.json({ success: true, isDbSynced: false, user: body, message: 'Gravado em fallback local' });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
