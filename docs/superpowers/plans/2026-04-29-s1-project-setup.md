# On-Trip S1 — 프로젝트 셋업 (W1–2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 모노레포 + FE(Expo/RN) + BE(NestJS) + Postgres/Redis(Docker) + OpenAPI 타입 공유 + 디자인 토큰 + 모바일 ↔ 서버 헬스체크 E2E 동작까지의 베이스라인을 12주 일정의 첫 2주(S1)에 끝낸다.

**Architecture:**
- pnpm workspaces 모노레포 (`apps/backend`, `apps/mobile`, `packages/shared`)
- Backend: NestJS + TypeScript + Prisma(PostgreSQL) + ioredis + Swagger(OpenAPI)
- Mobile: Expo (RN) + TypeScript + React Navigation + Zustand + TanStack Query + openapi-typescript로 타입 자동 생성
- Local Dev: Docker Compose (Postgres 16 + Redis 7) + GitHub Actions CI(lint+typecheck+test)

**Tech Stack:** pnpm 9, Node 20, TypeScript 5.4+, NestJS 10, Prisma 5, ioredis 5, Expo SDK 50+, React Navigation 7, Zustand 4, TanStack Query 5, Vitest/Jest

**Out of Scope (S2 이후로 미룸):** PASS 인증, 카카오맵 SDK 통합, 매칭 엔진, 실제 화면(S-01~S-12) 구현, FCM, S3 업로드. **이 계획은 베이스라인만 만든다.**

---

## File Structure

```
on-trip/
├─ .gitignore
├─ .nvmrc                                  Node 20
├─ pnpm-workspace.yaml
├─ package.json                            루트 (workspaces 정의 + 공통 스크립트)
├─ compose.yml                             Postgres + Redis
├─ README.md                               로컬 셋업 가이드
├─ .github/workflows/ci.yml                lint/typecheck/test
├─ apps/
│  ├─ backend/
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  ├─ nest-cli.json
│  │  ├─ .env.example
│  │  ├─ prisma/
│  │  │  └─ schema.prisma                  최소 User 모델 (S2에서 확장)
│  │  ├─ src/
│  │  │  ├─ main.ts                        부트스트랩 + Swagger
│  │  │  ├─ app.module.ts
│  │  │  ├─ config/                        env loader
│  │  │  ├─ prisma/                        PrismaService
│  │  │  ├─ redis/                         RedisService
│  │  │  └─ health/
│  │  │     ├─ health.controller.ts
│  │  │     ├─ health.service.ts
│  │  │     └─ health.controller.spec.ts
│  │  └─ test/                             e2e 테스트
│  └─ mobile/
│     ├─ package.json
│     ├─ tsconfig.json
│     ├─ app.json                          Expo 설정
│     ├─ App.tsx                           NavigationContainer + QueryClientProvider
│     ├─ src/
│     │  ├─ design/
│     │  │  └─ tokens.ts                   키치 스티커 색상/타이포/그림자 토큰
│     │  ├─ navigation/
│     │  │  └─ RootNavigator.tsx           스택: Map / Activity / My (placeholder)
│     │  ├─ screens/
│     │  │  ├─ MapScreen.tsx               헬스체크 결과 표시
│     │  │  ├─ ActivityScreen.tsx          placeholder
│     │  │  └─ MyScreen.tsx                placeholder
│     │  ├─ api/
│     │  │  └─ client.ts                   fetch 래퍼 + base URL
│     │  └─ stores/
│     │     └─ index.ts                    Zustand placeholder
└─ packages/
   └─ shared/
      ├─ package.json
      ├─ tsconfig.json
      ├─ src/
      │  └─ index.ts                       openapi-typescript 생성된 타입 re-export
      └─ scripts/
         └─ gen-types.sh                   백엔드 /api/docs-json → src/openapi.d.ts
```

---

### Task 1: Git 초기화 + 모노레포 베이스

**Files:**
- Create: `.gitignore`
- Create: `.nvmrc`
- Create: `pnpm-workspace.yaml`
- Create: `package.json` (root)
- Create: `README.md`

- [ ] **Step 1: 작업 디렉토리에서 git 초기화 + Node 버전 고정**

```bash
cd /Users/baeg-yujin/Desktop/project/on-trip
git init -b main
echo "20" > .nvmrc
corepack enable
corepack prepare pnpm@9 --activate
```

- [ ] **Step 2: `.gitignore` 작성**

```gitignore
node_modules/
dist/
build/
.expo/
.expo-shared/
*.log
.DS_Store
.env
.env.local
coverage/
.turbo/
.superpowers/

# Mobile
apps/mobile/ios/
apps/mobile/android/
apps/mobile/.expo/

# Backend
apps/backend/dist/
apps/backend/.env
```

- [ ] **Step 3: `pnpm-workspace.yaml` 작성**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 4: 루트 `package.json` 작성**

