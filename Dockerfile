# Stage 1: Build
FROM node:20-alpine AS builder

# 작업 디렉터리 설정
WORKDIR /app

# Corepack 활성화 (Yarn Berry 사용)
RUN corepack enable

# package.json, yarn.lock 파일 복사 후 의존성 설치
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 전체 소스 복사 및 빌드 실행
COPY . .
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