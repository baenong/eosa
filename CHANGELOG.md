# CHANGELOG

모든 주목할 만한 변경사항은 이 파일에 기록됩니다.
형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 따릅니다.

---

## [0.1.0] — 2026-06-19

### 추가

#### 플러그인 구조
- `.claude-plugin/plugin.json` — Claude Code 공식 플러그인 메타데이터
- `.claude-plugin/marketplace.json` — 마켓플레이스 등록 메타데이터

#### 훅 (hooks/)
- `eosa-activate.js` — SessionStart 훅: 세션 시작 시 활성 가이드라인 컨텍스트 자동 주입
- `eosa-config.js` — 프로젝트 설정 해석기 (`.eosa/config.json` 읽기)
- `eosa-instructions.js` — 가이드라인 → 세션 컨텍스트 텍스트 빌더
- `eosa-mode-tracker.js` — UserPromptSubmit 훅: `/eosa off` 명령 감지 및 비활성화
- `eosa-runtime.js` — 공통 런타임 유틸 (상태 파일 관리, 다중 에이전트 출력 형식)
- `eosa-statusline.sh` — 상태표시줄 배지 (Linux/macOS): `[EOSA:보안+접근성+디자인]`
- `eosa-statusline.ps1` — 상태표시줄 배지 (Windows PowerShell)

#### 스킬 (skills/)
- `/eosa` (`skills/eosa/SKILL.md`) — 메인 스킬: 초기화 및 가이드라인 준수 모드 활성화
- `/eosa-review` (`skills/eosa-review/SKILL.md`) — 현재 diff 1회 검토
- `/eosa-audit` (`skills/eosa-audit/SKILL.md`) — 프로젝트 전체 감사
- `/eosa-add-guideline` (`skills/eosa-add-guideline/SKILL.md`) — 기관 가이드라인 PDF/Markdown 등록
- `/eosa-help` (`skills/eosa-help/SKILL.md`) — 빠른 참조 카드

#### 가이드라인 (guidelines/)
- `security-pipa.md` — 정보보안 및 개인정보보호 (PIPA)
  - SEC-1.x: 인증 및 접근 제어
  - SEC-2.x: 입력 검증 (암호화, SQL 인젝션, XSS, 경로 조작, eval, 리다이렉트, 역직렬화)
  - SEC-3.x: 로깅 및 에러처리
  - SEC-4.x: 통신 보안 (HTTPS, CORS, SSRF)
  - SEC-5.x: 파일 처리
  - SEC-6.x: AI 보안
- `accessibility-kwcag22.md` — 웹접근성 KWCAG 2.2 (4원칙 14지침 33검사항목)
  - ACC-1.x: 인식의 용이성 (alt, 색상, 명도대비, 자동재생)
  - ACC-2.x: 운용의 용이성 (키보드, 포커스, 제스처, 제목)
  - ACC-3.x: 이해의 용이성 (레이블, 오류 안내, 인증, 반복입력)
  - ACC-4.x: 견고성 (마크업, WAI-ARIA)
- `design-krds.md` — 디지털 정부서비스 UI/UX (KRDS)
  - DES-0.x: KRDS 컴포넌트 라이브러리 설치 및 사용 (패키지, 컴포넌트, 커스텀 CSS, 공식 마크업 참조)
  - DES-1.x: 아이덴티티 (배너, 헤더, 푸터)
  - DES-2.x: 디자인 스타일 (서체, 타입 스케일, 색상 대비, 반응형 그리드)
  - DES-3.x: 탐색 컴포넌트 (메인 메뉴, 페이지네이션, 브레드크럼)
  - DES-4.x: 콘텐츠 표현 컴포넌트 (모달, 탭, 표)
  - DES-5.x: 액션 컴포넌트 (버튼/링크 구분, 링크 상세 규칙)
  - DES-6.x: 입력 컴포넌트 (텍스트 입력, 라디오·체크박스, 셀렉트, 날짜, 텍스트 영역, 파일 업로드)
  - DES-7.x: 피드백 및 도움 (스피너)
  - DES-8.x: AI 서비스 UI
  - DES-9.x: 기본 패턴 (입력폼, 개인 식별 정보 입력)

---

## 로드맵

### [1.1.0] — 예정

- 클라우드 보안 CSAP 가이드라인 추가 (`guidelines/cloud-csap-v2024.md`)
- Python/JS 이외 언어 지원 (Java, TypeScript 명시적 지원)
- `/eosa-fix` 스킬 추가: 위반 사항 자동 수정

### [2.0.0] — 예정

- Cursor, Windsurf, GitHub Copilot 등 다른 AI 에이전트 지원 확장
- 가이드라인 버전 자동 업데이트 알림
