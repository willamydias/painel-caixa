#!/usr/bin/env bash
# ===================================================================
# AUTOMATED SETUP SCRIPT FOR PAINEL-SUPABASE (LINUX / AWS BASH)
# Subida do container Docker, inicializacao DB e carga inicial de dados
# ===================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "==================================================================="
echo "[PAINEL-SUPABASE] Iniciando Automação do Serviço Supabase (AWS/Linux)"
echo "==================================================================="

cd "${ROOT_DIR}"

# Garantir arquivo .env
if [ ! -f .env ]; then
    echo "[CONFIG] Arquivo .env não encontrado. Copiando de .env.example..."
    cp .env.example .env
fi

echo "[DOCKER] Subindo os serviços PostgreSQL, PostgREST e Studio via Docker Compose..."
docker compose up -d --build

echo "[HEALTHCHECK] Aguardando inicialização do banco de dados PostgreSQL..."
sleep 8

echo "[SEED] Executando carga inicial de imóveis no banco PostgreSQL..."
python3 scripts/seed_properties.py || python scripts/seed_properties.py

echo "==================================================================="
echo "[STATUS OK] Infraestrutura do Supabase operacional!"
echo " - PostgreSQL Database: localhost:5432"
echo " - PostgREST API REST:  http://localhost:3000"
echo " - Supabase Studio UI:  http://localhost:54323"
echo "==================================================================="
