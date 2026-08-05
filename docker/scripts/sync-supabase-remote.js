const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const RAW_PASS = 'L3il0jus_P4ssW0rd!2026';
const ENCODED_PASS = encodeURIComponent(RAW_PASS); // L3il0jus_P4ssW0rd%212026
const REF = 'qrgkzvmxsrsdtrtqowep';

// Exact Pooler Connection String da Nuvem Supabase
const POOLED_REMOTE_URL = process.env.DATABASE_URL_SECONDARY || `postgresql://postgres.${REF}:${ENCODED_PASS}@aws-1-sa-east-1.pooler.supabase.com:6543/postgres`;

async function syncRemoteDatabase() {
  console.log('=======================================================');
  console.log(' SINCRONIZAÇÃO SUPABASE LOCAL ➔ SUPABASE CLOUD (REMOTO)');
  console.log('=======================================================');
  console.log('[Supabase Cloud Sync] Host:', 'aws-1-sa-east-1.pooler.supabase.com:6543');
  console.log('[Supabase Cloud Sync] User:', `postgres.${REF}`);

  const client = new Client({
    connectionString: POOLED_REMOTE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('\n✅ [Sucesso Absoluto] Conexão SSL estabelecida com o Supabase Cloud!');

    // 1. Aplicar o arquivo de schema DDL
    const schemaPath = path.resolve(__dirname, '../../painel-supabase/volumes/db/init/01-schema.sql');
    const fallbackSchemaPath = path.resolve(__dirname, '../../../painel-supabase/volumes/db/init/01-schema.sql');
    let targetSchemaPath = fs.existsSync(schemaPath) ? schemaPath : fallbackSchemaPath;

    if (!fs.existsSync(targetSchemaPath)) {
      throw new Error(`Arquivo de schema não encontrado em: ${targetSchemaPath}`);
    }

    console.log(`\n[Supabase Cloud Sync] Lendo schema DDL de: ${targetSchemaPath}`);
    const schemaSql = fs.readFileSync(targetSchemaPath, 'utf8');

    console.log('[Supabase Cloud Sync] Aplicando DDL de tabelas, extensões e índices...');
    await client.query(schemaSql);
    console.log('✅ [Sucesso] Schema DDL criado/atualizado com sucesso no Supabase Cloud!');

    // 2. Aplicar o arquivo de seed DML se existir
    const seedPath = path.resolve(__dirname, '../../painel-supabase/volumes/db/init/02-seed.sql');
    const fallbackSeedPath = path.resolve(__dirname, '../../../painel-supabase/volumes/db/init/02-seed.sql');
    let targetSeedPath = fs.existsSync(seedPath) ? seedPath : fallbackSeedPath;

    if (fs.existsSync(targetSeedPath)) {
      console.log(`[Supabase Cloud Sync] Lendo seed DML de: ${targetSeedPath}`);
      const seedSql = fs.readFileSync(targetSeedPath, 'utf8');
      await client.query(seedSql);
      console.log('✅ [Sucesso] Carga inicial de dados (Seed) aplicada com sucesso!');
    }

    // 3. Contar tabelas sincronizadas no schema public
    const resTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log(`\n🎉 [Sincronização Finalizada!] Total de ${resTables.rows.length} tabelas no Supabase Cloud:`);
    resTables.rows.forEach((r, i) => {
      console.log(`   ${i + 1}. public.${r.table_name}`);
    });

  } catch (err) {
    console.error('\n❌ [Erro na Execução de Queries]', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

syncRemoteDatabase();
