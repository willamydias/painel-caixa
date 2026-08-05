# 🗄️ Painel Supabase — Repositório de Dados & Infraestrutura Containerizada

> Infraestrutura autocontida, resiliente, segura e de alto desempenho baseada em **Supabase Self-Hosted / PostgreSQL 17** para o ecossistema do **Painel de Oportunidades CAIXA**.

---

## 📌 Visão Geral da Arquitetura

O serviço `painel-supabase` centraliza a persistência de dados de imóveis, perfis de usuários, preferências, favoritos, kanban de arrematações e alertas em uma stack containerizada robusta com API Gateway, Autenticação JWT, Realtime WebSockets, Storage e Console de Administração Visual.

### Componentes da Stack Containerizada

| Serviço | Imagem Docker | Porta Expósta / Bind | Descrição |
| :--- | :--- | :--- | :--- |
| **`db`** | `supabase/postgres:17.6.1.136` | `127.0.0.1:5432` | Banco relacional PostgreSQL 17 com extensões (`pgvector`, `uuid-ossp`, `pg_trgm`, `pgcrypto`) |
| **`kong`** | `kong/kong:3.9.1` | `0.0.0.0:8000`<br>`127.0.0.1:8443` | API Gateway unificado (Roteamento HTTP/HTTPS, CORS, Rate Limiting, autenticação JWT) |
| **`studio`** | `supabase/studio:2026.07.07` | `127.0.0.1:54323` | Console visual web de administração de tabelas, SQL Editor e gestão da plataforma |
| **`rest`** | `postgrest/postgrest:v14.12` | Interna (`3000`) | Gateway ORM RESTful que expõe APIs automaticamente sobre as tabelas PostgreSQL |
| **`auth`** | `supabase/gotrue:v2.189.0` | Interna (`9999`) | Serviço de Autenticação JWT, Gestão de Usuários, MFA e Provedores OAuth |
| **`realtime`** | `supabase/realtime:v2.102.3` | Interna (`4000`) | Servidor WebSockets Elixir para escuta de mudanças no banco (Change Data Capture) |
| **`storage`** | `supabase/storage-api:v1.60.4` | Interna (`5000`) | API de Armazenamento de Arquivos e Mídia com backend em Filesystem / S3 |
| **`imgproxy`** | `darthsim/imgproxy:v3.30.1` | Interna (`5001`) | Processamento e otimização dinâmica de imagens (redimensionamento, WebP automático) |
| **`meta`** | `supabase/postgres-meta:v0.96.6` | Interna (`8080`) | API utilitária para inspeção de esquemas, tabelas e papéis no PostgreSQL |

---

## 🔒 Boas Práticas de Segurança e Rede

1. **Bind IP Restritivo (`127.0.0.1`):** Por padrão, as portas sensíveis do PostgreSQL (`5432`) e do Studio (`54323`) são vinculadas estritamente ao IP de loopback (`127.0.0.1`). Isso evita a exposição direta do banco ou da UI de administração em instâncias de nuvem/EC2 públicas.
   - Para alterar o bind IP em desenvolvimento/staging, configure no `.env`: `POSTGRES_BIND_IP=0.0.0.0` ou `STUDIO_BIND_IP=0.0.0.0`.
2. **Rede Isolada (`supabase-net`):** Todos os contêineres se comunicam através de uma rede bridge privada dedicada (`supabase-net`), garantindo resolução DNS interna e isolando o tráfego backend do host.
3. **Log Rotation Ativo (`json-file`):** Rotação automática configurada com limite de `10MB` por arquivo e retenção máxima de `3` arquivos antigos por contêiner.

---

## 📁 Estrutura de Diretórios e Volumes

