DROP FUNCTION IF EXISTS auth.uid(); 
DROP FUNCTION IF EXISTS auth.role();
ALTER SCHEMA auth OWNER TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
