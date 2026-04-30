# On-Trip Backend Agent Handoff

> 프론트엔드 레포의 Markdown 문서들을 기준으로 백엔드 AI agent에게 전달하기 위한 요약 문서입니다.
> 원문 기준일: 2026-04-29

## 1. 프로젝트 한 줄 정의

On-Trip은 여행지에서 같은 거점에 있는 다른 일행을 발견하고, 서로 `콕`을 보내면 자동 매칭되어 1:1 채팅으로 이어지는 GPS 기반 그룹 매칭 앱입니다.

핵심은 데이팅 앱이 아니라 `여행지에서 일행끼리 즉흥적으로 합류하는 경험`입니다. 사용자는 개인 프로필을 만들고, 여행 단위의 임시 일행 등록(`Trip`)을 올린 뒤, 지도/거점 상세에서 다른 일행을 탐색합니다.

## 2. 참고한 프론트 문서

- `docs/superpowers/specs/2026-04-29-on-trip-prd.md`
  - 제품 목표, 사용자 플로우, 데이터 모델, 기능 요구사항, 백엔드 책임, 12주 스프린트 계획의 기준 문서입니다.
- `docs/superpowers/specs/2026-04-29-on-trip-frontend-design-spec.md`
  - 화면별 컴포넌트와 상태를 API 계약 관점에서 참고할 문서입니다.
- `design-system/on-trip/pages/*.md`
  - `map`, `region-detail`, `trip-profile`, `poke-modal`, `activity`, `chat` 화면에서 필요한 상태, 빈 상태, 오류 상태, 버튼 비활성 조건을 확인할 수 있습니다.
- `docs/superpowers/plans/2026-04-29-s1-project-setup.md`
  - 원문은 NestJS/PostgreSQL 기준입니다. 현재 백엔드 스택은 이 handoff 문서의 Express/MongoDB 기준이 우선합니다.
- `mockup/README.md`, `docs/superpowers/specs/2026-04-29-on-trip-mockup-web-preview-design.md`
  - 현재 `mockup/`은 디자인 검수용 throwaway 웹 목업입니다. 백엔드 연동 대상이 아닙니다.

## 3. MVP 핵심 범위

MVP에는 다음 기능이 포함됩니다.

- PASS 본인인증 기반 가입
- 개인 프로필 생성
- 지도에서 광역/거점별 활성 여행자 수 표시
- 일행 등록(`Trip`) 및 자동 만료
- 거점 상세에서 활성 일행 목록 조회
- 콕 보내기, 받은 콕 열람, 맞콕 시 매칭
- 매칭 즉시 1:1 채팅방 생성
- 채팅 메시지와 콕 한마디의 외부 연락처 자동 마스킹
- 신고, 차단, 누적 신고 기반 정지
- 가입 보너스 1,000코인, 콕 100코인, 받은 콕 프로필 열람 500코인

V2 범위는 인앱 결제, 슈퍼콕, 프로필 부스트, 그룹 채팅, 사진 사전 검수 강화입니다. MVP에서는 충전 UI가 있더라도 실제 결제는 열지 않습니다.

## 4. 백엔드 기술 스택 결정

사용자가 익숙한 `fundlounge-backend` 스타일을 기준으로 백엔드 스택을 조정합니다.
PRD 원문에 있는 NestJS/PostgreSQL/Prisma/Redis 조합은 이 문서에서는 폐기하고, 아래 스택을 기준으로 합니다.

- Runtime: Node.js 20
- Framework: Express 4.x
- Language: JavaScript(CommonJS) 우선. TypeScript는 익숙해진 뒤 V2에서 검토해도 됩니다.
- DB: MongoDB
- DB Client: native `mongodb` driver. `fundlounge-backend`처럼 `MongoClient`, `ObjectId`, `collection(name)` helper를 사용합니다.
- Cache/Count: MVP는 MongoDB 집계 + TTL cache collection. Redis는 필수 스택에서 제외합니다.
- Realtime: Socket.IO 또는 polling/SSE. 채팅 MVP는 Socket.IO를 권장합니다.
- Push: FCM
- Storage: AWS S3 + CloudFront
- File Upload: `multer`, `multer-s3`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
- Infra: AWS Seoul Region. `fundlounge-backend`처럼 Serverless/Lambda + API Gateway도 가능하고, 단순 EC2/ECS 배포도 가능합니다.
- API contract: Express route 목록 + request/response DTO 문서 우선 작성. Swagger/OpenAPI는 선택입니다.

