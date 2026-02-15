# 개발 환경 세팅 가이드

## 완료된 구현

본 프로젝트의 전체 개발 환경이 다음과 같이 구성되었습니다:

### ✅ 1단계: 루트 공통 설정
- ✓ `.gitignore` - 의존성, 빌드, 환경변수 등을 포함한 포괄적 무시 규칙
- ✓ `.prettierrc` - 일관된 코드 포맷팅 규칙 (100자 라인 너비, 2칸 탭)
- ✓ `.eslintrc.json` - TypeScript와 React 린팅 규칙
- ✓ `package.json` (루트) - 모노레포 워크스페이스 설정

### ✅ 2단계: Frontend (my-react-app) TypeScript 전환
- ✓ `tsconfig.json` - 엄격한 타입 체킹, 경로 별칭 설정
- ✓ `src/index.tsx` - index.js → TypeScript 전환
- ✓ `src/App.tsx` - App.js → TypeScript 전환 (Dashboard 컴포넌트 포함)
- ✓ `src/App.test.tsx` - 테스트 파일 TypeScript 전환
- ✓ `src/reportWebVitals.ts` - 성능 모니터링 유틸리티
- ✓ `src/setupTests.ts` - Jest DOM 셋업
- ✓ `src/types/index.ts` - 중앙화된 타입 정의
- ✓ `src/stores/useAuthStore.ts` - Zustand 상태 관리 스토어
- ✓ `src/services/api.ts` - Axios HTTP 클라이언트 (요청/응답 인터셉터)
- ✓ `src/components/common/Button.tsx` - 재사용 가능한 버튼 컴포넌트
- ✓ `src/pages/Dashboard.tsx` - 대시보드 메인 페이지 (통계 포함)
- ✓ `.env.local` - 환경변수 설정
- ✓ 디렉터리 구조: `pages/`, `components/common/`, `stores/`, `services/`, `types/`, `hooks/`
- ✓ 의존성 추가: TypeScript, Zustand, Axios, Ant Design

### ✅ 3단계: Backend (my-express-api) TypeScript 전환
- ✓ `tsconfig.json` - CommonJS 모듈, 경로 별칭 설정
- ✓ `src/app.ts` - Express 서버 메인 파일
  - CORS 미들웨어
  - JSON 요청 바디 파싱
  - 요청 로깅
  - 중앙화된 에러 처리
  - Graceful shutdown 처리
- ✓ `src/routes/health.ts` - 헬스 체크 엔드포인트
  - GET /api/health - 기본 헬스 체크
  - GET /api/health/detailed - 상세 헬스 체크
- ✓ `src/middleware/errorHandler.ts` - 에러 처리 미들웨어 및 유틸리티
- ✓ `.env.example` - 환경변수 템플릿
- ✓ 디렉터리 구조: `routes/`, `middleware/`, `controllers/`, `types/`, `utils/`
- ✓ 의존성 추가: TypeScript, ts-node-dev, Zod, Jest, CORS

### ✅ 4단계: CI/CD 파이프라인
- ✓ `.github/workflows/ci.yml` - GitHub Actions 자동화
  - 린팅 및 타입 체크
  - Frontend 테스트 및 커버리지
  - Frontend 빌드 검증
  - Backend 테스트 및 커버리지
  - Backend 빌드 검증
  - 통합 확인

### ✅ 5단계: 환경변수 설정
- ✓ `my-react-app/.env.local` - Frontend 환경변수
- ✓ `my-react-app/my-express-api/.env.example` - Backend 환경변수 템플릿

---

## 시작하기

### 1단계: 의존성 설치

```bash
npm install --workspaces
```

### 2단계: Frontend 시작

```bash
cd my-react-app
npm start
```

Frontend는 `http://localhost:3000`에서 실행됩니다.

### 3단계: Backend 시작 (별도 터미널)

```bash
cd my-react-app/my-express-api
npm run dev
```

Backend는 `http://localhost:3001`에서 실행됩니다.

### 4단계: 헬스 체크

Backend가 실행 중인지 확인:

```bash
curl http://localhost:3001/api/health
```

응답:
```json
{
  "data": {
    "status": "healthy",
    "timestamp": "2024-02-15T16:00:00.000Z",
    "uptime": 123.456
  },
  "message": "Server is healthy",
  "status": 200,
  "timestamp": "2024-02-15T16:00:00.000Z"
}
```

---

## 개발 명령어

### Frontend 개발

```bash
cd my-react-app

# 개발 서버 시작
npm start

# 테스트 실행 (watch mode)
npm test

# 커버리지 포함 테스트
npm run test:coverage

# 프로덕션 빌드
npm run build

# ESLint 실행
npm run lint

# TypeScript 타입 체크
npm run type-check
```

### Backend 개발

```bash
cd my-react-app/my-express-api

# 개발 서버 시작 (자동 재시작)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 모드 실행
npm start

# 테스트 실행
npm test

# 커버리지 포함 테스트
npm run test:coverage

# ESLint 실행
npm run lint

# TypeScript 타입 체크
npm run type-check
```

### 모노레포 전체 명령어

```bash
# 모든 워크스페이스에서 명령어 실행
npm run [script] --workspaces

# 예시
npm run lint --workspaces
npm run type-check --workspaces
npm run build --workspaces
```

---

## 프로젝트 구조

