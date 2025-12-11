FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the project
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files for migration
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Install prisma explicitly for migrations since standalone build excludes it
RUN npm install prisma@5.22.0 --no-save && chown -R nextjs:nodejs /app/node_modules

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Ensure uploads directory exists and is writable
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Run migrations and start the server
# Note: We need to set the DATABASE_URL environment variable at runtime
CMD ["sh", "-c", "echo 'Running migrations...' && ./node_modules/.bin/prisma migrate deploy && echo 'Starting server...' && node server.js"]