S1 목표는 완성 기능이 아니라 `Express + MongoDB + S3 config + healthcheck + FE 연동` 베이스라인입니다.

### 4.1 fundlounge-backend에서 가져올 패턴

`/Users/nahyunho/Documents/GitHub/fundlounge-backend` 확인 결과, 다음 패턴을 On-Trip 백엔드에도 맞추는 것이 좋습니다.

- `app.js`: Express app 생성, `cors`, `express.json`, `express.urlencoded`, root router 연결
- `local.js`: 로컬 포트로 app listen
- `routes/index.js`: 도메인별 router mount
- `routes/*.js`: HTTP endpoint만 담당
- `services/*.js`: DB 접근, 외부 API, S3, 도메인 로직 담당
- `services/db.js`: `MongoClient` connection cache + `collection(collName)` helper
- `services/file.js`: S3 signed URL, multer-s3 upload, get/delete helper
- `ObjectId`는 `mongodb` 패키지에서 직접 사용

On-Trip에서는 이 구조를 유지하되, 인증/에러 처리/트랜잭션은 fundlounge보다 조금 더 엄격히 잡는 것을 권장합니다.

### 4.2 권장 npm dependencies

```json
{
  "dependencies": {
    "@aws-sdk/client-s3": "^3.x",
    "@aws-sdk/s3-request-presigner": "^3.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "express": "^4.x",
    "firebase-admin": "^12.x",
    "jsonwebtoken": "^9.x",
    "mongodb": "^6.x",
    "multer": "^1.x",
    "multer-s3": "^3.x",
    "node-schedule": "^2.x",
    "socket.io": "^4.x",
    "uuid": "^9.x"
  },
  "devDependencies": {
    "nodemon": "^3.x"
  }
}
```

`fundlounge-backend`는 `aws-sdk` v2와 v3를 섞어 쓰지만, 신규 On-Trip은 가능하면 AWS SDK v3로 통일하세요.

## 5. 백엔드 책임

백엔드 agent는 다음을 책임집니다.

- Express 프로젝트 구조와 route/service 모듈 설계
- MongoDB collection 설계와 index 생성 스크립트
- PASS 인증 검증, JWT/refresh token 인증
- API request/response DTO 문서화
- Region/Trip/Poke/ProfileView/Match/Chat/Report/Block/CoinTransaction 도메인 구현
- 지도 인구 카운트 API와 MongoDB TTL cache
- 콕 처리와 맞콕 감지, Match와 ChatRoom 원자적 생성
- Socket.IO 채팅 인증, 방 입장, 메시지 전달, 읽음 처리
- 메시지/콕 한마디 자동 마스킹
- FCM 푸시: 콕 수신, 매칭 성사, 매일 09:00 일정 확인
- 신고/차단/누적 정지 자동화
- CoinTransaction 무결성 보장
- S3 프로필 이미지 업로드 signed URL, 파일 메타데이터 관리
- 최소 운영자 API

프론트 책임은 UI 구현, 카카오맵 렌더링, Expo Location/Notifications 수신, React Query/Zustand 상태 관리, EAS/스토어 배포입니다.

### 5.1 재검토 결론

이 문서는 제품 맥락 전달용으로는 충분하지만, 백엔드 agent가 DB/API를 바로 구현하기에는 원래 버전만으로는 부족합니다. 구현 시에는 아래 원칙을 반드시 반영하세요.

- `Poke`에는 `sender_user_id`뿐 아니라 `sender_trip_id`도 저장해야 합니다. 그래야 보낸 쪽 Trip 만료, 맞콕 판정, Match의 양쪽 Trip 확정이 안전합니다.
- `is_matched` boolean만으로는 상태가 부족합니다. `pending | matched | hidden_expired | cancelled` 상태와 `matched_at`을 사용하세요.
- 코인 차감, 콕 생성, 프로필 열람, 매칭 생성은 MongoDB session transaction 안에서 처리하는 것을 우선합니다. MongoDB standalone 환경이면 최소한 conditional update + idempotency key + 보상 로직을 넣어야 합니다.
- 모든 목록 API는 cursor pagination을 기본으로 합니다.
- FE가 그대로 붙을 수 있게 response DTO와 에러 envelope를 API 문서에 먼저 고정해야 합니다.

## 6. 핵심 도메인 모델

