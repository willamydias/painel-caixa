#!/usr/bin/env python3
"""
===================================================================
SCRIPT DE CARGA E INGESTÃO INICIAL DE IMÓVEIS (PAINEL-SUPABASE)
Lê o catálogo JSON em painel-caixa/public/data/properties.json
e insere/atualiza (upsert) na API REST Supabase 'imoveis_caixa'.
===================================================================
"""

import os
import sys
import json
import urllib.request
import urllib.error

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ENV_FILE = os.path.join(os.path.dirname(__file__), "..", ".env")
PROPERTIES_JSON = os.path.join(BASE_DIR, "painel-caixa", "public", "data", "properties.json")

def load_env(env_path):
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env_vars[k.strip()] = v.strip().strip('"').strip("'")
    return env_vars

env_config = load_env(ENV_FILE)
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", env_config.get("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:8000"))
SERVICE_ROLE_KEY = os.getenv("SERVICE_ROLE_KEY", env_config.get("SERVICE_ROLE_KEY", env_config.get("SUPABASE_SERVICE_ROLE_KEY", "")))

def run_seed():
    print(f"==================================================")
    print(f"[Painel Supabase Seed] Iniciando ingestão de imóveis...")
    print(f"[Painel Supabase Seed] Origem: {PROPERTIES_JSON}")
    print(f"==================================================")

    if not os.path.exists(PROPERTIES_JSON):
        print(f"[Aviso] Arquivo JSON de imóveis não localizado em: {PROPERTIES_JSON}")
        print(f"[Aviso] Carga de imóveis pulada. Os serviços Supabase permanecem ativos!")
        return

    with open(PROPERTIES_JSON, "r", encoding="utf-8") as f:
        payload = json.load(f)

    properties = payload.get("properties", [])
    if not properties:
        print(f"[Aviso] Nenhum imóvel encontrado no arquivo JSON.")
        return

    records = []
    for prop in properties:
        prop_id = str(prop.get("id") or prop.get("numero") or "")
        if not prop_id:
            continue
        records.append({
            "id": prop_id,
            "data": prop
        })

    if not records:
        print(f"[Aviso] Nenhum registro válido para inserção.")
        return

    endpoint = f"{SUPABASE_URL}/rest/v1/imoveis_caixa"
    headers = {
        "Content-Type": "application/json",
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Prefer": "resolution=merge-duplicates"
    }

    print(f"[API Rest] Enviando batch de {len(records)} imóveis para {endpoint}...")

    req = urllib.request.Request(
        endpoint,
        data=json.dumps(records, ensure_ascii=False).encode("utf-8"),
        headers=headers,
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as resp:
            print(f"[Sucesso OK] {len(records)} imóveis sincronizados com sucesso na tabela 'imoveis_caixa' (Status HTTP {resp.status})!")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='ignore')
        print(f"[Erro HTTP {e.code}] Falha na ingestão via REST API: {err_body}")
        sys.exit(1)
    except Exception as e:
        print(f"[Erro de Conexão API] {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_seed()
