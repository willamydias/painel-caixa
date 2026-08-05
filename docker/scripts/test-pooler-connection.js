const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const RAW_PASS = 'L3il0jus_P4ssW0rd!2026';
const ENCODED_PASS = encodeURIComponent(RAW_PASS);
const REF = 'qrgkzvmxsrsdtrtqowep';

const hosts = [
  'aws-0-sa-east-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
];

const ports = [6543, 5432];

async function testSniAndOptions() {
  console.log('=======================================================');
  console.log(' TESTANDO SUPAVISOR COM SNI (db.qrgkzvmxsrsdtrtqowep.supabase.co)');
  console.log('=======================================================');

  for (const host of hosts) {
    for (const port of ports) {
      // Opção A: User postgres.qrgkzvmxsrsdtrtqowep com SNI
      const connStrA = `postgresql://postgres.${REF}:${ENCODED_PASS}@${host}:${port}/postgres`;
      console.log(`\nTestando [SNI]: postgres.${REF}@${host}:${port}`);

      const clientA = new Client({
        connectionString: connStrA,
        ssl: {
          rejectUnauthorized: false,
          servername: `db.${REF}.supabase.co`,
        },
        connectionTimeoutMillis: 5000,
      });

      try {
        await clientA.connect();
        console.log(`🎉 [SUCESSO COMPROVADO!] Conectado com SNI em: ${host}:${port}`);
        const res = await clientA.query('SELECT current_database(), current_user, version()');
        console.log('Info Postgres:', res.rows[0]);
        await runSyncQueries(clientA);
        await clientA.end();
        return;
      } catch (err) {
        console.warn(`  ↳ Falhou A: ${err.message}`);
        await clientA.end().catch(() => {});
      }

      // Opção B: User postgres com options=project=qrgkzvmxsrsdtrtqowep
      const connStrB = `postgresql://postgres:${ENCODED_PASS}@${host}:${port}/postgres?options=project%3D${REF}`;
      console.log(`Testando [Options]: postgres@${host}:${port}?options=project=${REF}`);

      const clientB = new Client({
        connectionString: connStrB,
        ssl: {
          rejectUnauthorized: false,
          servername: `db.${REF}.supabase.co`,
        },
        connectionTimeoutMillis: 5000,
      });

      try {
        await clientB.connect();
        console.log(`🎉 [SUCESSO COMPROVADO!] Conectado com Options em: ${host}:${port}`);
        const res = await clientB.query('SELECT current_database(), current_user, version()');
        console.log('Info Postgres:', res.rows[0]);
        await runSyncQueries(clientB);
        await clientB.end();
        return;
      } catch (err) {
        console.warn(`  ↳ Falhou B: ${err.message}`);
        await clientB.end().catch(() => {});
      }
    }
  }

  console.log('\n❌ Fim dos testes com SNI.');
}

async function runSyncQueries(client) {
  // Aplicar o arquivo de schema DDL
  const schemaPath = path.resolve(__dirname, '../../painel-supabase/volumes/db/init/01-schema.sql');
  const fallbackSchemaPath = path.resolve(__dirname, '../../../painel-supabase/volumes/db/init/01-schema.sql');
  let targetSchemaPath = fs.existsSync(schemaPath) ? schemaPath : fallbackSchemaPath;

  console.log(`\n[Supabase Cloud Sync] Lendo schema DDL de: ${targetSchemaPath}`);
  const schemaSql = fs.readFileSync(targetSchemaPath, 'utf8');

  console.log('[Supabase Cloud Sync] Aplicando DDL de tabelas, extensões e índices na nuvem...');
  await client.query(schemaSql);
  console.log('✅ [Sucesso] Schema DDL criado/atualizado com sucesso no Supabase Cloud!');

  // Aplicar o arquivo de seed DML se existir
  const seedPath = path.resolve(__dirname, '../../painel-supabase/volumes/db/init/02-seed.sql');
  const fallbackSeedPath = path.resolve(__dirname, '../../../painel-supabase/volumes/db/init/02-seed.sql');
  let targetSeedPath = fs.existsSync(seedPath) ? seedPath : fallbackSeedPath;

  if (fs.existsSync(targetSeedPath)) {
    console.log(`[Supabase Cloud Sync] Lendo seed DML de: ${targetSeedPath}`);
    const seedSql = fs.readFileSync(targetSeedPath, 'utf8');
    await client.query(seedSql);
    console.log('✅ [Sucesso] Carga inicial de dados (Seed) aplicada com sucesso!');
  }

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
}

testSniAndOptions();