MongoDB collection은 아래 개념 모델을 기준으로 설계하세요. 실제 document field는 `camelCase` 또는 `snake_case` 중 하나로 통일하면 됩니다. fundlounge 코드와 맞추려면 `snake_case`, 신규 프로젝트 가독성을 우선하면 `camelCase`를 권장합니다. 이 문서는 기존 PRD와 맞추기 위해 `snake_case`로 적습니다.

공통 규칙:

- 모든 collection은 MongoDB 기본 `_id: ObjectId`를 primary key로 사용합니다.
- API response에서는 `_id`를 그대로 노출하지 말고 `userId`, `tripId`처럼 문자열로 변환해 반환합니다.
- 삭제는 기본적으로 hard delete보다 `removed_at` 또는 `status` 변경을 우선합니다.
- `created_at`, `updated_at`은 모든 주요 collection에 둡니다.

### users

- `_id`
- `phone_hash`: PASS 결과 기반, 동일 값 1계정만 허용
- `real_name_hash`: 비공개
- `birth_date`: 암호화 저장 필요
- `gender`: PASS 결과
- `nickname`: unique, 2~12자, 한글/영문/숫자
- `bio`: 50자
- `mbti`: nullable
- `profile_image_url`: nullable
- `coin_balance`: 가입 시 1000
- `status`: `active | suspended | withdrawn`
- `created_at`, `updated_at`
- index: unique `phone_hash`, unique `nickname`, `status`

### regions

- `_id`
- `type`: `province | poi`
- `name`
- `parent_region_id`: ObjectId 또는 null
- `center_lat`, `center_lng`
- `radius_m`
- `status`: `active | hidden`
- `created_at`, `updated_at`

초기 POI는 200~300개 큐레이션 예정입니다.

### trips

- `_id`
- `owner_user_id`: ObjectId
- `region_id`: ObjectId, POI 기준
- `party_size`: 1~10
- `gender_composition`: 예: `M2F1`
- `age_range`: 예: `20후`
- `intro`: 50자
- `themes`: `맛집 | 술자리 | 액티비티 | 관광 | 사진` 다중 선택
- `trip_start_date`, `trip_end_date`
- `status`: `active | expired | cancelled`
- `last_active_at`
- `created_at`, `updated_at`

제약: 한 사용자는 동시에 1개의 active Trip만 가질 수 있습니다.

MongoDB에는 partial unique index를 만들 수 있습니다. `trips.createIndex({ owner_user_id: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'active' } })` 형태로 한 사용자 1 active Trip을 보장하세요.

### pokes

- `_id`
- `sender_user_id`: ObjectId
- `sender_trip_id`: ObjectId. 콕 발송 시점의 sender active Trip. PRD 원문에는 없지만 매칭/만료 처리를 위해 필수입니다.
- `receiver_trip_id`: ObjectId
- `receiver_user_id`: ObjectId. receiver Trip owner를 denormalize해 받은 콕 조회를 빠르게 합니다.
- `message_raw`: 50자 원문
- `message_masked`: 서버 마스킹 적용 결과
- `coin_charged`: 100
- `status`: `pending | matched | hidden_expired | cancelled`
- `matched_at`: nullable
- `created_at`

제약: 동일 sender가 동일 receiver_trip에 중복 콕을 보낼 수 없습니다. receiver가 새 Trip을 만들면 새 콕 가능.

### profile_views

- `_id`
- `viewer_user_id`: ObjectId
- `target_user_id`: ObjectId
- `source_poke_id`: ObjectId. 어떤 받은 콕을 열람했는지 추적
- `coin_charged`: 500
- `created_at`

제약: `viewer_user_id + target_user_id` unique. 이미 본 프로필 재열람은 무료입니다.

### matches

- `_id`
- `trip_a_id`, `trip_b_id`: ObjectId
- `user_a_id`, `user_b_id`: ObjectId
- `poke_a_id`, `poke_b_id`: ObjectId
- `chat_room_id`: ObjectId
- `matched_at`
- `status`: `active | ended`
- `created_at`, `updated_at`

`trip_a_id`, `trip_b_id`는 문자열 정렬 기준으로 canonicalize해서 중복 Match를 막습니다.

### chat_rooms / messages

`chat_rooms`

- `_id`
- `match_id`: ObjectId
- `user_a_id`, `user_b_id`: ObjectId
- `last_message_at`
- `ended_at`
- `created_at`, `updated_at`

`messages`

