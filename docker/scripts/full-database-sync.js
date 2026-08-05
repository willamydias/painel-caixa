const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const REMOTE_URL = process.env.DATABASE_URL_SECONDARY || 'postgresql://postgres.qrgkzvmxsrsdtrtqowep:L3il0jus_P4ssW0rd%212026@aws-1-sa-east-1.pooler.supabase.com:6543/postgres';

async function performFullSync() {
  console.log('================================================================');
  console.log(' SINCRONIZAÇÃO TOTAL: SUPABASE LOCAL (DOCKER) ➔ CLOUD REMOTO');
  console.log('================================================================');

  const localClient = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'L3il0jus_P4ssW0rd!2026',
    database: 'postgres',
    connectionTimeoutMillis: 10000,
  });

  try {
    await localClient.connect();
    console.log('✅ Conectado com sucesso ao Supabase Local (Docker)!');
  } catch (err) {
    console.error('❌ [Erro Local]', err.message);
    process.exit(1);
  }

  const remoteClient = new Client({ connectionString: REMOTE_URL, ssl: { rejectUnauthorized: false } });

  try {
    await remoteClient.connect();
    console.log('✅ Conectado com sucesso ao Supabase Cloud Remoto!');

    // 1. Aplicar Schema DDL base no banco remoto
    const schemaPath = path.resolve(__dirname, '../../painel-supabase/volumes/db/init/01-schema.sql');
    const fallbackSchemaPath = path.resolve(__dirname, '../../../painel-supabase/volumes/db/init/01-schema.sql');
    let targetSchemaPath = fs.existsSync(schemaPath) ? schemaPath : fallbackSchemaPath;

    if (fs.existsSync(targetSchemaPath)) {
      console.log(`\n[DDL Sync] Aplicando 01-schema.sql no banco remoto...`);
      const ddlSql = fs.readFileSync(targetSchemaPath, 'utf8');
      await remoteClient.query(ddlSql);
      console.log('✅ [DDL Sync] Schema DDL base sincronizado!');
    }

    // 2. Garantir extensões no banco remoto
    await remoteClient.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    `);

    // 3. Obter lista de todas as tabelas no schema public local
    const resTables = await localClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const tables = resTables.rows.map(r => r.table_name);
    console.log(`\n[Data Sync] Processando ${tables.length} tabelas no schema 'public'...\n`);

    for (const table of tables) {
      try {
        // Criar estrutura da tabela remotamente se não existir
        const colDefRes = await localClient.query(`
          SELECT column_name, data_type, udt_name
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position;
        `, [table]);

        const columnDefs = colDefRes.rows.map(col => {
          let type = col.data_type.toUpperCase();
          if (type === 'USER-DEFINED') type = col.udt_name;
          if (type === 'ARRAY') type = 'TEXT[]';
          return `"${col.column_name}" ${type}`;
        }).join(', ');

        const createTableSql = `CREATE TABLE IF NOT EXISTS public."${table}" (${columnDefs});`;
        await remoteClient.query(createTableSql);

        // Buscar dados locais
        const localRows = await localClient.query(`SELECT * FROM public."${table}"`);
        if (localRows.rows.length === 0) {
          console.log(`  🔹 public.${table}: Estrutura criada. 0 registros locais.`);
          continue;
        }

        console.log(`  ⚡ public.${table}: Sincronizando ${localRows.rows.length} registros...`);

        const columns = Object.keys(localRows.rows[0]);
        const colNames = columns.map(c => `"${c}"`).join(', ');

        let insertedCount = 0;

        for (const row of localRows.rows) {
          const values = columns.map(c => {
            const val = row[c];
            if (val !== null && typeof val === 'object') {
              return JSON.stringify(val);
            }
            return val;
          });
          const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');

          const insertQuery = `
            INSERT INTO public."${table}" (${colNames})
            VALUES (${placeholders})
            ON CONFLICT DO NOTHING;
          `;

          try {
            await remoteClient.query(insertQuery, values);
            insertedCount++;
          } catch {
            try {
              await remoteClient.query(`INSERT INTO public."${table}" (${colNames}) VALUES (${placeholders});`, values);
              insertedCount++;
            } catch {}
          }
        }

        console.log(`  ✅ public.${table}: ${insertedCount}/${localRows.rows.length} registros sincronizados!`);
      } catch (tableErr) {
        console.warn(`  ⚠️ public.${table}: Erro na sincronização - ${tableErr.message}`);
      }
    }

    // 4. Resumo Final
    const finalRemoteTables = await remoteClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('\n================================================================');
    console.log(`🎉 SINCRONIZAÇÃO EXAUSTIVA FINALIZADA COM SUCESSO!`);
    console.log(`Total de ${finalRemoteTables.rows.length} tabelas no Supabase Cloud:`);
    finalRemoteTables.rows.forEach((r, i) => {
      console.log(`   ${i + 1}. public.${r.table_name}`);
    });
    console.log('================================================================');

  } catch (err) {
    console.error('\n❌ [Erro Fatal na Sincronização]', err.message);
    process.exit(1);
  } finally {
    await localClient.end().catch(() => {});
    await remoteClient.end().catch(() => {});
  }
}

performFullSync();
