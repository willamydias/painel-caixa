-- Create reserved Supabase roles and users
CREATE ROLE anon NOLOGIN NOINHERIT;
CREATE ROLE authenticated NOLOGIN NOINHERIT;
CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'supabase_admin') THEN
        CREATE ROLE supabase_admin LOGIN SUPERUSER PASSWORD 'L3il0jus_P4ssW0rd!2026';
    ELSE
        ALTER ROLE supabase_admin WITH PASSWORD 'L3il0jus_P4ssW0rd!2026';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'supabase_auth_admin') THEN
        CREATE ROLE supabase_auth_admin LOGIN CREATEROLE CREATEDB PASSWORD 'L3il0jus_P4ssW0rd!2026';
    ELSE
        ALTER ROLE supabase_auth_admin WITH PASSWORD 'L3il0jus_P4ssW0rd!2026';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'supabase_storage_admin') THEN
        CREATE ROLE supabase_storage_admin LOGIN CREATEDB PASSWORD 'L3il0jus_P4ssW0rd!2026';
    ELSE
        ALTER ROLE supabase_storage_admin WITH PASSWORD 'L3il0jus_P4ssW0rd!2026';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticator') THEN
        CREATE ROLE authenticator LOGIN PASSWORD 'L3il0jus_P4ssW0rd!2026';
    ELSE
        ALTER ROLE authenticator WITH PASSWORD 'L3il0jus_P4ssW0rd!2026';
    END IF;
END $$;

GRANT anon TO authenticator;
GRANT authenticated TO authenticator;
GRANT service_role TO authenticator;

CREATE SCHEMA IF NOT EXISTS auth AUTHORIZATION supabase_auth_admin;
CREATE SCHEMA IF NOT EXISTS extensions AUTHORIZATION postgres;
CREATE SCHEMA IF NOT EXISTS storage AUTHORIZATION supabase_storage_admin;
CREATE SCHEMA IF NOT EXISTS _supabase AUTHORIZATION postgres;
CREATE SCHEMA IF NOT EXISTS _analytics AUTHORIZATION postgres;
CREATE SCHEMA IF NOT EXISTS _supavisor AUTHORIZATION postgres;
CREATE SCHEMA IF NOT EXISTS _realtime AUTHORIZATION postgres;
CREATE SCHEMA IF NOT EXISTS _webhooks AUTHORIZATION postgres;

ALTER SCHEMA auth OWNER TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid WHERE pg_namespace.nspname = 'auth' AND proname = 'uid') THEN
        ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_proc JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid WHERE pg_namespace.nspname = 'auth' AND proname = 'role') THEN
        ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;
    END IF;
END $$;

GRANT ALL ON SCHEMA extensions TO postgres, supabase_admin, supabase_auth_admin, service_role;
GRANT ALL ON SCHEMA public TO postgres, supabase_admin, supabase_auth_admin, anon, authenticated, service_role;
GRANT ALL ON SCHEMA storage TO postgres, supabase_admin, supabase_storage_admin, service_role;

ALTER DATABASE postgres SET "app.settings.jwt_secret" TO '894f9c39c4213f1661261156c24c31fc39bbf3322676bc91a93b9438894ab5d8';
ALTER DATABASE postgres SET "app.settings.jwt_exp" TO '3600';
