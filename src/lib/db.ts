import { Pool } from 'pg';

const DEFAULT_DB_URL = process.env.DATABASE_URL || 'postgresql://postgres:L3il0jus_P4ssW0rd!2026@localhost:5432/postgres';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: DEFAULT_DB_URL,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000,
    });
  }
  return pool;
}

// In-Memory & File Fallback Store (para desenvolvimento quando PostgreSQL não estiver rodando)
export interface UserProfileDB {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'admin' | 'investor' | 'analyst';
  avatar_url?: string;
  created_at: string;
}

export interface UserSettingsDB {
  user_id: string;
  theme: 'light' | 'dark';
  color_palette: string;
  min_preco: number;
  max_preco: number;
  aceita_fgts: boolean;
  aceita_financiamento: boolean;
  updated_at: string;
}

export interface UserFavoriteDB {
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface UserNoteDB {
  user_id: string;
  property_id: string;
  kanban_status: 'Interessante' | 'Em Análise' | 'Lance Agendado' | 'Descartado';
  note_text: string;
  max_lance?: number;
  tags?: string[];
  updated_at: string;
}

export interface UserAlertDB {
  id: string;
  user_id: string;
  name: string;
  search_query: string;
  frequency: string;
  created_at: string;
}

// Memory cache fallback
const fallbackUsers: UserProfileDB[] = [
  {
    id: 'usr_willamy',
    full_name: 'Willamy Mamede',
    email: 'willamy.dias@gmail.com',
    phone: '(61) 98156-2715',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    created_at: new Date().toISOString(),
  },
  {
    id: 'usr_wagner',
    full_name: 'Wagner Junior',
    email: 'wagner.investor@gmail.com',
    phone: '(61) 99234-5678',
    role: 'investor',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    created_at: new Date().toISOString(),
  },
  {
    id: 'usr_ana',
    full_name: 'Dra. Ana Paula',
    email: 'ana.juridico@gmail.com',
    phone: '(61) 98877-6655',
    role: 'analyst',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    created_at: new Date().toISOString(),
  },
];

const fallbackSettings: Record<string, UserSettingsDB> = {
  usr_willamy: {
    user_id: 'usr_willamy',
    theme: 'light',
    color_palette: 'citrico',
    min_preco: 50000,
    max_preco: 800000,
    aceita_fgts: true,
    aceita_financiamento: true,
    updated_at: new Date().toISOString(),
  },
  usr_wagner: {
    user_id: 'usr_wagner',
    theme: 'dark',
    color_palette: 'minimal',
    min_preco: 100000,
    max_preco: 1200000,
    aceita_fgts: false,
    aceita_financiamento: true,
    updated_at: new Date().toISOString(),
  },
  usr_ana: {
    user_id: 'usr_ana',
    theme: 'light',
    color_palette: 'oceano',
    min_preco: 30000,
    max_preco: 500000,
    aceita_fgts: true,
    aceita_financiamento: false,
    updated_at: new Date().toISOString(),
  },
};

const fallbackFavorites: Record<string, string[]> = {
  usr_willamy: ['8444405786638', '1444409395213'],
  usr_wagner: ['8444400262102', '1444403612034'],
  usr_ana: ['1444409395213'],
};

const fallbackNotes: Record<string, Record<string, UserNoteDB>> = {
  usr_willamy: {
    '8444405786638': {
      user_id: 'usr_willamy',
      property_id: '8444405786638',
      kanban_status: 'Lance Agendado',
      note_text: 'Excelente localização em Taguatinga Norte. Deságio de 45% com certidão IPTU OK.',
      max_lance: 195000,
      tags: ['Alta Margem', 'Reformar'],
      updated_at: new Date().toISOString(),
    },
  },
};

const fallbackAlertas: Record<string, UserAlertDB[]> = {
  usr_willamy: [
    {
      id: 'alt_1',
      user_id: 'usr_willamy',
      name: 'Casas DF até 350k',
      search_query: 'cidadeSatelite=Taguatinga&maxPrecoNum=350000',
      frequency: 'Diária por E-mail',
      created_at: new Date().toISOString(),
    },
  ],
};

let dbInitialized = false;

export async function initDbSchema(): Promise<boolean> {
  if (dbInitialized) return true;
  try {
    const p = getDbPool();
    const client = await p.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.user_profiles (
          id VARCHAR(64) PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(64),
          role VARCHAR(32) DEFAULT 'investor',
          avatar_url TEXT,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS public.user_settings (
          user_id VARCHAR(64) PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
          theme VARCHAR(16) DEFAULT 'light',
          color_palette VARCHAR(32) DEFAULT 'citrico',
          min_preco NUMERIC DEFAULT 50000,
          max_preco NUMERIC DEFAULT 800000,
          aceita_fgts BOOLEAN DEFAULT true,
          aceita_financiamento BOOLEAN DEFAULT true,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS public.user_favorites (
          user_id VARCHAR(64) REFERENCES public.user_profiles(id) ON DELETE CASCADE,
          property_id VARCHAR(64) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, property_id)
        );

        CREATE TABLE IF NOT EXISTS public.user_notes (
          user_id VARCHAR(64) REFERENCES public.user_profiles(id) ON DELETE CASCADE,
          property_id VARCHAR(64) NOT NULL,
          kanban_status VARCHAR(32) DEFAULT 'Interessante',
          note_text TEXT,
          max_lance NUMERIC,
          tags JSONB DEFAULT '[]'::jsonb,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, property_id)
        );

        CREATE TABLE IF NOT EXISTS public.user_alerts (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) REFERENCES public.user_profiles(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          search_query TEXT,
          frequency VARCHAR(64) DEFAULT 'Diária',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Popular usuários padrões se tabela estiver vazia
      const countRes = await client.query('SELECT COUNT(*) FROM public.user_profiles');
      if (parseInt(countRes.rows[0].count, 10) === 0) {
        for (const u of fallbackUsers) {
          await client.query(
            `INSERT INTO public.user_profiles (id, full_name, email, phone, role, avatar_url, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
            [u.id, u.full_name, u.email, u.phone, u.role, u.avatar_url, u.created_at]
          );
          const st = fallbackSettings[u.id];
          if (st) {
            await client.query(
              `INSERT INTO public.user_settings (user_id, theme, color_palette, min_preco, max_preco, aceita_fgts, aceita_financiamento, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (user_id) DO NOTHING`,
              [st.user_id, st.theme, st.color_palette, st.min_preco, st.max_preco, st.aceita_fgts, st.aceita_financiamento, st.updated_at]
            );
          }
        }
      }
      dbInitialized = true;
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('[PostgreSQL DB Init Warning] PostgreSQL não disponível localmente. Utilizando in-memory store:', (err as Error).message);
    return false;
  }
}

// Helpers para Operações no Banco com Fallback Silencioso

export async function fetchUsersFromDb(): Promise<{ users: UserProfileDB[]; isDb: boolean }> {
  try {
    const p = getDbPool();
    const res = await p.query('SELECT * FROM public.user_profiles ORDER BY created_at ASC');
    if (res.rows.length > 0) {
      return { users: res.rows, isDb: true };
    }
  } catch {
    // DB error/offline -> Fallback
  }
  return { users: fallbackUsers, isDb: false };
}

export async function fetchUserSettingsFromDb(userId: string): Promise<{ settings: UserSettingsDB; isDb: boolean }> {
  try {
    const p = getDbPool();
    const res = await p.query('SELECT * FROM public.user_settings WHERE user_id = $1', [userId]);
    if (res.rows.length > 0) {
      const row = res.rows[0];
      return {
        settings: {
          user_id: row.user_id,
          theme: row.theme,
          color_palette: row.color_palette,
          min_preco: Number(row.min_preco),
          max_preco: Number(row.max_preco),
          aceita_fgts: Boolean(row.aceita_fgts),
          aceita_financiamento: Boolean(row.aceita_financiamento),
          updated_at: row.updated_at,
        },
        isDb: true,
      };
    }
  } catch {
    // Fallback
  }

  const fallback = fallbackSettings[userId] || {
    user_id: userId,
    theme: 'light',
    color_palette: 'citrico',
    min_preco: 50000,
    max_preco: 800000,
    aceita_fgts: true,
    aceita_financiamento: true,
    updated_at: new Date().toISOString(),
  };
  return { settings: fallback, isDb: false };
}

export async function saveUserSettingsToDb(settings: UserSettingsDB): Promise<boolean> {
  // Atualizar memória sempre
  fallbackSettings[settings.user_id] = { ...settings };
  try {
    const p = getDbPool();
    await p.query(
      `INSERT INTO public.user_settings (user_id, theme, color_palette, min_preco, max_preco, aceita_fgts, aceita_financiamento, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         theme = EXCLUDED.theme,
         color_palette = EXCLUDED.color_palette,
         min_preco = EXCLUDED.min_preco,
         max_preco = EXCLUDED.max_preco,
         aceita_fgts = EXCLUDED.aceita_fgts,
         aceita_financiamento = EXCLUDED.aceita_financiamento,
         updated_at = NOW()`,
      [
        settings.user_id,
        settings.theme,
        settings.color_palette,
        settings.min_preco,
        settings.max_preco,
        settings.aceita_fgts,
        settings.aceita_financiamento,
      ]
    );
    return true;
  } catch (err) {
    console.warn('[DB Save Warning] Gravado em fallback de memória:', (err as Error).message);
    return false;
  }
}

export async function fetchUserFavoritesFromDb(userId: string): Promise<{ favorites: string[]; isDb: boolean }> {
  try {
    const p = getDbPool();
    const res = await p.query('SELECT property_id FROM public.user_favorites WHERE user_id = $1', [userId]);
    const favs = res.rows.map((r) => r.property_id);
    return { favorites: favs, isDb: true };
  } catch {
    // Fallback
  }
  return { favorites: fallbackFavorites[userId] || [], isDb: false };
}

export async function toggleUserFavoriteInDb(userId: string, propertyId: string): Promise<{ favorites: string[]; isDb: boolean }> {
  let current = fallbackFavorites[userId] || [];
  if (current.includes(propertyId)) {
    current = current.filter((id) => id !== propertyId);
  } else {
    current = [...current, propertyId];
  }
  fallbackFavorites[userId] = current;

  try {
    const p = getDbPool();
    const check = await p.query('SELECT 1 FROM public.user_favorites WHERE user_id = $1 AND property_id = $2', [userId, propertyId]);
    if (check.rows.length > 0) {
      await p.query('DELETE FROM public.user_favorites WHERE user_id = $1 AND property_id = $2', [userId, propertyId]);
    } else {
      await p.query('INSERT INTO public.user_favorites (user_id, property_id) VALUES ($1, $2)', [userId, propertyId]);
    }
    const res = await p.query('SELECT property_id FROM public.user_favorites WHERE user_id = $1', [userId]);
    return { favorites: res.rows.map((r) => r.property_id), isDb: true };
  } catch {
    // Fallback
  }
  return { favorites: current, isDb: false };
}

export async function fetchUserNotesFromDb(userId: string): Promise<{ notes: Record<string, UserNoteDB>; isDb: boolean }> {
  try {
    const p = getDbPool();
    const res = await p.query('SELECT * FROM public.user_notes WHERE user_id = $1', [userId]);
    const map: Record<string, UserNoteDB> = {};
    for (const r of res.rows) {
      map[r.property_id] = {
        user_id: r.user_id,
        property_id: r.property_id,
        kanban_status: r.kanban_status,
        note_text: r.note_text,
        max_lance: r.max_lance ? Number(r.max_lance) : undefined,
        tags: r.tags || [],
        updated_at: r.updated_at,
      };
    }
    return { notes: map, isDb: true };
  } catch {
    // Fallback
  }
  return { notes: fallbackNotes[userId] || {}, isDb: false };
}

export async function saveUserNoteToDb(note: UserNoteDB): Promise<{ isDb: boolean }> {
  if (!fallbackNotes[note.user_id]) {
    fallbackNotes[note.user_id] = {};
  }
  fallbackNotes[note.user_id][note.property_id] = { ...note };

  try {
    const p = getDbPool();
    await p.query(
      `INSERT INTO public.user_notes (user_id, property_id, kanban_status, note_text, max_lance, tags, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (user_id, property_id) DO UPDATE SET
         kanban_status = EXCLUDED.kanban_status,
         note_text = EXCLUDED.note_text,
         max_lance = EXCLUDED.max_lance,
         tags = EXCLUDED.tags,
         updated_at = NOW()`,
      [note.user_id, note.property_id, note.kanban_status, note.note_text, note.max_lance || null, JSON.stringify(note.tags || [])]
    );
    return { isDb: true };
  } catch {
    // Fallback
  }
  return { isDb: false };
}

export async function fetchUserAlertsFromDb(userId: string): Promise<{ alerts: UserAlertDB[]; isDb: boolean }> {
  try {
    const p = getDbPool();
    const res = await p.query('SELECT * FROM public.user_alerts WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return { alerts: res.rows, isDb: true };
  } catch {
    // Fallback
  }
  return { alerts: fallbackAlertas[userId] || [], isDb: false };
}

export async function saveUserAlertToDb(alert: UserAlertDB): Promise<{ isDb: boolean }> {
  if (!fallbackAlertas[alert.user_id]) {
    fallbackAlertas[alert.user_id] = [];
  }
  fallbackAlertas[alert.user_id].unshift(alert);

  try {
    const p = getDbPool();
    await p.query(
      `INSERT INTO public.user_alerts (id, user_id, name, search_query, frequency, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [alert.id, alert.user_id, alert.name, alert.search_query, alert.frequency]
    );
    return { isDb: true };
  } catch {
    // Fallback
  }
  return { isDb: false };
}
