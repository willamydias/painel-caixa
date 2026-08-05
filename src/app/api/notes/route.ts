import { NextResponse } from 'next/server';
import { initDbSchema, fetchUserNotesFromDb, saveUserNoteToDb, UserNoteDB } from '@/lib/db';

export async function GET(req: Request) {
  await initDbSchema();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || 'usr_willamy';

  const { notes, isDb } = await fetchUserNotesFromDb(userId);
  return NextResponse.json({
    success: true,
    isDbSynced: isDb,
    userId,
    notes,
  });
}

export async function POST(req: Request) {
  try {
    await initDbSchema();
    const body = await req.json();
    const { userId, propertyId, kanbanStatus, noteText, maxLance, tags } = body;

    if (!userId || !propertyId) {
      return NextResponse.json({ success: false, error: 'userId e propertyId são obrigatórios' }, { status: 400 });
    }

    const noteToSave: UserNoteDB = {
      user_id: userId,
      property_id: propertyId,
      kanban_status: kanbanStatus || 'Interessante',
      note_text: noteText || '',
      max_lance: maxLance ? Number(maxLance) : undefined,
      tags: Array.isArray(tags) ? tags : [],
      updated_at: new Date().toISOString(),
    };

    const { isDb } = await saveUserNoteToDb(noteToSave);
    return NextResponse.json({
      success: true,
      isDbSynced: isDb,
      note: noteToSave,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