```json
{
  "name": "on-trip",
  "version": "0.0.1",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev:be": "pnpm --filter @on-trip/backend start:dev",
    "dev:mobile": "pnpm --filter @on-trip/mobile start",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm -r test",
    "db:up": "docker compose up -d postgres redis",
    "db:down": "docker compose down"
  }
}
```

- [ ] **Step 5: `README.md` 최소 작성 (자세한 가이드는 Task 15에서 채움)**

```markdown
# On-Trip

여행지에서 같은 동네 일행을 만나는 GPS 기반 매칭 앱.

## 로컬 개발 (자세한 셋업은 Task 15에서)

```bash
pnpm install
pnpm db:up
pnpm dev:be      # 백엔드: http://localhost:3000
pnpm dev:mobile  # 모바일: Expo Go로 QR 스캔
```
```

- [ ] **Step 6: 커밋**

```bash
git add .gitignore .nvmrc pnpm-workspace.yaml package.json README.md
git commit -m "chore: init pnpm monorepo skeleton"
```

---

### Task 2: 백엔드 NestJS 부트스트랩

**Files:**
- Create: `apps/backend/` (NestJS 기본 구조)
- Modify: `apps/backend/package.json` (이름 + 스크립트)

- [ ] **Step 1: NestJS CLI로 백엔드 생성**

```bash
cd /Users/baeg-yujin/Desktop/project/on-trip
mkdir -p apps
pnpm dlx @nestjs/cli@10 new apps/backend --package-manager pnpm --skip-git
```

(질문 나오면 pnpm 선택)

- [ ] **Step 2: `apps/backend/package.json` 정리 — 이름 변경 + lint/typecheck 스크립트 추가**

기존 `name`을 `@on-trip/backend`로 바꾸고, scripts에 다음을 추가:

```json
{
  "name": "@on-trip/backend",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "test": "jest"
  }
}
```

(기존 build/start/start:dev/start:prod/test:* 스크립트는 유지)

- [ ] **Step 3: 의존성 일괄 설치 (루트에서)**

```bash
cd /Users/baeg-yujin/Desktop/project/on-trip
pnpm install
```

- [ ] **Step 4: 자동 생성된 `apps/backend/src/app.controller.spec.ts`가 통과하는지 확인**

```bash
pnpm --filter @on-trip/backend test
```

Expected: 1 test passed (자동 생성된 "should return Hello World!")

- [ ] **Step 5: 개발 서버 기동 확인**

```bash
pnpm dev:be
```

별도 터미널에서:

```bash
curl http://localhost:3000
```

Expected: `Hello World!` 출력 후 서버 종료(Ctrl+C)

- [ ] **Step 6: 커밋**

```bash
git add apps/backend pnpm-lock.yaml
git commit -m "chore(backend): bootstrap nestjs in apps/backend"
```

---

### Task 3: 백엔드 ConfigModule + .env 스캐폴딩

**Files:**
- Create: `apps/backend/.env.example`
- Create: `apps/backend/src/config/env.ts`
- Modify: `apps/backend/src/app.module.ts`

- [ ] **Step 1: `@nestjs/config` 설치**

```bash
pnpm --filter @on-trip/backend add @nestjs/config
```

- [ ] **Step 2: `apps/backend/.env.example` 작성**

```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://ontrip:ontrip@localhost:5432/ontrip
REDIS_URL=redis://localhost:6379
JWT_SECRET=replace-me-in-production
```

- [ ] **Step 3: 같은 내용으로 `.env` 생성 (gitignore됨)**

```bash
cp apps/backend/.env.example apps/backend/.env
```

- [ ] **Step 4: 환경변수 타입 가드 작성 (`apps/backend/src/config/env.ts`)**

```ts
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_SECRET: z.string().min(8),
});

export type Env = z.infer<typeof envSchema>;
```

- [ ] **Step 5: zod 설치**

```bash
pnpm --filter @on-trip/backend add zod
```

- [ ] **Step 6: `apps/backend/src/app.module.ts`에 ConfigModule 통합**

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envSchema } from './config/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (raw) => envSchema.parse(raw),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- [ ] **Step 7: 서버가 기동되는지 확인**

```bash
pnpm dev:be
```

Expected: 정상 부팅 (envSchema 통과). Ctrl+C.

- [ ] **Step 8: 커밋**

```bash
git add apps/backend
git commit -m "feat(backend): add zod-validated config module"
```

---

### Task 4: Docker Compose (Postgres + Redis)

**Files:**
- Create: `compose.yml` (루트)