- `_id`
- `chat_room_id`: ObjectId
- `sender_user_id`: ObjectId
- `raw_body`: 원문, 신고/운영자 열람용
- `masked_body`: 수신자에게 전달되는 마스킹 처리 본문
- `mask_detected`: boolean
- `created_at`

발신자 화면에는 원문을 보여주고, 수신자 화면에는 마스킹된 본문을 보여줘야 합니다.

### reports / blocks / coin_transactions

`reports`

- `_id`
- `reporter_user_id`: ObjectId
- `target_user_id`: ObjectId
- `category`: `spam_fraud | inappropriate_message | abuse | nudity | other`
- `detail`
- `related_chat_id`: ObjectId 또는 null
- `related_message_id`: ObjectId 또는 null
- `status`: `pending | reviewed | resolved`
- `created_at`

`blocks`

- `_id`
- `blocker_user_id`: ObjectId
- `blocked_user_id`: ObjectId
- `created_at`
- unique: `blocker_user_id + blocked_user_id`

`coin_transactions`

- `_id`
- `user_id`: ObjectId
- `delta`
- `reason`: `signup_bonus | poke | profile_view | refund | admin_grant`
- `related_type`: `poke | profile_view | report | admin | signup`
- `related_id`: ObjectId 또는 string
- `idempotency_key`: nullable, 중복 요청 방지용
- `balance_after`
- `created_at`

코인 차감은 반드시 트랜잭션으로 처리하고, 잔액 부족/중복 요청/동시 요청을 방지해야 합니다.

### 6.1 구현 시 추가로 필요한 collection

PRD의 개념 모델에는 없지만 MVP 백엔드 구현에는 아래 collection이 필요합니다.

#### auth_sessions

- refresh token rotation과 강제 로그아웃을 위한 collection입니다.
- 필드: `_id`, `user_id`, `refresh_token_hash`, `device_id`, `expires_at`, `revoked_at`, `created_at`.
- index: `user_id`, unique `refresh_token_hash`, TTL 후보 `expires_at`.

#### device_tokens

- FCM 푸시 발송 대상입니다.
- 필드: `_id`, `user_id`, `platform`, `fcm_token`, `device_id`, `last_seen_at`, `revoked_at`.
- unique 후보: `fcm_token`.

#### chat_participants

- 1:1 채팅이라도 읽음 처리와 나가기/차단 상태를 단순하게 관리하려면 참여자 collection이 낫습니다.
- 필드: `chat_room_id`, `user_id`, `last_read_at`, `left_at`, `created_at`.
- unique: `chat_room_id + user_id`.

#### user_moderation_identities

- 정지된 사용자의 재가입 필터링용입니다.
- 필드: `_id`, `phone_hash`, `device_id`, `reason`, `expires_at`, `created_at`.
- 개인정보 법적 검토가 필요하므로 보관 기간을 명시해야 합니다.

#### files

- 프로필 이미지와 운영 파일의 S3 metadata collection입니다.
- 필드: `_id`, `owner_user_id`, `target_type`, `target_id`, `bucket`, `s3_key`, `mime_type`, `size`, `status`, `created_at`, `removed_at`.
- 실제 파일은 S3에 두고, MongoDB에는 key와 메타데이터만 저장합니다.

#### population_caches

- 지도 인구 카운트 60초 캐시용 collection입니다.
- 필드: `_id`, `cache_key`, `zoom_bucket`, `bounds_hash`, `pins`, `expires_at`, `created_at`.
- TTL index: `expires_at`.

### 6.2 관계와 제약

- `users 1:N trips`
- `regions 1:N trips`
- `trips(sender) 1:N pokes`
- `trips(receiver) 1:N pokes`
- `pokes 0:N profile_views`로 추적할 수 있지만 무료 재열람 기준은 `viewer_user_id + target_user_id` unique입니다.
- `matches 1:1 chat_rooms`
- `chat_rooms 1:N messages`
- `chat_rooms 1:N chat_participants`
- `users 1:N coin_transactions`
- `users 1:N reports(reporter)`, `users 1:N reports(target)`
- `users 1:N blocks(blocker)`, `users 1:N blocks(blocked)`

MongoDB 구현 메모:

- 한 사용자 1 active Trip은 partial unique index로 보장합니다.
- Match 중복 방지는 `trip_pair_key: "<lowerTripId>:<higherTripId>"`를 저장하고 unique index를 둡니다.
- `pokes.createIndex({ sender_user_id: 1, receiver_trip_id: 1 }, { unique: true })`로 중복 콕을 막습니다.
- `coin_transactions.createIndex({ idempotency_key: 1 }, { unique: true, sparse: true })`는 모바일 중복 탭/재시도 방지용입니다.
- 여러 collection을 동시에 바꾸는 콕/매칭/코인 로직은 MongoDB replica set 또는 Atlas에서 `session.withTransaction`으로 처리하세요.

