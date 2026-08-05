CREATE TABLE IF NOT EXISTS public.imoveis_caixa (
    id VARCHAR(64) PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
GRANT ALL ON TABLE public.imoveis_caixa TO postgres, supabase_admin, anon, authenticated, service_role;