- [ ] **Step 1: `compose.yml` 작성**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ontrip
      POSTGRES_PASSWORD: ontrip
      POSTGRES_DB: ontrip
    ports:
      - "5432:5432"
    volumes:
      - ontrip_pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ontrip -d ontrip"]
      interval: 5s
      timeout: 3s
      retries: 10

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  ontrip_pg_data:
```

- [ ] **Step 2: 컨테이너 기동 확인**

```bash
pnpm db:up
docker compose ps
```

Expected: postgres, redis 모두 `Up (healthy)` 또는 헬스체크 후 healthy 상태.

- [ ] **Step 3: Postgres 접속 검증**

```bash
docker compose exec postgres psql -U ontrip -d ontrip -c "SELECT version();"
```

Expected: PostgreSQL 16.x 버전 문자열 출력.

- [ ] **Step 4: 커밋**

```bash
git add compose.yml
git commit -m "chore: add docker compose for postgres and redis"
```

---

### Task 5: Prisma 통합 + User 모델 마이그레이션

**Files:**
- Create: `apps/backend/prisma/schema.prisma`
- Create: `apps/backend/src/prisma/prisma.module.ts`
- Create: `apps/backend/src/prisma/prisma.service.ts`
- Create: `apps/backend/src/prisma/prisma.service.spec.ts`
- Modify: `apps/backend/src/app.module.ts`
- Modify: `apps/backend/package.json` (prisma scripts)

- [ ] **Step 1: Prisma 설치**

```bash
pnpm --filter @on-trip/backend add @prisma/client
pnpm --filter @on-trip/backend add -D prisma
```

- [ ] **Step 2: `apps/backend/prisma/schema.prisma` 작성 (S1은 User 1개만, S2~S4에서 확장)**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  nickname    String   @unique
  bio         String?
  coinBalance Int      @default(1000)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("users")
}
```

- [ ] **Step 3: `apps/backend/package.json` scripts에 prisma 명령 추가**

```json
"prisma:generate": "prisma generate",
"prisma:migrate": "prisma migrate dev",
"prisma:studio": "prisma studio"
```

- [ ] **Step 4: 첫 마이그레이션 생성 + 적용**

```bash
cd apps/backend
pnpm prisma:migrate -- --name init
```

(인터랙티브 프롬프트가 뜨면 migration 이름 그대로 엔터)

Expected: `prisma/migrations/<timestamp>_init/migration.sql` 생성, DB에 `users` 테이블 만들어짐.

- [ ] **Step 5: PrismaService 작성 (`src/prisma/prisma.service.ts`)**

```ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

- [ ] **Step 6: PrismaModule 작성 (`src/prisma/prisma.module.ts`)**

```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

- [ ] **Step 7: 실패하는 테스트 작성 (`src/prisma/prisma.service.spec.ts`)**

```ts
import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = moduleRef.get(PrismaService);
    await service.onModuleInit();
  });

  afterAll(async () => {
    await service.onModuleDestroy();
  });

  it('connects to the database (raw SELECT 1)', async () => {
    const result = await service.$queryRaw<{ ok: number }[]>`SELECT 1 as ok`;
    expect(result[0].ok).toBe(1);
  });
});
```

- [ ] **Step 8: 테스트 실행 → 실패 확인 (PrismaModule을 AppModule에 안 붙였으므로 `.env` 안 읽힘)**

```bash
pnpm --filter @on-trip/backend test prisma.service
```

Expected: FAIL — `Environment variable not found: DATABASE_URL` 또는 유사한 메시지.

- [ ] **Step 9: Jest 설정에 `.env` 로드 추가**

`apps/backend/package.json`의 `jest` 섹션을 다음과 같이 수정:

```json
"jest": {
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" },
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node",
  "setupFiles": ["<rootDir>/../jest.setup.ts"]
}
```

`apps/backend/jest.setup.ts` 생성:

```ts
import { config } from 'dotenv';
config({ path: '.env' });
```

dotenv 추가:

```bash
pnpm --filter @on-trip/backend add -D dotenv
```

- [ ] **Step 10: 테스트 재실행 → 통과 확인**

```bash
pnpm --filter @on-trip/backend test prisma.service
```

Expected: PASS — `connects to the database` 통과.

- [ ] **Step 11: AppModule에 PrismaModule 통합**