## 7. 필수 인덱스

- `trips({ region_id: 1, status: 1, last_active_at: -1 })`: 거점별 활성 일행 조회
- `trips({ owner_user_id: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'active' } })`: 한 사용자 1 active Trip
- `pokes({ receiver_user_id: 1, status: 1, created_at: -1 })`: 받은 콕 목록
- `pokes({ sender_user_id: 1, created_at: -1 })`: 보낸 콕 목록
- `pokes({ sender_user_id: 1, receiver_trip_id: 1 }, { unique: true })`: 중복 콕 차단
- `pokes({ sender_trip_id: 1, receiver_trip_id: 1, status: 1 })`: 맞콕 탐지
- `profile_views({ viewer_user_id: 1, target_user_id: 1 }, { unique: true })`: 재열람 무료 처리
- `regions({ type: 1, parent_region_id: 1 })`: 행정구역에서 POI 탐색
- `messages({ chat_room_id: 1, created_at: -1 })`: 채팅 pagination
- `chat_participants({ user_id: 1, chat_room_id: 1 })`: 내 채팅방 목록/권한 검사
- `coin_transactions({ user_id: 1, created_at: -1 })`: 코인 내역
- `coin_transactions({ idempotency_key: 1 }, { unique: true, sparse: true })`: 중복 요청 방지
- `population_caches({ expires_at: 1 }, { expireAfterSeconds: 0 })`: 지도 인구 캐시 TTL

## 7.1 DB 구조 평가

MongoDB 구조는 PRD의 큰 엔티티를 모두 collection으로 옮기되, 조회 성능을 위해 일부 필드를 denormalize합니다. 특히 `pokes.receiver_user_id`, `matches.trip_pair_key`, `chat_participants`, `device_tokens`, `auth_sessions`, `files`, `population_caches`는 백엔드에서 빠뜨리면 API/운영 구현이 흔들립니다.

## 8. FE가 기대하는 주요 API 초안

정확한 경로는 백엔드에서 Express router와 API 문서로 확정하되, 다음 기능 단위는 필요합니다.

공통 규칙:

- 인증 필요 API는 `Authorization: Bearer <accessToken>`을 사용합니다.
- 목록 API는 `cursor`, `limit` 기반 pagination을 사용합니다.
- 에러 응답은 아래 envelope로 통일합니다.

```json
{
  "code": "INSUFFICIENT_COINS",
  "message": "코인이 부족해요.",
  "details": {},
  "requestId": "req_..."
}
```

### Auth / User

