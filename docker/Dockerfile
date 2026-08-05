# Multi-stage Dockerfile Otimizado Standalone para Painel CAIXA (Next.js 15)
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Aproveitar cache de dependencias do npm
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3050
ENV HOSTNAME="0.0.0.0"

# Instalar wget para healthchecks leves sem root
RUN apk add --no-cache wget

# Criar usuario e grupo sem privilegios de superusuario
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar arquivos estaticos e build standalone enxuto
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3050

HEALTHCHECK --interval=15s --timeout=5s --retries=3 --start-period=15s \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3050/api/health || exit 1

CMD ["node", "server.js"]