`apps/backend/src/app.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envSchema } from './config/env';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (raw) => envSchema.parse(raw),
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- [ ] **Step 12: 커밋**

```bash
git add apps/backend
git commit -m "feat(backend): add prisma + user model + db connection test"
```

---

### Task 6: Redis 통합 + Health Check

**Files:**
- Create: `apps/backend/src/redis/redis.module.ts`
- Create: `apps/backend/src/redis/redis.service.ts`
- Create: `apps/backend/src/health/health.controller.ts`
- Create: `apps/backend/src/health/health.service.ts`
- Create: `apps/backend/src/health/health.controller.spec.ts`
- Modify: `apps/backend/src/app.module.ts`

- [ ] **Step 1: ioredis 설치**

```bash
pnpm --filter @on-trip/backend add ioredis
```

- [ ] **Step 2: RedisService 작성 (`src/redis/redis.service.ts`)**

```ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  readonly client: Redis;

  constructor(config: ConfigService) {
    this.client = new Redis(config.getOrThrow<string>('REDIS_URL'));
  }

  async ping(): Promise<string> {
    return this.client.ping();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
```

- [ ] **Step 3: RedisModule 작성 (`src/redis/redis.module.ts`)**

```ts
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
```

- [ ] **Step 4: 실패하는 health 테스트 먼저 작성 (`src/health/health.controller.spec.ts`)**

```ts
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prisma: PrismaService;
  let redis: RedisService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      controllers: [HealthController],
      providers: [HealthService, PrismaService, RedisService],
    }).compile();

    controller = moduleRef.get(HealthController);
    prisma = moduleRef.get(PrismaService);
    redis = moduleRef.get(RedisService);
    await prisma.onModuleInit();
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
    await redis.onModuleDestroy();
  });

  it('returns ok=true with db and redis status', async () => {
    const result = await controller.check();
    expect(result.ok).toBe(true);
    expect(result.db).toBe('up');
    expect(result.redis).toBe('up');
  });
});
```

- [ ] **Step 5: 테스트 실행 → FAIL 확인**

```bash
pnpm --filter @on-trip/backend test health.controller
```

Expected: FAIL — HealthController/HealthService 미존재.

- [ ] **Step 6: HealthService 작성 (`src/health/health.service.ts`)**

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

export type HealthResult = {
  ok: boolean;
  db: 'up' | 'down';
  redis: 'up' | 'down';
};

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async check(): Promise<HealthResult> {
    const [db, redis] = await Promise.all([this.checkDb(), this.checkRedis()]);
    return { ok: db === 'up' && redis === 'up', db, redis };
  }

  private async checkDb(): Promise<'up' | 'down'> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'up';
    } catch {
      return 'down';
    }
  }

  private async checkRedis(): Promise<'up' | 'down'> {
    try {
      const pong = await this.redis.ping();
      return pong === 'PONG' ? 'up' : 'down';
    } catch {
      return 'down';
    }
  }
}
```

- [ ] **Step 7: HealthController 작성 (`src/health/health.controller.ts`)**

```ts
import { Controller, Get } from '@nestjs/common';
import { HealthResult, HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get()
  check(): Promise<HealthResult> {
    return this.service.check();
  }
}
```

- [ ] **Step 8: AppModule에 RedisModule + HealthController/Service 등록**

`apps/backend/src/app.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envSchema } from './config/env';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (raw) => envSchema.parse(raw),
    }),
    PrismaModule,
    RedisModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService],
})
export class AppModule {}
```

- [ ] **Step 9: 테스트 재실행 → PASS 확인**

```bash
pnpm --filter @on-trip/backend test health.controller
```

Expected: PASS.

- [ ] **Step 10: 서버 기동 후 curl로 검증**

```bash
pnpm dev:be
```

별도 터미널:

```bash
curl http://localhost:3000/health
```

Expected: `{"ok":true,"db":"up","redis":"up"}`. Ctrl+C로 서버 종료.

- [ ] **Step 11: 커밋**

```bash
git add apps/backend
git commit -m "feat(backend): add redis + health endpoint with db/redis ping"
```

---

### Task 7: Swagger(OpenAPI) 노출

**Files:**
- Modify: `apps/backend/src/main.ts`
- Modify: `apps/backend/src/health/health.controller.ts` (ApiTags 추가)

- [ ] **Step 1: Swagger 패키지 설치**

```bash
pnpm --filter @on-trip/backend add @nestjs/swagger
```

- [ ] **Step 2: `apps/backend/src/main.ts` 수정**

