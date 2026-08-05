-- ===================================================================
-- SCHEMA INICIAL DO BANCO DE DADOS POSTGRESQL / SUPABASE (PAINEL CAIXA)
-- Executado automaticamente no primeiro boot do contêiner PostgreSQL
-- ===================================================================

-- Extensions necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. TABELA MESTRE DE ATIVOS (IMOVEIS CAIXA)
CREATE TABLE IF NOT EXISTS public.imoveis_caixa (
    id VARCHAR(64) PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Índices de alta performance para a tabela imoveis_caixa
CREATE INDEX IF NOT EXISTS idx_imoveis_caixa_jsonb ON public.imoveis_caixa USING gin (data jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_imoveis_caixa_uf ON public.imoveis_caixa ((data->>'uf'));
CREATE INDEX IF NOT EXISTS idx_imoveis_caixa_cidade ON public.imoveis_caixa ((data->>'cidade'));
CREATE INDEX IF NOT EXISTS idx_imoveis_caixa_modalidade ON public.imoveis_caixa ((data->>'modalidade'));

-- 2. TABELA DE PERFIS DE USUÁRIOS (PROFILES)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'investor_pro' CHECK (role IN ('admin', 'analyst', 'investor_pro', 'investor_free')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. TABELA DE PREFERÊNCIAS E APARÊNCIA (USER_PREFERENCES)
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    color_palette TEXT NOT NULL DEFAULT 'citrico',
    min_preco NUMERIC DEFAULT 50000,
    max_preco NUMERIC DEFAULT 800000,
    aceita_fgts BOOLEAN DEFAULT TRUE,
    aceita_financiamento BOOLEAN DEFAULT TRUE,
    cidades_preferidas JSONB DEFAULT '["Todas"]'::jsonb,
    modalidades_preferidas JSONB DEFAULT '["Todas"]'::jsonb,
    notificacao_email BOOLEAN DEFAULT TRUE,
    notificacao_whatsapp BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE FAVORITOS (USER_FAVORITES)
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id TEXT NOT NULL,
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_prop ON public.user_favorites(user_id, property_id);

-- 5. TABELA DE KANBAN / GESTÃO DE OPORTUNIDADES (USER_KANBAN)
CREATE TABLE IF NOT EXISTS public.user_kanban (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'prospeccao' CHECK (stage IN ('prospeccao', 'analise_juridica', 'vistoria', 'lance_enviado', 'arrematado', 'descartado')),
    notes TEXT,
    rating INT DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_user_kanban_user_stage ON public.user_kanban(user_id, stage);

-- 6. TABELA DE ALERTAS E BUSCAS SALVAS (USER_ALERTS)
CREATE TABLE IF NOT EXISTS public.user_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    alert_name TEXT NOT NULL,
    filter_conditions JSONB NOT NULL,
    channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'whatsapp', 'telegram')),
    frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('realtime', 'daily', 'weekly')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABELA DE CHAVES DE API (API_KEYS)
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    key_name TEXT NOT NULL,
    api_key_hash TEXT NOT NULL,
    scopes TEXT[] DEFAULT ARRAY['read_properties'],
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Funções utilitárias de atualização de timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_imoveis_caixa_updated_at
    BEFORE UPDATE ON public.imoveis_caixa
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
