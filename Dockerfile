# Stage 1: Build
FROM node:20-alpine AS builder

# 작업 디렉터리 설정
WORKDIR /app

# 의존성 설치를 위해 package.json, yarn.lock 복사
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 전체 소스 복사 및 빌드 실행
COPY . .
RUN yarn build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

# 프로덕션 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=80

# 빌드 산출물과 필요한 파일 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

# 프로덕션 의존성 설치 (개발 의존성 제외)
RUN yarn install --production --frozen-lockfile

# 컨테이너가 80번 포트를 사용함을 명시
EXPOSE 80

# Next.js 서버 시작 (환경변수 PORT=80을 통해 80번 포트로 실행됨)
CMD ["yarn", "start"]