```ts
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('On-Trip API')
    .setDescription('On-Trip backend API spec')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs-json',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

- [ ] **Step 3: HealthController에 ApiTags 추가**

`apps/backend/src/health/health.controller.ts` 첫줄에 import 추가 후 데코레이터 부착:

```ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthResult, HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get()
  check(): Promise<HealthResult> {
    return this.service.check();
  }
}
```

- [ ] **Step 4: 서버 기동 후 OpenAPI JSON 확인**

```bash
pnpm dev:be
```

별도 터미널:

```bash
curl -s http://localhost:3000/api/docs-json | head -c 200
```

Expected: `{"openapi":"3.0.0","info":{"title":"On-Trip API"...` 로 시작하는 JSON. Ctrl+C.

- [ ] **Step 5: 커밋**

```bash
git add apps/backend
git commit -m "feat(backend): expose openapi spec at /api/docs and /api/docs-json"
```

---

### Task 8: 모바일 Expo 부트스트랩

**Files:**
- Create: `apps/mobile/` (Expo 기본 구조)
- Modify: `apps/mobile/package.json` (이름 + 스크립트)

- [ ] **Step 1: Expo 앱 생성**

```bash
cd /Users/baeg-yujin/Desktop/project/on-trip
pnpm dlx create-expo-app@latest apps/mobile --template blank-typescript
```

- [ ] **Step 2: `apps/mobile/package.json` — 이름·스크립트 추가**

`name`을 `@on-trip/mobile`로 바꾸고, scripts에 다음 추가:

```json
{
  "name": "@on-trip/mobile",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "echo 'lint configured later' && exit 0",
    "test": "echo 'no mobile tests yet' && exit 0"
  }
}
```

(start/android/ios/web 스크립트는 유지)

- [ ] **Step 3: 루트에서 install 재실행 (workspace 인식)**

```bash
cd /Users/baeg-yujin/Desktop/project/on-trip
pnpm install
```

- [ ] **Step 4: typecheck 통과 확인**

```bash
pnpm --filter @on-trip/mobile typecheck
```

Expected: 0 errors.

- [ ] **Step 5: 커밋**

```bash
git add apps/mobile pnpm-lock.yaml
git commit -m "chore(mobile): bootstrap expo blank typescript template"
```

---

### Task 9: 디자인 토큰 (키치 스티커 테마)

**Files:**
- Create: `apps/mobile/src/design/tokens.ts`

- [ ] **Step 1: 디렉토리 생성 + 파일 작성**

```bash
mkdir -p apps/mobile/src/design
```

`apps/mobile/src/design/tokens.ts`:

```ts
export const colors = {
  primary: '#FFE066',     // 노랑
  accentRed: '#FF5A5A',   // 코랄 레드
  accentLime: '#B5E48C',  // 라임
  accentPink: '#FFB3D9',  // 핑크
  outline: '#2A2A2A',     // 소프트 블랙
  background: '#FFFCEB',  // 크림 화이트
  surface: '#FFFFFF',
  textPrimary: '#2A2A2A',
  textSecondary: '#6B6B6B',
  danger: '#E63946',
  success: '#52B788',
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const stickerShadow = {
  // 키치 스티커: 4px 박스 그림자 (offset 4/4, blur 0)
  shadowColor: colors.outline,
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 6, // android
} as const;

export const stroke = {
  width: 2.5,
  color: colors.outline,
} as const;

export const typography = {
  display: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34 },
  title: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
  body: { fontSize: 15, fontWeight: '500' as const, lineHeight: 22 },
  caption: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
} as const;

export const tokens = { colors, radii, spacing, stickerShadow, stroke, typography };
export type Tokens = typeof tokens;
```

- [ ] **Step 2: typecheck**

```bash
pnpm --filter @on-trip/mobile typecheck
```

Expected: 0 errors.

- [ ] **Step 3: 커밋**

```bash
git add apps/mobile/src/design/tokens.ts
git commit -m "feat(mobile): add kitsch sticker design tokens"
```

---

### Task 10: 모바일 네비게이션 스캐폴드 (Map / Activity / My)

**Files:**
- Create: `apps/mobile/src/screens/MapScreen.tsx`
- Create: `apps/mobile/src/screens/ActivityScreen.tsx`
- Create: `apps/mobile/src/screens/MyScreen.tsx`
- Create: `apps/mobile/src/navigation/RootNavigator.tsx`
- Modify: `apps/mobile/App.tsx`

- [ ] **Step 1: 네비게이션 패키지 설치**

```bash
pnpm --filter @on-trip/mobile add @react-navigation/native @react-navigation/native-stack
pnpm --filter @on-trip/mobile add react-native-screens react-native-safe-area-context
```

- [ ] **Step 2: 세 화면 placeholder 작성**

`apps/mobile/src/screens/MapScreen.tsx`:

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../design/tokens';

export function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>지도</Text>
      <Text style={styles.body}>S3에서 카카오맵으로 교체됩니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: spacing.lg },
  title: { ...typography.display, color: colors.textPrimary, marginBottom: spacing.md },
  body: { ...typography.body, color: colors.textSecondary },
});
```

`apps/mobile/src/screens/ActivityScreen.tsx`:

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../design/tokens';

export function ActivityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>활동</Text>
      <Text style={styles.body}>받은 콕 / 보낸 콕 / 매칭 (S4)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: spacing.lg },
  title: { ...typography.display, color: colors.textPrimary, marginBottom: spacing.md },
  body: { ...typography.body, color: colors.textSecondary },
});
```

`apps/mobile/src/screens/MyScreen.tsx`:

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../design/tokens';

export function MyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>마이</Text>
      <Text style={styles.body}>내 프로필 (S2)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: spacing.lg },
  title: { ...typography.display, color: colors.textPrimary, marginBottom: spacing.md },
  body: { ...typography.body, color: colors.textSecondary },
});
```

- [ ] **Step 3: RootNavigator 작성**

`apps/mobile/src/navigation/RootNavigator.tsx`:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityScreen } from '../screens/ActivityScreen';
import { MapScreen } from '../screens/MapScreen';
import { MyScreen } from '../screens/MyScreen';

