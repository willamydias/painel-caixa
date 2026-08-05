CREATE SCHEMA IF NOT EXISTS graphql_public;
GRANT ALL ON SCHEMA graphql_public TO postgres, supabase_admin, anon, authenticated, service_role;
