# Etapa 1: Build
FROM node:20.11.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY tsconfig.json ./
COPY src ./src

RUN npm install -D typescript @types/node
RUN npm run build

# Etapa 2: Production
FROM node:20.11.1-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