export type RootStackParamList = {
  Map: undefined;
  Activity: undefined;
  My: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'On-Trip' }} />
        <Stack.Screen name="Activity" component={ActivityScreen} options={{ title: '활동' }} />
        <Stack.Screen name="My" component={MyScreen} options={{ title: '마이' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

- [ ] **Step 4: `apps/mobile/App.tsx` 교체**

```tsx
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
```

- [ ] **Step 5: typecheck**

```bash
pnpm --filter @on-trip/mobile typecheck
```

Expected: 0 errors.

- [ ] **Step 6: 모바일 dev 서버 기동 + 시뮬레이터/Expo Go에서 화면 진입 확인**

```bash
pnpm dev:mobile
```

Expected: Expo dev tools 기동. iOS 시뮬레이터 또는 Expo Go로 열면 "지도" 화면이 보임. Ctrl+C로 종료.

- [ ] **Step 7: 커밋**

```bash
git add apps/mobile pnpm-lock.yaml
git commit -m "feat(mobile): add root stack navigator with map/activity/my placeholder screens"
```

---

### Task 11: 모바일 상태 관리 (Zustand + TanStack Query)

**Files:**
- Create: `apps/mobile/src/stores/index.ts`
- Create: `apps/mobile/src/api/queryClient.ts`
- Modify: `apps/mobile/App.tsx`

- [ ] **Step 1: 패키지 설치**

```bash
pnpm --filter @on-trip/mobile add zustand @tanstack/react-query
```

- [ ] **Step 2: Zustand placeholder 스토어**

`apps/mobile/src/stores/index.ts`:

```ts
import { create } from 'zustand';

type AppState = {
  // S2에서 인증 토큰/유저 등이 들어옴
  isReady: boolean;
  setReady: (ready: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  isReady: false,
  setReady: (ready) => set({ isReady: ready }),
}));
```

- [ ] **Step 3: QueryClient 생성**

`apps/mobile/src/api/queryClient.ts`:

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});
```

- [ ] **Step 4: App.tsx에 QueryClientProvider 통합**

```tsx
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from './src/api/queryClient';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootNavigator />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 5: typecheck**

```bash
pnpm --filter @on-trip/mobile typecheck
```

Expected: 0 errors.

- [ ] **Step 6: 커밋**

```bash
git add apps/mobile pnpm-lock.yaml
git commit -m "feat(mobile): wire zustand store and tanstack query client"
```

---

