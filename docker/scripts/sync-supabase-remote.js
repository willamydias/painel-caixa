const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const REGIONS = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'sa-east-1',
  'eu-west-1',
  'eu-central-1',
  'ap-southeast-1',
  'ap-northeast-1',
];

const PROJECT_REF = 'qrgkzvmxsrsdtrtqowep';
const PASS = 'L3il0jus_P4ssW0rd!2026';

async function findActivePoolerAndSync() {
  console.log('=======================================================');
  console.log(' SINCRONIZAÇÃO SUPABASE LOCAL ➔ SUPABASE CLOUD (REMOTO)');
  console.log('=======================================================');

  let activeClient = null;
  let successfulUrl = null;

  // Gerar lista de URLs para testar
  const candidateUrls = [];

  for (const region of REGIONS) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    candidateUrls.push({
      url: `postgresql://postgres.${PROJECT_REF}:${encodeURIComponent(PASS)}@${host}:6543/postgres`,
      desc: `${region} (Porta 6543 - Transaction Pooler)`,
    });
    candidateUrls.push({
      url: `postgresql://postgres.${PROJECT_REF}:${encodeURIComponent(PASS)}@${host}:5432/postgres`,
      desc: `${region} (Porta 5432 - Session Pooler)`,
    });
  }

  // Tentar também via REST API se tiver chave anon
  for (const item of candidateUrls) {
    console.log(`\n[Supabase Cloud Sync] Testando pooler região: ${item.desc}...`);
    const client = new Client({
      connectionString: item.url,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });

    try {
      await client.connect();
      activeClient = client;
      successfulUrl = item.url;
      console.log(`✅ [Sucesso] Conectado à região ${item.desc}!`);
      break;
    } catch (err) {
      console.warn(`  ↳ Falhou (${err.message})`);
      await client.end().catch(() => {});
    }
  }

  if (!activeClient) {
    console.error('\n❌ Nenhuma das regiões de pooler obteve sucesso na autenticação do tenant.');
    console.error('Por favor, verifique se a senha do banco de dados na nuvem corresponde a: L3il0jus_P4ssW0rd!2026');
    process.exit(1);
  }

  try {
    // 1. Aplicar o arquivo de schema DDL
    const schemaPath = path.resolve(__dirname, '../../painel-supabase/volumes/db/init/01-schema.sql');
    const fallbackSchemaPath = path.resolve(__dirname, '../../../painel-supabase/volumes/db/init/01-schema.sql');
    let targetSchemaPath = fs.existsSync(schemaPath) ? schemaPath : fallbackSchemaPath;

    if (!fs.existsSync(targetSchemaPath)) {
      throw new Error(`Arquivo de schema não encontrado em: ${targetSchemaPath}`);
    }

    console.log(`\n[Supabase Cloud Sync] Lendo schema DDL de: ${targetSchemaPath}`);
    const schemaSql = fs.readFileSync(targetSchemaPath, 'utf8');

    console.log('[Supabase Cloud Sync] Executando DDL de tabelas, extensões e índices...');
    await activeClient.query(schemaSql);
    console.log('[Supabase Cloud Sync] Schema DDL aplicado com sucesso!');

    // 2. Aplicar o arquivo de seed DML se existir
    const seedPath = path.resolve(__dirname, '../../painel-supabase/volumes/db/init/02-seed.sql');
    const fallbackSeedPath = path.resolve(__dirname, '../../../painel-supabase/volumes/db/init/02-seed.sql');
    let targetSeedPath = fs.existsSync(seedPath) ? seedPath : fallbackSeedPath;

    if (fs.existsSync(targetSeedPath)) {
      console.log(`[Supabase Cloud Sync] Lendo seed de: ${targetSeedPath}`);
      const seedSql = fs.readFileSync(targetSeedPath, 'utf8');
      await activeClient.query(seedSql);
      console.log('[Supabase Cloud Sync] Carga de dados (Seed) aplicada com sucesso!');
    }

    // 3. Contar tabelas sincronizadas no schema public
    const resTables = await activeClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log(`\n✅ [Sucesso] Sincronização concluída! Total de ${resTables.rows.length} tabelas ativas no Supabase Cloud:`);
    resTables.rows.forEach((r, i) => {
      console.log(`   ${i + 1}. public.${r.table_name}`);
    });

    console.log(`\n📌 URL de Conexão Funcional Secundária: ${successfulUrl}`);

  } catch (err) {
    console.error('\n❌ [Erro na Execução de Queries]', err.message);
    process.exit(1);
  } finally {
    await activeClient.end();
  }
}

findActivePoolerAndSync();
