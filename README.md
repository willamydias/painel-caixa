# 🏢 Painel de Oportunidades CAIXA — Aplicação Full-Stack

> Plataforma inteligente para prospecção, análise jurídica, gestão de favoritos, funil Kanban de arrematação e alertas de imóveis de leilão da **Caixa Econômica Federal**.

---

## 📌 Visão Geral do Sistema

O **Painel de Oportunidades CAIXA** é uma aplicação web full-stack de alto desempenho construída em **Next.js 15 (App Router)** com **TypeScript**, **Tailwind CSS** e persistência de dados em **Supabase Self-Hosted (PostgreSQL 17)** containerizado via Docker Compose.

---

## 🚀 Arquitetura e Tecnologias

### Frontend & API Web (`painel-caixa`)
- **Framework:** Next.js 15 (React 19 / App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS, Lucide Icons, Design System moderno com Dark Mode
- **Estado Global:** Context API (`DashboardContext`, `UserContext`)
- **Visualização & Mapas:** Leaflet / Interactive Maps, Gráficos Recharts
- **Backend API Routes:** Next.js API Handlers (`src/app/api/`) integrados ao Supabase/PostgreSQL

### Infraestrutura de Dados (`painel-supabase`)
- **Banco de Dados:** PostgreSQL 17 com extensões `pgvector`, `uuid-ossp`, `pg_trgm` e `pgcrypto`
- **API Gateway:** Kong API Gateway (Porta `8000`)
- **Autenticação:** Supabase GoTrue JWT Auth (Role-Based Access Control - RBAC)
- **ORM / REST API:** PostgREST v14.12
- **Console Admin:** Supabase Studio Console (Porta `54323`)
- **Storage & Imgproxy:** Armazenamento resiliente com otimização dinâmica de imagens

---

## ✨ Funcionalidades Principais

1. **📊 Dashboard de Oportunidades:**
   - Visualização em Grade e Tabela de imóveis com filtros por UF, Cidade, Modalidade, Desconto e Faixa de Preço.
   - Cálculo automático de rentabilidade, margem estimada e desconto % em relação à avaliação CAIXA.

2. **🗺️ Mapa Interativo de Ativos:**
   - Geolocalização e agrupamento visual de imóveis por município e bairro.

3. **📋 Kanban de Arrematação:**
   - Gestão de pipeline por estágios: *Prospecção* ➔ *Análise Jurídica* ➔ *Vistoria* ➔ *Lance Enviado* ➔ *Arrematado* ➔ *Descartado*.

4. **⭐ Favoritos & Notas Personalizadas:**
   - Marcação de ativos favoritos com anotações privadas e tags customizadas por investidor.

5. **🔔 Alertas Inteligentes:**
   - Configuração de alertas automatizados com base em critérios de busca e notificações via e-mail.

6. **👤 Gestão de Perfis & RBAC:**
   - Níveis de acesso estruturados (`Admin`, `Analyst`, `Investor Pro`, `Investor Free`).

---

## 📁 Estrutura do Diretório

```
c:\Projetos_Leilão_Raspagem\painel-caixa\
├── src/
│   ├── app/                        # App Router Pages & API Routes (Next.js 15)
│   │   ├── admin/                  # Console Administrativo de Perfis
│   │   ├── alertas/                # Gerenciador de Alertas do Investidor
│   │   ├── api/                    # API Routes (Alerts, Favorites, Notes, Users)
│   │   ├── conta/                  # Perfil do Usuário & Configurações
│   │   ├── dashboard/              # Visão Geral e Indicadores
│   │   ├── favoritos/              # Imóveis Salvos e Favoritados
│   │   ├── labels/                 # Tags e Etiquetas
│   │   └── page.tsx                # Landing Page & Filtros Principais
│   ├── components/                 # Componentes Reutilizáveis (Grid, Detail, Layout, Modals)
│   ├── context/                    # Contextos Globais (DashboardContext, UserContext)
│   └── lib/                        # Utilitários e Conexão PostgreSQL/Supabase (`db.ts`)
├── painel-supabase/                # Stack Containerizada Oficial Supabase Self-Hosted
│   ├── docker-compose.yml          # Orquestrador Docker dos 9 serviços
│   ├── README.md                   # Documentação detalhada da infraestrutura Docker
│   ├── scripts/                    # Scripts de automação (setup.bat, setup.sh, seed_properties.py)
│   └── volumes/                    # DDL Schemas (`01-schema.sql`), Seeds e Configurações
├── public/                         # Ativos estáticos (Fotos, Favicon, Data JSON)
└── README.md                       # Este documento
```

---

## ⚡ Guia de Execução Rápida (Quick Start)

### 1. Requisitos Prévios
- Node.js 18+ e npm/yarn/pnpm
- Docker Desktop instalado e ativo

### 2. Inicializar a Infraestrutura de Dados (Supabase Docker)
```bash
# Entrar na pasta do Supabase e executar o script de automação
cd painel-supabase

# Windows (CMD / PowerShell):
scripts\setup.bat

# Linux / macOS:
chmod +x scripts/setup.sh
./scripts/setup.sh
```
> O script subirá os contêineres e executará a carga inicial do banco de dados automaticamente.

### 3. Inicializar a Aplicação Web Next.js
```bash
# Na raiz do projeto (painel-caixa)
npm install
npm run dev
```

Abra o navegador em: **[http://localhost:3050](http://localhost:3050)** (ou `http://localhost:3000`).

---

## 🔗 Endereços de Acesso da Infraestrutura

- **Aplicação Web (Painel CAIXA):** [http://localhost:3050](http://localhost:3050)
- **Supabase Studio (Console Admin DB):** [http://localhost:54323](http://localhost:54323)
- **Kong API Gateway:** [http://localhost:8000](http://localhost:8000)
- **Postgres String de Conexão:** `postgresql://postgres:L3il0jus_P4ssW0rd!2026@127.0.0.1:5432/postgres`

---

## 🔒 Segurança e Boas Práticas

- **Credenciais Seguras:** Por padrão, as portas do banco (`5432`) e do Studio (`54323`) utilizam bind IP restrito em `127.0.0.1`.
- **Rotação de Logs:** Os contêineres Docker possuem rotação ativada (`10MB` máx., `3` arquivos).
- **Variáveis de Ambiente:** Nunca envie senhas reais de produção para repositórios públicos. Utilize o arquivo `.env.example` como modelo.
