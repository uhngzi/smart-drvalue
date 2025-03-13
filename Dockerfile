# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

# 전체 소스 복사
COPY . .

# 의존성 설치 및 빌드
RUN yarn install --frozen-lockfile
RUN yarn build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=80

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

RUN yarn install --production --frozen-lockfile

EXPOSE 80

CMD ["yarn", "start"]