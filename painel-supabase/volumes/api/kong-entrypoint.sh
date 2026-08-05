#!/bin/sh
set -e

if command -v envsubst >/dev/null 2>&1; then
    envsubst < /home/kong/temp.yml > /usr/local/kong/kong.yml
elif command -v python3 >/dev/null 2>&1; then
    python3 -c "import os, sys; print(os.path.expandvars(sys.stdin.read()))" < /home/kong/temp.yml > /usr/local/kong/kong.yml
else
    cat /home/kong/temp.yml > /usr/local/kong/kong.yml
fi

if [ -f /entrypoint.sh ]; then
    exec /entrypoint.sh kong docker-start
else
    exec kong docker-start
fi
