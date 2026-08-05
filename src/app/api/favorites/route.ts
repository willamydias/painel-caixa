import { NextResponse } from 'next/server';
import { initDbSchema, fetchUserFavoritesFromDb, toggleUserFavoriteInDb } from '@/lib/db';

export async function GET(req: Request) {
  await initDbSchema();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || 'usr_willamy';

  const { favorites, isDb } = await fetchUserFavoritesFromDb(userId);
  return NextResponse.json({
    success: true,
    isDbSynced: isDb,
    userId,
    favorites,
  });
}

export async function POST(req: Request) {
  try {
    await initDbSchema();
    const body = await req.json();
    const { userId, propertyId } = body;

    if (!userId || !propertyId) {
      return NextResponse.json({ success: false, error: 'userId e propertyId são obrigatórios' }, { status: 400 });
    }

    const { favorites, isDb } = await toggleUserFavoriteInDb(userId, propertyId);
    return NextResponse.json({
      success: true,
      isDbSynced: isDb,
      userId,
      favorites,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
