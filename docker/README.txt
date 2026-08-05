# Docker Compose Server - Painel CAIXA & Painel Supabase Integration

> Ambiente containerizado de alto desempenho para o Painel de Oportunidades CAIXA conectado ao serviço `painel-supabase` local ou em nuvem AWS.

---

## 🚀 Como Executar

### 1. Iniciar o Serviço de Banco Supabase
No diretório `c:\Projetos_Leilão_Raspagem\painel-supabase`:
```cmd
scripts\setup.bat
```

### 2. Iniciar o Painel via Docker Compose
No diretório `c:\Projetos_Leilão_Raspagem\docker`:
```bash
docker compose up -d --build
```

### 3. Verificar Status e Saúde do Contêiner
```bash
docker compose ps
docker compose logs -f painel-imobiliario
```

---

## 🔌 Configuração do Banco Supabase (`painel-supabase`)

O contêiner se conecta ao banco PostgreSQL do Supabase rodando em `c:\Projetos_Leilão_Raspagem\painel-supabase`:

- **Postgres Host (Interno Docker):** `painel-supabase-db`
- **Postgres Port:** `5432`
- **User / DB:** `postgres`
- **Tabela Mestre:** `public.imoveis_caixa`
- **Tabelas de Usuário:** `profiles`, `user_preferences`, `user_favorites`, `user_kanban`, `user_alerts`, `api_keys`

---

## 🌐 URLs de Acesso

- **Painel CAIXA Web:** [http://localhost:3050](http://localhost:3050)
- **Supabase Studio UI:** [http://localhost:54323](http://localhost:54323)
- **PostgREST API REST:** [http://localhost:3000](http://localhost:3000)