### Task 12: `packages/shared` — OpenAPI 타입 자동 생성

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/scripts/gen-types.sh`

- [ ] **Step 1: 디렉토리 + package.json**

```bash
mkdir -p packages/shared/src packages/shared/scripts
```

`packages/shared/package.json`:

```json
{
  "name": "@on-trip/shared",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "gen": "bash scripts/gen-types.sh",
    "typecheck": "tsc --noEmit",
    "lint": "echo 'no lint' && exit 0",
    "test": "echo 'no tests' && exit 0"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 2: `packages/shared/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 3: `packages/shared/src/index.ts` 초기 (타입 생성 전 placeholder)**

```ts
// 생성된 OpenAPI 타입은 src/openapi.d.ts에 위치 (gen 스크립트가 만듦).
// S1 시점 placeholder — 백엔드 health 응답 타입을 수동으로 export.
export type HealthResult = {
  ok: boolean;
  db: 'up' | 'down';
  redis: 'up' | 'down';
};
```

- [ ] **Step 4: 타입 생성 스크립트 작성**

`packages/shared/scripts/gen-types.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

OUT="$(dirname "$0")/../src/openapi.d.ts"
URL="${OPENAPI_URL:-http://localhost:3000/api/docs-json}"

echo "▶ generating openapi types from $URL → $OUT"
pnpm dlx openapi-typescript "$URL" -o "$OUT"
echo "✓ done"
```

```bash
chmod +x packages/shared/scripts/gen-types.sh
```

- [ ] **Step 5: 백엔드 기동 후 타입 생성 시도**

```bash
pnpm dev:be
```

별도 터미널:

```bash
cd /Users/baeg-yujin/Desktop/project/on-trip
pnpm --filter @on-trip/shared gen
```

Expected: `packages/shared/src/openapi.d.ts` 생성, `paths['/health']`에 GET 정의 포함됨. 백엔드 Ctrl+C.

- [ ] **Step 6: `packages/shared/src/index.ts` 갱신 — 생성된 타입 re-export**

```ts
export type { paths, components } from './openapi';

export type HealthResult = {
  ok: boolean;
  db: 'up' | 'down';
  redis: 'up' | 'down';
};
```

(주의: `openapi.d.ts`는 `import type` 시 `./openapi` 경로로 인식됨)

- [ ] **Step 7: typecheck**

```bash
pnpm --filter @on-trip/shared typecheck
```

Expected: 0 errors.

- [ ] **Step 8: 모바일에서 사용 가능하도록 의존 추가**

`apps/mobile/package.json`의 `dependencies`에 추가:

```json
"@on-trip/shared": "workspace:*"
```

루트에서 install:

```bash
pnpm install
```

- [ ] **Step 9: 커밋**

```bash
git add packages/shared apps/mobile/package.json pnpm-lock.yaml
git commit -m "feat(shared): add openapi-typescript generator and shared package"
```

---

### Task 13: 모바일 → 백엔드 health check E2E

**Files:**
- Create: `apps/mobile/src/api/client.ts`
- Modify: `apps/mobile/src/screens/MapScreen.tsx`
- Modify: `apps/mobile/app.json` (`extra` 추가)

- [ ] **Step 1: `expo-constants` 설치 확인 (Expo 템플릿에 기본 포함이지만 명시)**

```bash
pnpm --filter @on-trip/mobile add expo-constants
```

- [ ] **Step 2: API 클라이언트 작성**

`apps/mobile/src/api/client.ts`:

```ts
import Constants from 'expo-constants';
import type { HealthResult } from '@on-trip/shared';

const baseUrl = (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? 'http://localhost:3000';

export async function fetchHealth(): Promise<HealthResult> {
  const res = await fetch(`${baseUrl}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return (await res.json()) as HealthResult;
}
```

- [ ] **Step 3: `apps/mobile/app.json`의 `expo` 객체 안에 `extra` 추가**

```json
"extra": {
  "apiBaseUrl": "http://localhost:3000"
}
```

(시뮬레이터에서는 `localhost`가 host의 localhost. 실기기/Expo Go에서는 호스트 PC의 LAN IP — 예: `http://192.168.0.10:3000`. README에 안내)

- [ ] **Step 4: MapScreen에서 헬스체크 호출**

`apps/mobile/src/screens/MapScreen.tsx`:

```tsx
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { fetchHealth } from '../api/client';
import { colors, radii, spacing, stickerShadow, stroke, typography } from '../design/tokens';

export function MapScreen() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>지도</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>서버 상태</Text>
        {isPending && <ActivityIndicator />}
        {isError && <Text style={styles.error}>{(error as Error).message}</Text>}
        {data && (
          <>
            <Text style={styles.body}>ok: {String(data.ok)}</Text>
            <Text style={styles.body}>db: {data.db}</Text>
            <Text style={styles.body}>redis: {data.redis}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: spacing.lg, gap: spacing.lg },
  title: { ...typography.display, color: colors.textPrimary },
  card: {
    backgroundColor: colors.surface,
    borderColor: stroke.color, borderWidth: stroke.width,
    borderRadius: radii.lg,
    padding: spacing.lg,
    minWidth: 240,
    alignItems: 'flex-start',
    ...stickerShadow,
  },
  cardTitle: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.sm },
  body: { ...typography.body, color: colors.textPrimary },
  error: { ...typography.body, color: colors.danger },
});
```

- [ ] **Step 5: typecheck**

```bash
pnpm --filter @on-trip/mobile typecheck
```

Expected: 0 errors.

- [ ] **Step 6: E2E 검증**

터미널 1:
```bash
pnpm db:up
pnpm dev:be
```

터미널 2:
```bash
pnpm dev:mobile
```

iOS 시뮬레이터 또는 Expo Go에서 앱을 열면 지도 화면에 "ok: true / db: up / redis: up" 카드(키치 스티커 스타일)가 표시되어야 함.

- [ ] **Step 7: 커밋**

```bash
git add apps/mobile
git commit -m "feat(mobile): render server health on map screen via shared types"
```

---

### Task 14: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: 워크플로 작성**

`.github/workflows/ci.yml`:

```yaml
name: ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: ontrip
          POSTGRES_PASSWORD: ontrip
          POSTGRES_DB: ontrip
        ports: ["5432:5432"]
        options: >-
          --health-cmd "pg_isready -U ontrip -d ontrip"
          --health-interval 5s
          --health-timeout 3s
          --health-retries 10
      redis:
        image: redis:7-alpine
        ports: ["6379:6379"]
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 5s
          --health-timeout 3s
          --health-retries 10

    env:
      DATABASE_URL: postgresql://ontrip:ontrip@localhost:5432/ontrip
      REDIS_URL: redis://localhost:6379
      JWT_SECRET: ci-test-secret-change-me
      NODE_ENV: test

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Prisma migrate
        run: pnpm --filter @on-trip/backend prisma migrate deploy

      - name: Typecheck
        run: pnpm typecheck

      - name: Test
        run: pnpm test
```

- [ ] **Step 2: 로컬에서 동일 명령으로 사전 검증**

```bash
pnpm typecheck
pnpm test
```

Expected: 두 명령 모두 통과.

- [ ] **Step 3: 커밋**

```bash
git add .github/workflows/ci.yml
git commit -m "chore(ci): add github actions ci with postgres and redis services"
```

---

### Task 15: README — 로컬 개발 가이드 + S1 완료 보고

**Files:**
- Modify: `README.md`

- [ ] **Step 1: README 갱신**

```markdown
# On-Trip

여행지에서 같은 거점에 있는 다른 일행을 만나는 GPS 기반 매칭 앱.

- 스펙: [`docs/superpowers/specs/2026-04-29-on-trip-prd.md`](docs/superpowers/specs/2026-04-29-on-trip-prd.md)
- 현재 상태: **S1 (프로젝트 셋업) 완료** — FE/BE/DB/Redis/OpenAPI/디자인 토큰 베이스라인.

## 모노레포 구조

```
apps/backend     — NestJS + Prisma + Redis
apps/mobile      — Expo (React Native) + TypeScript
packages/shared  — OpenAPI 자동 생성 타입
```

## 사전 요구사항

- Node 20 (`.nvmrc` 참고, `nvm use`)
- pnpm 9 (`corepack enable && corepack prepare pnpm@9 --activate`)
- Docker Desktop (Postgres + Redis 로컬 기동용)

## 로컬 셋업

```bash
pnpm install

# 백엔드 환경변수
cp apps/backend/.env.example apps/backend/.env

# DB/Redis 기동
pnpm db:up

# 첫 마이그레이션 적용
pnpm --filter @on-trip/backend prisma migrate deploy

# 백엔드 (포트 3000)
pnpm dev:be

# 모바일 (별도 터미널)
pnpm dev:mobile
```

### 실기기/Expo Go에서 백엔드 연결

`apps/mobile/app.json`의 `extra.apiBaseUrl`을 호스트 PC의 LAN IP로 바꿔주세요. 예:

```json
"extra": { "apiBaseUrl": "http://192.168.0.10:3000" }
```

확인: 호스트에서 `ipconfig getifaddr en0` (macOS) 또는 `ip addr` (Linux).

## 자주 쓰는 명령

| 명령 | 설명 |
|---|---|
| `pnpm db:up` | Postgres + Redis 컨테이너 기동 |
| `pnpm db:down` | 컨테이너 정지 |
| `pnpm dev:be` | 백엔드 dev 서버 (NestJS, watch) |
| `pnpm dev:mobile` | Expo dev tools |
| `pnpm typecheck` | 전체 워크스페이스 typecheck |
| `pnpm test` | 전체 워크스페이스 테스트 |
| `pnpm --filter @on-trip/backend prisma:migrate -- --name <name>` | DB 마이그레이션 생성·적용 |
| `pnpm --filter @on-trip/shared gen` | 백엔드 OpenAPI → 타입 재생성 (백엔드 기동 중일 때) |

## 다음 스프린트 (S2)

회원가입 + PASS 본인인증 + 개인 프로필 CRUD. 별도 계획 문서로 작성 예정.
```

- [ ] **Step 2: 커밋**

```bash
git add README.md
git commit -m "docs: write s1 setup guide in readme"
```

---

### Task 16: S1 완료 검증 + 태깅

- [ ] **Step 1: 깨끗한 상태에서 전체 빌드/테스트**

```bash
pnpm db:down
pnpm db:up
pnpm install
pnpm --filter @on-trip/backend prisma migrate deploy
pnpm typecheck
pnpm test
```

Expected: 모두 통과.

- [ ] **Step 2: 모바일 ↔ 백엔드 E2E 시각 검증 (Task 13 재실행)**

지도 화면에 `ok: true / db: up / redis: up` 카드가 보이는지 확인.

- [ ] **Step 3: 깃 태그**

```bash
git tag s1-complete
```

(아직 GitHub remote가 없으면 푸시는 S2 시작 전에 사용자가 직접 결정)

---

## Self-Review Notes

- **스펙 커버리지:** 이 계획은 PRD §15.3의 S1만 다룸 (의도된 스코프). PASS PoC와 카카오맵 PoC는 PRD에 S1 작업으로 적혔으나, 본 계획에서는 의존성/외부 계약 이슈로 S2 시작과 함께 진행하도록 미룸 — 본 계획 상단 "Out of Scope"에 명시. (S2 계획에서 첫 태스크로 흡수)
- **타입 일관성:** `HealthResult`는 백엔드(`apps/backend/src/health/health.service.ts`) → 공유(`packages/shared/src/index.ts`) → 모바일(`apps/mobile/src/api/client.ts`) 모두 동일 시그니처 사용 확인.
- **placeholder 점검:** "구체화 필요" 같은 모호한 단계 없음. 모든 코드 블록은 그대로 사용 가능.

## 다음 계획 (S2 미리보기)

S1 완료 후 다음 계획을 별도로 작성:
- **S2 — 가입·프로필 (W3–4):** PASS 본인인증 PoC 흡수 + 회원가입/JWT/User CRUD/온보딩(S-01)/마이(S-11) 일부.
