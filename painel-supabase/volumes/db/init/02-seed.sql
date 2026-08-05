-- ===================================================================
-- CARGA INICIAL DE SEED (ADMIN USER & DEFAULT PREFERENCES)
-- Executado automaticamente após a criação do schema no PostgreSQL
-- ===================================================================

-- Inserir perfil inicial do Administrador Master (Willamy Mamede)
INSERT INTO public.profiles (full_name, email, phone, role, status)
VALUES (
    'Willamy Mamede',
    'willamy.dias@gmail.com',
    '(61) 98156-2715',
    'admin',
    'active'
)
ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = 'admin',
    status = 'active',
    updated_at = CURRENT_TIMESTAMP;

-- Inserir preferências iniciais associadas ao usuário master
INSERT INTO public.user_preferences (
    user_id,
    theme,
    color_palette,
    min_preco,
    max_preco,
    aceita_fgts,
    aceita_financiamento,
    cidades_preferidas,
    modalidades_preferidas,
    notificacao_email,
    notificacao_whatsapp
)
SELECT
    id,
    'light',
    'citrico',
    50000,
    800000,
    true,
    true,
    '["Todas"]'::jsonb,
    '["Todas"]'::jsonb,
    true,
    false
FROM public.profiles
WHERE email = 'willamy.dias@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
    theme = 'light',
    color_palette = 'citrico',
    updated_at = CURRENT_TIMESTAMP;