```
c:\Projetos_Leilão_Raspagem\painel-supabase\
├── .env                          # Variáveis de ambiente ativas (Credenciais DB, Segredos JWT)
├── .env.example                  # Template para novos ambientes e deploy AWS
├── docker-compose.yml            # Orquestrador oficial dos contêineres Docker
├── README.md                     # Este documento de instrução e arquitetura
├── volumes/
│   ├── api/
│   │   ├── kong.yml              # Configuração declarativa de rotas do Kong API Gateway
│   │   └── kong-entrypoint.sh    # Script de conversão e inicialização das rotas no Kong
│   ├── db/
│   │   ├── init/
│   │   │   ├── 01-schema.sql     # DDL: Tabelas, índices JSONB, triggers e extensões (Montado via Docker)
│   │   │   └── 02-seed.sql       # DML: Usuário admin (Willamy Mamede) & preferências padrão (Montado via Docker)
│   │   ├── roles.sql             # Definição de papéis e permissões Supabase (`anon`, `authenticated`, etc.)
│   │   └── jwt.sql               # Configurações de chaves de assinatura JWT no Postgres
│   ├── storage/                  # Volume local de armazenamento de mídia do Storage API
│   └── snippets/                 # Snippets SQL persistidos do Studio
└── scripts/
    ├── setup.bat                 # Automação de subida e carga 1-clique (Windows)
    ├── setup.sh                  # Automação de subida e carga 1-clique (Linux/AWS)
    └── seed_properties.py        # Script Python de carga de ativos do arquivo properties.json
```

---

## 🚀 Execução Local e Operação

### 1. Iniciar Infraestrutura e Carga em 1 Clique

#### No Windows:
```cmd
cd c:\Projetos_Leilão_Raspagem\painel-supabase
scripts\setup.bat
```

#### No Linux / macOS / AWS EC2:
```bash
cd /opt/Projetos_Leilao_Raspagem/painel-supabase
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Endereços de Acesso

- **Supabase Studio (Console Admin):** [http://localhost:54323](http://localhost:54323)
- **API Gateway (Kong REST / Auth):** [http://localhost:8000](http://localhost:8000)
- **PostgreSQL Connection String:** `postgresql://postgres:L3il0jus_P4ssW0rd!2026@127.0.0.1:5432/postgres`

---

## 🛠️ Comandos de Troubleshooting e Manutenção

### Verificar Status de Saúde de Todos os Serviços
```bash
docker compose ps
```
> Todos os contêineres devem exibir o status `(healthy)`.

### Acompanhar Logs em Tempo Real
```bash
# Logs globais da stack
docker compose logs -f

# Logs de um serviço específico (ex: db, kong, auth, rest)
docker compose logs -f db
```

### Reiniciar Stack Limpa
```bash
docker compose down
docker compose up -d
```

### Inspecionar Tabelas e Relações no Banco de Dados
```bash
docker exec -it supabase-db psql -U postgres -d postgres -c "\dt public.*"
```

---

## 📊 Schemas e Tabelas Principais (13 Tabelas)

1. **`public.imoveis_caixa`**: Catálogo mestre de imóveis CAIXA sincronizados. Possui índice GIN JSONB e triggers de `updated_at`.
2. **`public.profiles`**: Perfis de usuários RBAC (Admin, Analyst, Investor Pro, Investor Free).
3. **`public.user_preferences`**: Preferências de busca, faixas de preço, temas e alertas dos usuários.
4. **`public.user_favorites`**: Imóveis marcados como favoritos por investidor.
5. **`public.user_kanban`**: Funil de arrematação (Prospecção, Análise Jurídica, Vistoria, Lance Enviado, Arrematado, Descartado).
6. **`public.user_alerts`**: Alertas automáticos por e-mail/WhatsApp.
7. **`public.api_keys`**: Chaves de integração para consumo externo da API REST.
8. **`public.bens`**, **`public.leiloes`**, **`public.bens_historico_vendas`**, **`public.bens_imoveis_enriquecidos`**, **`public.leilao_assets`**, **`public.user_settings`**: Tabelas de suporte ao ecossistema de leilões e scrapers.

---

## ☁️ Guia de Deploy em Nuvem (AWS EC2 / ECS)

1. **Security Groups:** Liberar portas `22` (SSH) e `8000` (API Gateway HTTP). Mantenha a porta `5432` restrita ao IP privado dos microsserviços do backend.
2. **Variáveis de Ambiente:** No ambiente AWS, atualize `.env` gerando uma nova `POSTGRES_PASSWORD` forte e atualizando as chaves `JWT_SECRET`, `ANON_KEY` e `SERVICE_ROLE_KEY`.
3. **Execução:** Execute `./scripts/setup.sh` para provisionar o ambiente.