- `POST /auth/pass/start`: PASS 인증 시작
- `POST /auth/pass/verify`: PASS 결과 검증
- `POST /auth/signup`: 닉네임/소개/MBTI/사진 등록 및 가입 보너스 지급
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /me`
- `PATCH /me`
- `DELETE /me`: 탈퇴 요청, 30일 보관 후 영구 삭제 정책 반영

### Region / Map

- `GET /regions`: 광역/POI 목록
- `GET /regions/nearby?lat=&lng=`: GPS 기준 가까운 POI
- `GET /map/population?bounds=&zoom=`: 지도 줌/영역 기준 인구 핀
- `GET /regions/:regionId/trips`: 거점 상세의 active Trip 목록

지도 인구 카운트는 MongoDB `population_caches` collection의 60초 TTL cache를 사용합니다. 사용자가 지도를 크게 이동하면 FE가 재요청합니다.

`GET /map/population` 응답 예시:

```json
{
  "pins": [
    {
      "regionId": "region_...",
      "type": "poi",
      "name": "광안리",
      "count": 24,
      "centerLat": 35.153,
      "centerLng": 129.118,
      "radiusM": 800
    }
  ],
  "cachedUntil": "2026-04-29T12:01:00.000Z"
}
```

`GET /regions/:regionId/trips`는 카드 렌더링에 필요한 안전한 공개 정보만 반환합니다.

```json
{
  "items": [
    {
      "tripId": "trip_...",
      "owner": {
        "userId": "user_...",
        "nickname": "여행러",
        "mbti": "ENFP",
        "profileImageUrl": null
      },
      "partySize": 3,
      "genderComposition": "M2F1",
      "ageRange": "20후",
      "themes": ["맛집", "술자리"],
      "intro": "광안리 맛집 도장깨기 같이 하실 분!",
      "viewerState": "can_poke"
    }
  ],
  "nextCursor": null
}
```

### Trip

- `POST /trips`: 여행왔어요 등록
- `GET /trips/me/active`
- `PATCH /trips/:tripId`: 등록 후 24시간 이내 1회 수정
- `POST /trips/:tripId/cancel`
- `GET /trips/:tripId`: 일행 프로필 상세

Trip 만료 정책:

- 선택한 여행 종료일 23:59에 자동 비공개
- 마지막 활동 후 24시간 무반응 시 자동 비공개
- 매일 09:00 푸시로 일정 확인 요청
- 만료 후에도 매칭/채팅방은 유지

### Poke / Activity

- `POST /pokes`: 콕 보내기, 100코인 차감
- `GET /pokes/received`: 받은 콕 목록
- `GET /pokes/sent`: 보낸 콕 목록
- `POST /profile-views`: 받은 콕 발신자 프로필 열람, 500코인 차감 또는 재열람 무료. body는 `pokeId` 기준을 권장합니다.
- `POST /pokes/:pokeId/reciprocate`: 받은 콕에 맞콕. 내부적으로 reciprocal Poke를 만들고 Match를 시도합니다.
- `GET /matches`: 매칭 목록

받은 콕 가림 규칙:

- 열람 전에는 발신자 닉네임/사진/한줄소개 노출 금지
- 노출 가능: 일행 인원, 성별 구성, 나이대, 컨셉, 지역, 한마디 첫 10자
- 한마디가 없으면 `(메시지 없음)` 상태로 전달

콕 보내기 전제:

- sender는 active Trip을 보유해야 합니다.
- sender active Trip이 없으면 `ACTIVE_TRIP_REQUIRED`를 반환하고, FE는 `여행 왔어요` 등록 화면으로 유도합니다.

`POST /pokes` 응답은 매칭 성사 여부를 즉시 알려줘야 합니다.

```json
{
  "pokeId": "poke_...",
  "coinBalance": 900,
  "chargedAmount": 100,
  "matchCreated": true,
  "matchId": "match_...",
  "chatRoomId": "chat_..."
}
```

`GET /pokes/received` 열람 전 응답에는 발신자 정체를 넣지 않습니다.

```json
{
  "items": [
    {
      "pokeId": "poke_...",
      "preview": {
        "regionName": "광안리",
        "partySize": 3,
        "genderComposition": "M2F1",
        "ageRange": "20후",
        "themes": ["맛집", "술자리"],
        "messagePreview": "광안리 맛집..."
      },
      "profileViewed": false,
      "createdAt": "2026-04-29T12:00:00.000Z"
    }
  ],
  "nextCursor": null
}
```

### Chat

- `GET /chat/rooms`
- `GET /chat/rooms/:roomId/messages`
- Socket event: `chat:join`
- Socket event: `chat:message:send`
- Socket event: `chat:message:new`
- Socket event: `chat:read`
- Socket event: `chat:typing`은 V2 또는 선택

채팅방은 Match 생성과 동시에 만들어져야 합니다. 양쪽 Trip이 모두 만료되어도 채팅방은 유지됩니다.

채팅 메시지 응답은 요청자가 sender인지 receiver인지에 따라 표시 본문이 달라집니다.

```json
{
  "messageId": "msg_...",
  "chatRoomId": "chat_...",
  "senderUserId": "user_...",
  "body": "혹시 010-***-****",
  "maskDetected": true,
  "createdAt": "2026-04-29T12:00:00.000Z",
  "readByOther": false
}
```

Socket payload는 REST DTO와 같은 필드명을 사용하세요.

### Safety

- `POST /reports`
- `POST /blocks`
- `DELETE /blocks/:targetUserId`
- `GET /blocks`

차단 관계는 양방향 콕 차단에 반영해야 합니다. 채팅방에서 차단하면 채팅방은 즉시 종료됩니다.

### Coins

- `GET /coins/balance`: 현재 코인 잔액
- `GET /coins/transactions`: 코인 거래 내역, cursor pagination

### Notifications

- `POST /notifications/device-tokens`: FCM token 등록/갱신
- `DELETE /notifications/device-tokens/:deviceTokenId`: 로그아웃/기기 해제 시 비활성화

## 8.1 API 구조 평가

API 구조는 기능 단위는 맞지만, endpoint 목록만으로는 부족합니다. 백엔드 agent에게는 Express router와 service 파일을 아래처럼 나누게 하는 것이 가장 안전합니다.

```text
app.js
local.js
routes/
  index.js
  auth.js
  user.js
  region.js
  trip.js
  poke.js
  profileView.js
  match.js
  chat.js
  report.js
  block.js
  coin.js
  notification.js
  file.js
