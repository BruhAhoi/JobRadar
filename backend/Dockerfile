FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

RUN npm ci

# Generate Prisma client
RUN npx prisma generate

COPY src ./src

# Build TypeScript
RUN npm run build

# Copy generated prisma vào dist để dùng trong runner
RUN cp -r src/generated dist/generated

# ---

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev

# Generate Prisma client trong runner
RUN npx prisma generate

# Copy compiled JS từ builder
COPY --from=builder /app/dist ./dist

EXPOSE 5001

CMD ["node", "dist/server.js"]