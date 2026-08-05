const { Client } = require('pg');

const LOCAL_DB_URL = 'postgresql://postgres:L3il0jus_P4ssW0rd!2026@127.0.0.1:5432/postgres';

async function checkLocalDatabase() {
  console.log('Verificando integridade das tabelas no Supabase Local (Docker)...');
  const client = new Client({ connectionString: LOCAL_DB_URL });

  try {
    await client.connect();
    console.log('✅ Conectado com sucesso ao Supabase Local!');

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log(`\nTotal de ${res.rows.length} tabelas no schema 'public' local:`);
    res.rows.forEach((r, i) => {
      console.log(`   ${i + 1}. public.${r.table_name}`);
    });

  } catch (err) {
    console.error('❌ Erro no Supabase Local:', err.message);
  } finally {
    await client.end();
  }
}

checkLocalDatabase();
