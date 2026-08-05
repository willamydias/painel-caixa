const { Client } = require('pg');

const PASS = 'L3il0jus_P4ssW0rd!2026';
const REF = 'qrgkzvmxsrsdtrtqowep';

const hosts = [
  'aws-0-sa-east-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
];

const users = [
  `postgres.${REF}`,
  `postgres`,
  `supabase_admin.${REF}`,
];

const ports = [6543, 5432];

async function testAllCombinations() {
  console.log('Testando combinações de host/usuario/porta para o Supabase Cloud...');

  for (const host of hosts) {
    for (const user of users) {
      for (const port of ports) {
        const connStr = `postgresql://${user}:${encodeURIComponent(PASS)}@${host}:${port}/postgres`;
        const client = new Client({
          connectionString: connStr,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 3000,
        });

        try {
          await client.connect();
          console.log(`\n🎉 [SUCESSO ENCONTRADO!]`);
          console.log(`Host: ${host}:${port}`);
          console.log(`User: ${user}`);
          console.log(`ConnectionString: postgresql://${user}:****@${host}:${port}/postgres\n`);

          const res = await client.query('SELECT current_database(), current_user, version()');
          console.log('Versão do Postgres Remoto:', res.rows[0]);
          await client.end();
          return connStr;
        } catch (err) {
          // apenas prosseguir
        }
      }
    }
  }

  console.log('\n❌ Nenhuma das combinações padrão de pooler conectou com a senha fornecida.');
}

testAllCombinations();
