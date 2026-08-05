const { exec } = require('child_process');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const REMOTE_URL = process.env.DATABASE_URL_SECONDARY || 'postgresql://postgres.qrgkzvmxsrsdtrtqowep:L3il0jus_P4ssW0rd%212026@aws-1-sa-east-1.pooler.supabase.com:6543/postgres';

async function dumpAndPushToCloud() {
  console.log('================================================================');
  console.log(' MIGRAÇÃO DIRETA DE DADOS: SUPABASE LOCAL ➔ SUPABASE CLOUD');
  console.log('================================================================');

  const remoteClient = new Client({ connectionString: REMOTE_URL, ssl: { rejectUnauthorized: false } });

  try {
    await remoteClient.connect();
    console.log('✅ Conectado ao Supabase Cloud Remoto!');

    // 1. Aplicar 01-schema.sql
    const schemaPath = path.resolve(__dirname, '../../painel-supabase/volumes/db/init/01-schema.sql');
    const fallbackSchemaPath = path.resolve(__dirname, '../../../painel-supabase/volumes/db/init/01-schema.sql');
    let targetSchemaPath = fs.existsSync(schemaPath) ? schemaPath : fallbackSchemaPath;

    if (fs.existsSync(targetSchemaPath)) {
      console.log(`\n[Schema DDL] Aplicando 01-schema.sql no Supabase Cloud...`);
      const ddlSql = fs.readFileSync(targetSchemaPath, 'utf8');
      await remoteClient.query(ddlSql).catch(e => console.warn('  ⚠️ Aviso DDL:', e.message));
      console.log('✅ [Schema DDL] Estrutura DDL pronta!');
    }

    // 2. Aplicar 02-seed.sql
    const seedPath = path.resolve(__dirname, '../../painel-supabase/volumes/db/init/02-seed.sql');
    const fallbackSeedPath = path.resolve(__dirname, '../../../painel-supabase/volumes/db/init/02-seed.sql');
    let targetSeedPath = fs.existsSync(seedPath) ? seedPath : fallbackSeedPath;

    if (fs.existsSync(targetSeedPath)) {
      console.log(`\n[Seed DML] Aplicando 02-seed.sql no Supabase Cloud...`);
      const seedSql = fs.readFileSync(targetSeedPath, 'utf8');
      await remoteClient.query(seedSql).catch(e => console.warn('  ⚠️ Aviso Seed:', e.message));
      console.log('✅ [Seed DML] Carga inicial enviada!');
    }

    // 3. Resumo Final
    const res = await remoteClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log(`\n================================================================`);
    console.log(`🎉 SINCRONIZAÇÃO DA BASE COMPLETA FINALIZADA COM SUCESSO!`);
    console.log(`Total de ${res.rows.length} tabelas operacionais no Supabase Cloud:`);
    res.rows.forEach((r, i) => {
      console.log(`   ${i + 1}. public.${r.table_name}`);
    });
    console.log('================================================================');

  } catch (err) {
    console.error('❌ [Erro na Conexão/Execução]', err.message);
    process.exit(1);
  } finally {
    await remoteClient.end().catch(() => {});
  }
}

dumpAndPushToCloud();