```
my-awesome-porject/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD
├── .gitignore                      # Git 무시 규칙
├── .prettierrc                     # Prettier 설정
├── .eslintrc.json                  # ESLint 설정
├── package.json                    # 루트 패키지 (workspaces)
├── CLAUDE.md                       # 프로젝트 가이드
├── SETUP_GUIDE.md                  # 이 파일
│
├── my-react-app/                   # Frontend (React 19)
│   ├── tsconfig.json               # TypeScript 설정
│   ├── .env.local                  # 환경변수
│   ├── package.json                # Frontend 의존성
│   ├── public/                     # 정적 파일
│   ├── src/
│   │   ├── index.tsx               # 진입점
│   │   ├── App.tsx                 # 메인 앱 컴포넌트
│   │   ├── App.test.tsx            # 앱 테스트
│   │   ├── types/
│   │   │   └── index.ts            # 타입 정의
│   │   ├── stores/
│   │   │   └── useAuthStore.ts     # Zustand 상태 관리
│   │   ├── services/
│   │   │   └── api.ts              # Axios 클라이언트
│   │   ├── components/common/
│   │   │   └── Button.tsx          # 버튼 컴포넌트
│   │   ├── pages/
│   │   │   └── Dashboard.tsx       # 대시보드 페이지
│   │   ├── hooks/                  # (커스텀 훅 용)
│   │   └── ...                     # 기타 파일들
│   └── my-express-api/             # Backend (Express.js)
│       ├── tsconfig.json           # TypeScript 설정
│       ├── .env.example            # 환경변수 템플릿
│       ├── package.json            # Backend 의존성
│       └── src/
│           ├── app.ts              # Express 메인 파일
│           ├── routes/
│           │   └── health.ts       # 헬스 체크 라우트
│           ├── middleware/
│           │   └── errorHandler.ts # 에러 처리
│           ├── controllers/        # (컨트롤러 용)
│           ├── types/              # (타입 용)
│           └── utils/              # (유틸리티 용)
```

---

## 기술 스택

### Frontend
- **Framework**: React 19
- **Language**: TypeScript 5.3
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Components**: Ant Design 5
- **Testing**: Jest + React Testing Library
- **Build Tool**: Create React App

### Backend
- **Framework**: Express.js 5
- **Language**: TypeScript 5.3
- **Development**: ts-node-dev
- **Validation**: Zod
- **Testing**: Jest
- **Middleware**: CORS, JSON parser

### DevOps
- **Monorepo**: NPM Workspaces
- **Code Quality**: ESLint + Prettier
- **CI/CD**: GitHub Actions
- **VCS**: Git

---

## 타입 안정성

### Frontend 경로 별칭
```typescript
import { useAuthStore } from '@stores/useAuthStore';
import { Button } from '@components/common/Button';
import { apiClient } from '@services/api';
import type { User } from '@types/index';
```

### Backend 경로 별칭
```typescript
import { errorHandler } from '@middleware/errorHandler';
import healthRoutes from '@routes/health';
```

---

## 환경변수

### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/business_db
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

---

## API 엔드포인트

### Health Check
- `GET /api/health` - 기본 헬스 체크
- `GET /api/health/detailed` - 상세 헬스 체크 (메모리, 업타임 포함)

### 응답 형식
```typescript
{
  data: T,              // 실제 데이터
  message: string,      // 메시지
  status: number,       // HTTP 상태 코드
  timestamp: string     // ISO 타임스탬프
}
```

---

## 검증 체크리스트

### 설치 후 확인 사항
- [ ] `npm install --workspaces` 성공
- [ ] TypeScript 컴파일 오류 없음
- [ ] ESLint 오류 없음
- [ ] Frontend 테스트 통과
- [ ] Backend 테스트 통과

### 개발 시 확인 사항
- [ ] `cd my-react-app && npm start` 정상 실행
- [ ] `cd my-react-app/my-express-api && npm run dev` 정상 실행
- [ ] Frontend `http://localhost:3000` 접근 가능
- [ ] Backend `http://localhost:3001/api/health` 접근 가능
- [ ] 브라우저 콘솔에 에러 없음
- [ ] 네트워크 탭에서 API 호출 확인

### 빌드 검증
- [ ] `cd my-react-app && npm run build` 성공
- [ ] `cd my-react-app/my-express-api && npm run build` 성공
- [ ] `build/` 디렉터리 존재 (Frontend)
- [ ] `dist/` 디렉터리 존재 (Backend)

---

## 문제 해결

### 의존성 설치 오류
```bash
# node_modules 전부 제거 후 재설치
rm -rf node_modules my-react-app/node_modules my-react-app/my-express-api/node_modules
npm install --workspaces
```

### 포트 이미 사용 중
```bash
# Frontend (기본값: 3000)
PORT=3001 npm start

# Backend (기본값: 3001)
PORT=3002 npm run dev
```

### TypeScript 컴파일 오류
```bash
npm run type-check
```

### ESLint 오류 자동 수정
```bash
npm run lint -- --fix
```

---

## 다음 단계

1. **기능 개발**: `src/pages`, `src/components` 에서 새 컴포넌트 작성
2. **API 통합**: `src/services/api.ts`에서 API 엔드포인트 추가
3. **상태 관리**: `src/stores/`에서 필요한 Zustand 스토어 생성
4. **백엔드 라우트**: `src/routes/`에서 Express 라우트 구현
5. **테스트 작성**: 각 컴포넌트와 라우트에 대한 테스트 작성
6. **배포 준비**: GitHub Actions CI/CD 확인 및 필요시 배포 구성

---

## 추가 리소스

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Express.js Guide](https://expressjs.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Ant Design Component Library](https://ant.design)

---

## 지원

문제가 발생하면:
1. 이 가이드의 "문제 해결" 섹션 확인
2. GitHub Issues 생성
3. CLAUDE.md의 프로젝트 구조 확인