services/
  db.js
  auth.js
  user.js
  region.js
  trip.js
  poke.js
  match.js
  chat.js
  coin.js
  mask.js
  report.js
  block.js
  notification.js
  file.js
  scheduler.js
utils/
  errors.js
  objectId.js
  pagination.js
  response.js
```

각 router에는 request DTO, response DTO, error code를 주석이나 별도 Markdown으로 함께 정의해야 합니다. 특히 `poke`, `profileView`, `chat`은 코인/마스킹/매칭과 연결되므로 DTO를 먼저 확정해야 FE 통합 비용이 줄어듭니다.

## 9. 매칭 로직

### 케이스 A: 동시/상호 콕

1. User A가 Trip B에 콕을 보냅니다.
2. 이미 User B가 Trip A에 보낸 유효 콕이 있으면 즉시 Match를 생성합니다.
3. Match 생성과 동시에 ChatRoom을 생성합니다.
4. 양쪽에 푸시 및 socket 이벤트를 보냅니다.

### 케이스 B: 비대칭 콕

1. User A가 Trip B에 콕을 보냅니다.
2. User B의 받은 콕 목록에 정체가 가려진 상태로 표시합니다.
3. User B가 500코인을 내고 프로필을 열람합니다.
4. User B가 User A의 Trip에 맞콕하면 Match와 ChatRoom이 생성됩니다.

### 만료와 차단

- sender 또는 receiver Trip 중 하나가 만료되면 받은 콕 목록 신규 노출은 중단합니다.
- 이미 성사된 Match와 ChatRoom은 유지합니다.
- 차단 관계가 있으면 콕 보내기, 프로필 열람, 채팅 진입을 차단합니다.

### 9.1 필수 원자성 경계

`POST /pokes`는 MongoDB session transaction에서 아래를 처리합니다. MongoDB Atlas 또는 replica set을 사용하면 native driver의 `client.startSession()` + `session.withTransaction()`으로 구현할 수 있습니다.

1. sender의 active Trip을 조회합니다.
2. receiver Trip이 active인지 확인합니다.
3. 자기 자신의 Trip에 콕을 보내는지 확인합니다.
4. 양방향 차단 관계를 확인합니다.
5. 중복 콕 unique 제약을 확인합니다.
6. `users.updateOne({ _id: senderId, coin_balance: { $gte: 100 } }, { $inc: { coin_balance: -100 } }, { session })`로 코인을 조건부 차감합니다.
7. `coin_transactions`를 생성합니다.
8. `pokes`를 생성합니다.
9. reciprocal Poke가 있으면 `matches`, `chat_rooms`, `chat_participants`를 idempotent하게 생성합니다.
10. transaction commit 후 FCM/socket 이벤트를 발송합니다.

`POST /profile-views`도 session transaction 안에서 `source_poke_id` 권한 확인, 재열람 여부 확인, 코인 차감, `profile_views` 생성을 처리합니다. 이미 열람한 대상이면 코인 차감 없이 기존 열람 상태를 반환합니다.

`chat:message:send`는 참여자 권한, 차단 상태, 채팅방 종료 여부를 확인한 뒤 raw/masked body를 저장하고 commit 후 socket으로 브로드캐스트합니다.

MongoDB transaction을 쓰지 않는 단순 standalone 로컬 환경에서는 위 로직이 완전히 원자적이지 않습니다. 로컬 개발은 standalone으로 해도 되지만, dev/prod DB는 replica set 또는 MongoDB Atlas로 두는 것을 권장합니다.

## 10. 코인 정책

- 가입 보너스: +1000
- 콕 보내기: -100
- 받은 콕 프로필 열람: -500
- Match 생성: 0
- 채팅 메시지: 0
- 신고 승인 환불: +N

MVP에서는 결제가 없습니다. 잔액 부족 시 API는 명확한 에러 코드를 반환해야 하며, FE는 `충전 곧 오픈` 안내를 보여줍니다.

권장 에러 코드:

- `INSUFFICIENT_COINS`
- `DUPLICATE_POKE`
- `TRIP_EXPIRED`
- `BLOCKED_RELATION`
- `ACTIVE_TRIP_ALREADY_EXISTS`
- `ACTIVE_TRIP_REQUIRED`
- `PROFILE_ALREADY_VIEWED`
- `NICKNAME_TAKEN`
- `PASS_VERIFICATION_REQUIRED`

## 11. 마스킹 정책

서버는 콕 한마디와 채팅 메시지에 동일한 마스킹 엔진을 적용합니다.

마스킹 대상:

- 휴대폰 번호: `010-XXXX-XXXX` 및 변형
- 카카오톡/인스타그램/라인 ID 의심 키워드
- 계좌번호: 은행명 + 숫자 패턴

FR 기준:

- 수신자에게는 마스킹된 본문을 전달합니다.
- 발신자 화면에는 원문을 보여줄 수 있어야 합니다.
- 원문은 `raw_body`에 보관하되, 운영/신고 처리 목적 외 노출하지 않습니다.

## 12. 푸시/스케줄러

필수 푸시:

- 콕 수신
- 매칭 성사
- 매일 09:00 일정 확인: `오늘도 {regionName}에 계신가요?`

스케줄러:

- Trip 종료일 23:59 자동 만료
- `last_active_at` 기준 24시간 무반응 Trip 자동 만료
- 누적 신고 3회 자동 7일 정지, 5회 영구 정지

## 13. 성능/보안 요구사항

- 지도 인구 카운트 응답: p95 300ms 이하
- 콕 발사에서 매칭 처리까지: 1초 이하
- 채팅 메시지 전달 지연: p95 500ms 이하
- MVP 가용성: 99.5%
- 모든 API HTTPS
- JWT + refresh token
- PASS 실명/생년월일은 암호화 저장
- 다른 사용자에게 실명/생년월일/전화번호 노출 금지
- 탈퇴 개인정보는 30일 보관 후 삭제, 30일 내 재가입 차단

## 14. S1에서 백엔드가 먼저 해야 할 일

S1 목표는 기능 완성이 아니라 FE와 연결 가능한 기반입니다.

1. Express 앱 생성: `app.js`, `local.js`
2. root router 생성: `routes/index.js`
3. `.env.example` 작성: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `AWS_REGION`, `S3_BUCKET_IMAGE`, `S3_BUCKET_STORAGE`, `FCM_*`
4. MongoDB 연결 helper 작성: `services/db.js`
5. collection index 생성 스크립트 작성: `scripts/createIndexes.js`
6. S3 helper 작성: `services/file.js`
7. `/health` 또는 `/heartbeat` API
8. 공통 auth middleware, error helper, response helper
9. FE가 `GET /health`를 호출해 서버 상태를 볼 수 있는 E2E 확인

S1에서는 PASS, 카카오맵, 매칭 엔진, 실제 채팅 구현은 범위 밖입니다. 다만 route/service 파일 경계는 미리 만들어두면 이후 작업이 편합니다.

## 15. FE-BE 계약상 중요한 결정

- 백엔드가 API contract Markdown 또는 Swagger 문서를 먼저 올리고, FE가 리뷰한 뒤 구현합니다.
- 머지된 API contract를 진실 출처로 둡니다.
- Express만 쓸 경우 FE는 수동 타입 또는 별도 `shared/api-types.ts`를 사용합니다. Swagger를 붙이면 `openapi-typescript` 사용이 가능합니다.
- API 변경은 PR로 합의해야 하며, 구두 변경은 피합니다.
- 매칭 성사/채팅/푸시 payload는 S4 시작 전에 별도 API/socket spec 문서로 확정해야 합니다.

## 16. 백엔드 agent에게 남기는 우선순위

1. 먼저 S1 셋업 계획을 구현해 FE가 서버 healthcheck를 붙일 수 있게 하세요.
2. 그 다음 MongoDB collection/index v1을 PRD의 핵심 엔티티 기준으로 확장하세요.
3. API contract 초안을 먼저 작성하고, FE 화면이 필요한 상태와 에러 코드를 반영하세요.
4. 코인 차감, 콕 중복 방지, 맞콕 Match 생성은 반드시 MongoDB transaction 또는 조건부 atomic update 경계를 명확히 하세요.
5. 마스킹/신고/차단은 앱 심사와 사용자 안전에 직접 연결되므로 MVP에서 미루지 마세요.
