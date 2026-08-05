@echo off
chcp 65001 >nul
REM ===================================================================
REM AUTOMATED SETUP SCRIPT FOR PAINEL-SUPABASE (WINDOWS BATCH)
REM Subida do container Docker, inicializacao DB e carga inicial de dados
REM ===================================================================

echo ===================================================================
echo [PAINEL-SUPABASE] Iniciando Automacao do Servico Supabase
echo ===================================================================

cd /d "%~dp0"
cd ..

REM Verificar se arquivo .env existe
if not exist .env (
    echo [CONFIG] Arquivo .env nao encontrado. Copiando de .env.example...
    copy .env.example .env
)

echo [DOCKER] Testando conexao com o motor do Docker...
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo -------------------------------------------------------------------
    echo [ERRO DOCKER DAEMON] O motor do Docker nao esta ativo!
    echo -------------------------------------------------------------------
    echo O comando 'docker' foi localizado, mas o motor de conteineres nao esta rodando.
    echo.
    echo Se voce tem o Docker Desktop instalado:
    echo   - Abra o 'Docker Desktop' pelo Menu Iniciar e aguarde ele iniciar.
    echo.
    echo Se voce ainda nao instalou o motor Docker Desktop:
    echo   - Instale baixando de: https://www.docker.com/products/docker-desktop/
    echo   - Ou execute no PowerShell como Administrador: choco install docker-desktop
    echo -------------------------------------------------------------------
    echo.
    exit /b 1
)

echo [DOCKER] Subindo os servicos PostgreSQL, PostgREST e Studio via Docker Compose...
docker compose up -d --build

if %ERRORLEVEL% NEQ 0 (
    echo [DOCKER ERROR] Falha ao executar 'docker compose up'.
    exit /b %ERRORLEVEL%
)

echo [HEALTHCHECK] Aguardando 10 segundos para a inicializacao dos servicos...
ping 127.0.0.1 -n 10 >nul

echo [SEED] Executando carga inicial dos imoveis em 'imoveis_caixa'...
python scripts\seed_properties.py

echo ===================================================================
echo [STATUS] Servicos executando com sucesso!
echo - PostgreSQL Database: localhost:5432
echo - PostgREST API REST: http://localhost:3000
echo - Supabase Studio UI: http://localhost:54323
echo ===================================================================
