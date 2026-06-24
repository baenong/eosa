---
guideline_id: design-krds
guideline_name: 디지털 정부서비스 UI/UX (KRDS)
version: "1.0"
legal_basis: "전자정부법 제51조의3, 디지털 정부서비스 UI/UX 가이드라인(행정안전부)"
source: "행정안전부 디지털 정부서비스 UI/UX 가이드라인, 범정부 UI/UX 디자인시스템(KRDS, www.krds.go.kr)"
last_updated: "2026-06-19"
next_review: "2027-06-19"
---

# 디지털 정부서비스 UI/UX 가이드라인 (KRDS)

공공기관 웹/앱 서비스를 위한 범정부 표준 디자인 시스템.
중앙행정기관 대표 사이트: 필수 적용. 운영서비스·공공기관·지자체: 권장 적용.

KRDS 컴포넌트 키트 및 문서: **www.krds.go.kr** | npm 패키지: **krds-uiux** (v1.1.0, 유지관리: uiux@nia.or.kr)

---

## DES-0.0 KRDS 컴포넌트 라이브러리 설치 및 사용

### DES-0.1 패키지 설치 및 CSS 로드

- **심각도**: 높음
- **기본 동작**: 프로젝트 프레임워크에 맞는 KRDS 패키지 설치. PretendardGOV 폰트는 패키지에 포함되어 있으므로 별도 다운로드 불필요. Bootstrap·Tailwind 등 외부 디자인 시스템과 병행 도입 금지

| 환경 | 패키지 | CSS 로드 방법 |
|---|---|---|
| HTML/Vanilla JS | `npm install krds-uiux` | `<link href="node_modules/krds-uiux/resources/cdn/krds.min.css">` |
| React | `npm install krds-react` | `import 'krds-react/dist/index.css'` (엔트리 파일) |
| Vue | `npm install krds-vue` | `import 'krds-vue/dist/index.css'` (엔트리 파일) |

- **올바른 예시 (HTML)**:
  ```html
  <link rel="stylesheet" href="node_modules/krds-uiux/resources/cdn/krds.min.css">
  ```
- **올바른 예시 (React — main.tsx 또는 App.tsx)**:
  ```javascript
  import 'krds-react/dist/index.css';
  ```
- **올바른 예시 (Vue — main.ts 또는 main.js)**:
  ```javascript
  import 'krds-vue/dist/index.css';
  ```
- **의심 패턴**: krds 패키지 미설치 상태에서 `krds-btn` 등 KRDS 클래스 사용, Bootstrap·Tailwind 별도 도입
- **근거**: krds-uiux / krds-react / krds-vue npm 패키지 (ISC 라이선스, 유지관리: uiux@nia.or.kr)

### DES-0.2 컴포넌트 사용 — KRDS 제공 컴포넌트는 직접 구현 금지

- **심각도**: 중간
- **기본 동작**: 아래 UI 패턴은 반드시 KRDS 컴포넌트를 사용. 커스텀 구현 금지. React/Vue는 named import, HTML/Vanilla는 CSS 클래스 사용

#### HTML/Vanilla JS — CSS 클래스 매핑

| UI 패턴 | KRDS 클래스 / 구조 |
|---|---|
| 버튼 | `<button class="krds-btn [primary\|secondary\|tertiary] [large\|medium\|small]">` |
| 텍스트 입력 | `.form-group > .form-tit > label` + `.form-conts > input.krds-input` |
| 모달 | `<section class="krds-modal fade" role="dialog" aria-labelledby="...">` |
| 페이지네이션 | `<div class="krds-pagination">` + `.page-link.active` |
| 탭 | `<div class="krds-tab-area">` + `<ul role="tablist">` + `<li role="tab">` |
| 스피너 | `<div class="krds-spinner" role="status">` |
| 배지 | `<span class="krds-badge [bg-primary\|bg-secondary]">` |
| 마스트헤드 | `<div id="krds-masthead">` (id 정확히 일치 필요) |
| 헤더 | `<header id="krds-header">` |
| 체크박스 | `<label><input type="checkbox" class="krds-checkbox"> 레이블</label>` |
| 라디오 | `<label><input type="radio" class="krds-radio"> 레이블</label>` |
| 셀렉트 | `<select class="krds-select">` |
| 태그 | `<span class="krds-tag">` |

- **올바른 예시 (HTML — 버튼)**:
  ```html
  <button type="button" class="krds-btn primary large">신청하기</button>
  <button type="button" class="krds-btn secondary medium">취소</button>
  ```
- **올바른 예시 (HTML — 텍스트 입력)**:
  ```html
  <div class="form-group">
    <div class="form-tit">
      <label for="user-name">이름 <span aria-hidden="true">*</span><span class="sr-only">(필수)</span></label>
    </div>
    <div class="form-conts">
      <input type="text" id="user-name" class="krds-input" placeholder="홍길동" required>
    </div>
    <p class="form-hint">한글 또는 영문으로 입력하세요.</p>
  </div>
  ```
- **올바른 예시 (HTML — 모달)**:
  ```html
  <button type="button" class="krds-btn medium primary open-modal" data-target="confirm-modal">삭제</button>

  <section id="confirm-modal" class="krds-modal fade" role="dialog" aria-labelledby="tit-confirm-modal">
    <div class="modal-dialog"><div class="modal-content">
      <div class="modal-header"><h2 id="tit-confirm-modal" class="modal-title">삭제 확인</h2></div>
      <div class="modal-conts"><div class="conts-area">정말 삭제하시겠습니까?</div></div>
      <div class="modal-btn btn-wrap">
        <button type="button" class="krds-btn medium tertiary close-modal">취소</button>
        <button type="button" class="krds-btn medium primary close-modal">삭제</button>
      </div>
      <button type="button" class="krds-btn medium icon btn-close close-modal">
        <span class="sr-only">닫기</span><i class="svg-icon ico-popup-close"></i>
      </button>
    </div></div>
    <div class="modal-back"></div>
  </section>
  ```

#### React (`krds-react`) / Vue (`krds-vue`) — Named Import

React와 Vue 모두 동일한 컴포넌트 이름을 사용하며, import 패키지명만 다름.

제공 컴포넌트 전체 목록: `Accordion`, `Badge`, `Breadcrumb`, `Button`, `Calendar`, `Checkbox`, `CriticalAlert`, `DateInput`, `Disclosure`, `Dropdown`, `FileUpload`, `Footer`, `Header`, `HelpPanel`, `Identifier`, `InPageNavigation`, `LanguageSwitcher`, `Link`, `MainMenu`, `Masthead`, `Modal`, `Pagination`, `Radio`, `Select`, `SideNavigation`, `SkipLink`, `Spinner`, `StepIndicator`, `StructuredList`, `Tab`, `Table`, `Tag`, `Textarea`, `TextInput`, `TextList`, `ToggleSwitch`, `Tooltip`, `TutorialPanel`

- **올바른 예시 (React)**:
  ```jsx
  import 'krds-react/dist/index.css';
  import { Button, TextInput, Modal, Pagination, Spinner } from 'krds-react';

  // 버튼 (variant: primary|secondary|tertiary|text|link|icon / size: xsmall|small|medium|large|xlarge)
  <Button variant="primary" size="medium" onClick={handleClick}>신청하기</Button>

  // 텍스트 입력 (label 필수, hint·error·success 옵션)
  <TextInput label="이름" hint="한글 또는 영문으로 입력하세요." error={errorMsg} />

  // 모달 (compound component 패턴)
  <Modal>
    <Modal.Trigger><Button variant="primary">삭제</Button></Modal.Trigger>
    <Modal.Header><Modal.Title>삭제 확인</Modal.Title></Modal.Header>
    <Modal.Body>정말 삭제하시겠습니까?</Modal.Body>
    <Modal.Footer>
      <Modal.Close><Button variant="tertiary">취소</Button></Modal.Close>
      <Button variant="primary" onClick={handleDelete}>삭제</Button>
    </Modal.Footer>
  </Modal>

  // 페이지네이션
  <Pagination totalPages={10} currentPage={page} onChange={setPage} />

  // 스피너
  <Spinner label="로딩 중" />
  ```
- **올바른 예시 (Vue)**:
  ```vue
  <!-- main.ts -->
  import 'krds-vue/dist/index.css';

  <!-- 컴포넌트 파일 -->
  <script setup>
  import { Button, TextInput, Pagination } from 'krds-vue';
  </script>
  <template>
    <Button variant="primary" size="medium" @click="handleClick">신청하기</Button>
    <TextInput label="이름" hint="한글 또는 영문으로 입력하세요." :error="errorMsg" />
    <Pagination :total-pages="10" :current-page="page" @change="setPage" />
  </template>
  ```
- **의심 패턴**: `class="btn btn-primary"` (Bootstrap), React에서 `<button className="krds-btn">` (React 환경에서 클래스 직접 사용), KRDS 패키지 없이 `krds-*` 클래스 사용
- **주석 템플릿**: `<!-- EOSA[디자인]: KRDS 컴포넌트 미사용 의심 (Rule ID: DES-0.2) -- krds-react/krds-vue/krds-uiux 패키지 컴포넌트 사용 필수 -->`
- **근거**: krds-react v1.1.1 / krds-vue v1.1.0 npm 패키지 (유지관리: uiux@nia.or.kr)

### DES-0.3 커스텀 CSS 허용 범위

- **심각도**: 낮음
- **기본 동작**: KRDS 토큰 변수(`--krds-*`)를 사용하여 커스텀 스타일 작성. KRDS가 제공하지 않는 레이아웃·간격에만 커스텀 CSS 허용. KRDS가 제공하는 컴포넌트의 스타일을 덮어쓰는 것을 최소화
- **올바른 예시 (CSS)**:
  ```css
  /* KRDS 토큰 변수 활용 */
  .custom-section {
    background-color: var(--krds-color-bg-secondary);
    padding: var(--krds-spacing-lg);
  }
  ```
- **의심 패턴**: `background-color: #1060C9` (토큰 미사용 하드코딩), `.krds-btn { padding: ... }` (컴포넌트 스타일 덮어쓰기)
- **주석 템플릿**: `/* EOSA[디자인]: KRDS 토큰 변수 미사용 의심 (Rule ID: DES-0.3) -- var(--krds-*) 변수 사용 권장 */`
- **근거**: krds-uiux npm 패키지 CSS 토큰 (resources/css/token/krds_tokens.css)

---

## DES-1.0 아이덴티티

### DES-1.1 공식 배너 필수 배치

- **심각도**: 높음
- **기본 동작**: 모든 화면 최상단에 공식 정부 배너(Masthead) 배치. 텍스트·스타일 변형 금지. 건너뛰기 링크는 배너 이전에 배치
- **올바른 예시 (HTML)**:
  ```html
  <!-- 건너뛰기 링크 → 공식 배너 → 헤더 순서 -->
  <a href="#main-content" class="skip-nav">본문으로 바로가기</a>
  <!-- masthead: role 부여 금지 — <header>가 암묵적 banner 랜드마크이므로 중복 방지 -->
  <div class="gov-masthead">
    <span>대한민국 정부 공식 서비스입니다.</span>
  </div>
  <header>...</header>
  <main id="main-content">...</main>
  ```
- **의심 패턴**: 배너 없음, 배너 텍스트 수정, 배너가 헤더 아래에 배치
- **주석 템플릿**: `<!-- EOSA[디자인]: 공식 배너 누락 또는 위치 오류 (Rule ID: DES-1.1) -- 모든 화면 최상단에 배치 필수 -->`
- **근거**: KRDS 가이드라인 Ⅳ-1 아이덴티티, 디지털 정부서비스 UI/UX 가이드라인 적용 기준

### DES-1.2 서비스 제목 및 로고 제공 / 헤더 내부 구성

- **심각도**: 중간
- **기본 동작**: 헤더에 운영기관 식별자(로고) 및 서비스명 제공. 로고는 홈으로 이동하는 링크. 로고는 왼쪽 상단, 유틸리티 링크는 헤더 우측 상단에 4개 이하로 배치하며 구분자로 분리. 헤더 내부 요소 순서는 ① 공식 배너 → ② 유틸리티 링크 → ③ 서비스 로고 → ④ 아이콘 버튼/레이블 → ⑤ 메인 메뉴 순서 유지
- **올바른 예시 (HTML)**:
  ```html
  <header id="krds-header">
    <!-- 유틸리티 링크: 우측 상단, 4개 이하, 구분자(|) 사용 -->
    <div class="header-utility">
      <ul class="utility-list">
        <li><a href="#" class="krds-btn small text">사이트맵</a></li>
        <li><a href="#" class="krds-btn small text">로그인</a></li>
      </ul>
    </div>
    <!-- 서비스 로고: 왼쪽 상단 -->
    <div class="header-branding">
      <h2 class="logo">
        <a href="/"><span class="sr-only">[기관명] 홈으로 이동</span></a>
      </h2>
    </div>
  </header>
  ```
- **의심 패턴**: 로고에 `alt`/`sr-only` 없음, 서비스명 미제공, 로고가 링크가 아님, 유틸리티 링크 5개 이상, 로고가 중앙 또는 우측 배치
- **주석 템플릿**: `<!-- EOSA[디자인]: 헤더 구성 오류 의심 (Rule ID: DES-1.2) -- 로고 왼쪽 상단, 유틸리티 링크 우측 상단 4개 이하 -->`
- **근거**: KRDS 가이드라인 Ⅳ-1 운영기관 식별자·헤더, 자체 검증 체크리스트 헤더 2·3·4·5·6

### DES-1.3 푸터 필수 구성 요소

- **심각도**: 중간
- **기본 동작**: 푸터에 서비스 로고·대표 연락처·저작권 정보 필수 제공. 개인정보를 처리하는 서비스는 개인정보 처리 방침 링크 필수. 정보 순서는 ① 서비스 로고 → ② 연락처 → ③ 유틸리티 링크 → ④ 정책 링크 → ⑤ 저작권 정보 → ⑥ 운영기관 식별자 유지. 푸터는 항상 화면 가장 마지막 요소. 콘텐츠가 짧아도 푸터 하단에 빈 여백 없음
- **올바른 예시 (HTML)**:
  ```html
  <footer>
    <!-- ① 서비스 로고 -->
    <div class="footer-logo"><img src="/logo.svg" alt="[기관명] 로고"></div>
    <!-- ② 연락처 (전화번호는 tel:, 이메일은 mailto: 링크) -->
    <address>
      <a href="tel:02-1234-5678">02-1234-5678</a> |
      <a href="mailto:info@agency.go.kr">info@agency.go.kr</a>
    </address>
    <!-- ④ 정책 링크: 개인정보 처리 방침 필수 -->
    <nav aria-label="정책 링크">
      <a href="/privacy"><strong>개인정보 처리 방침</strong></a>
      <a href="/terms">이용약관</a>
    </nav>
    <!-- ⑤ 저작권 정보 -->
    <p class="copyright">Copyright ⓒ [기관명]. All rights reserved.</p>
  </footer>
  ```
- **의심 패턴**: 저작권 정보 없음, 개인정보 처리 방침 링크 없음, 연락처 미제공, 푸터 하단 흰 여백, 정보 순서 임의 변경
- **주석 템플릿**: `<!-- EOSA[디자인]: 푸터 필수 요소 누락 의심 (Rule ID: DES-1.3) -- 로고·연락처·저작권·개인정보처리방침 필수 -->`
- **근거**: KRDS 가이드라인 Ⅳ-1 푸터, 자체 검증 체크리스트 푸터 2·3·4·5

---

## DES-2.0 디자인 스타일

### DES-2.1 서체 사용

- **심각도**: 낮음
- **기본 동작**: 표준형 스타일은 `Pretendard GOV` 사용. 확장형 스타일은 가독성 높은 고딕 계열 권장(노토 산스, 나눔 고딕, 스포카 한 산스). 본문 최소 16px(Pretendard GOV는 17px 권장). `light(300)` 이하 사용 금지
- **올바른 예시 (CSS)**:
  ```css
  /* 표준형 스타일 */
  :root {
    font-family: 'Pretendard GOV', 'Noto Sans KR', sans-serif;
    font-size: 17px;      /* Pretendard GOV 기본 크기 */
    line-height: 1.5;     /* 최소 150% */
  }

  /* 개발 시 rem 변환 (62.5% 기준) */
  html { font-size: 62.5%; }   /* 1rem = 10px */
  body { font-size: 1.7rem; }  /* 17px */
  ```
- **의심 패턴**: `font-size: 12px`, `font-weight: 200`, `font-weight: 300`, 세리프(명조) 계열 본문 폰트
- **주석 템플릿**: `/* EOSA[디자인]: 폰트 크기/두께 기준 미달 의심 (Rule ID: DES-2.1) -- 본문 최소 16px, font-weight 400 이상 */`
- **근거**: KRDS 가이드라인 Ⅲ-3 타이포그래피

### DES-2.2 글자 스케일 (Type Scale)

- **심각도**: 낮음
- **기본 동작**: heading/body 계층 구조 준수. line-height 최소 150%. 단위는 rem 사용
- **올바른 예시 (CSS)**:
  ```css
  /* Heading 스케일 (pc 기준, rem 기본값 10px) */
  h1 { font-size: 4.0rem; font-weight: 700; line-height: 1.5; }  /* 40px */
  h2 { font-size: 3.2rem; font-weight: 700; line-height: 1.5; }  /* 32px */
  h3 { font-size: 2.4rem; font-weight: 700; line-height: 1.5; }  /* 24px */
  h4 { font-size: 1.9rem; font-weight: 700; line-height: 1.5; }  /* 19px */
  h5 { font-size: 1.7rem; font-weight: 700; line-height: 1.5; }  /* 17px */

  /* Body 스케일 */
  .body-large  { font-size: 1.9rem; line-height: 1.5; }
  .body-medium { font-size: 1.7rem; line-height: 1.5; }  /* 기본 */
  .body-small  { font-size: 1.5rem; line-height: 1.5; }
  .body-xsmall { font-size: 1.3rem; line-height: 1.5; }  /* 주석·보조 */
  ```
- **의심 패턴**: `line-height: 1.2` 이하, h1과 body 크기 차이가 1.25배 미만
- **주석 템플릿**: `/* EOSA[디자인]: 줄 간격 미달 의심 (Rule ID: DES-2.2) -- line-height 1.5(150%) 이상 필수 */`
- **근거**: KRDS 가이드라인 Ⅲ-3 타이포그래피 (줄 간격·글자 스케일)

### DES-2.3 색상 대비 (매직넘버)

- **심각도**: 높음
- **기본 동작**: 텍스트-배경 대비 4.5:1 이상(매직넘버 50). 비텍스트 UI 요소 3:1 이상(매직넘버 40). 색상으로만 정보 전달 금지. 색각이상자를 위해 적록 조합 회피
- **올바른 예시 (CSS — KRDS 시스템 색상)**:
  ```css
  /* 시스템 색상 (상태 표현) — 4.5:1 이상 대비 준수 */
  .status-danger  { color: #D13C1D; }   /* system-danger */
  .status-warning { color: #9B6A00; }   /* system-warning */
  .status-success { color: #1B7C3A; }   /* system-success */
  .status-info    { color: #1060C9; }   /* system-info */

  /* 색각이상자 고려: 아이콘 + 색상 병용 */
  .status-danger::before  { content: '⚠ '; }
  .status-success::before { content: '✓ '; }
  ```
- **의심 패턴**: `color: #999` on white background, 적색+녹색만으로 성공/실패 구분, 색상으로만 필수 입력 필드 표시
- **주석 템플릿**: `/* EOSA[디자인]: 색상 대비 미달 또는 색상만으로 정보 전달 의심 (Rule ID: DES-2.3) -- 4.5:1 이상 대비 및 아이콘/텍스트 병용 */`
- **근거**: KRDS 가이드라인 Ⅲ-2 색상 (매직넘버·접근성), KWCAG 2.2 ACC-1.8

### DES-2.4 반응형 그리드 및 브레이크포인트

- **심각도**: 중간
- **기본 동작**: 표준형 스타일 4단계 브레이크포인트 준수. 최대 콘텐츠 영역 1200px. 스크린 마진 준수
- **올바른 예시 (CSS)**:
  ```css
  /* 표준형 스타일 브레이크포인트 */
  .container {
    width: 100%;
    max-width: 1200px;    /* 최대 콘텐츠 영역 */
    margin: 0 auto;
    padding: 0 24px;      /* large: screen margin 24px */
  }

  /* small 360px / medium 768px / large 1024px / xlarge 1280px */
  @media (max-width: 767px) {
    .container { padding: 0 16px; }   /* small: 16px */
  }
  @media (min-width: 768px) {
    .container { padding: 0 24px; }   /* medium 이상: 24px */
  }
  ```
- **의심 패턴**: `width: 1920px` 고정, 모바일 스크린 마진 없음(`padding: 0`)
- **주석 템플릿**: `/* EOSA[디자인]: 반응형 그리드 미적용 의심 (Rule ID: DES-2.4) -- 표준형 4단계 브레이크포인트 및 최대 1200px 콘텐츠 영역 준수 */`
- **근거**: KRDS 가이드라인 Ⅲ-5 레이아웃

---

## DES-3.0 탐색 컴포넌트

### DES-3.1 메인 메뉴 접근성

- **심각도**: 중간
- **기본 동작**: 메인 메뉴에 `role="navigation"` 및 `aria-label` 제공. 아이콘 버튼에 텍스트 레이블 병기. 키보드 접근 가능. 모바일 햄버거 메뉴에 `aria-expanded` 상태 제공
- **올바른 예시 (HTML)**:
  ```html
  <nav role="navigation" aria-label="주요 메뉴">
    <ul>
      <li><a href="/about">기관 소개</a></li>
      <li><a href="/service">서비스</a></li>
    </ul>
  </nav>

  <!-- 모바일 햄버거 버튼 -->
  <button type="button" aria-expanded="false" aria-controls="mobile-menu">
    <span class="icon-menu" aria-hidden="true"></span>
    <span class="visually-hidden">메뉴 열기</span>
  </button>
  <nav id="mobile-menu" hidden>...</nav>
  ```
- **의심 패턴**: `<div>` 메뉴에 `role` 없음, 아이콘 버튼에 텍스트 없음, `aria-expanded` 없는 드롭다운
- **주석 템플릿**: `<!-- EOSA[디자인]: 메인 메뉴 접근성 마크업 오류 의심 (Rule ID: DES-3.1) -- role/aria-label/aria-expanded 추가 필요 -->`
- **근거**: KRDS 가이드라인 Ⅳ-2 탐색, KWCAG 2.2 ACC-4.2

### DES-3.3 브레드크럼

- **심각도**: 낮음
- **기본 동작**: 정보 계층이 1수준인 사이트, 메인/랜딩 페이지에 브레드크럼 사용 금지. 진행 상황 표시(단계 표시)에 사용 금지. 첫 항목은 메인 화면 링크, 마지막 항목은 현재 화면의 상위 화면 링크(현재 화면 자체는 포함하지 않음). 경로는 4개 이하, 단일 행, 본문 그리드 왼쪽 끝 정렬. 브레드크럼과 본문 제목 사이에 다른 요소 배치 금지
- **올바른 예시 (HTML — `krds-breadcrumb` 컴포넌트 사용)**:
  ```html
  <!-- 현재 페이지: 정보공개 > 통계자료 > 월별통계 -->
  <nav aria-label="현재 위치" class="krds-breadcrumb">
    <ol>
      <li><a href="/">홈</a></li>
      <li><a href="/info">정보공개</a></li>
      <li><a href="/info/stats">통계자료</a></li>
      <!-- 마지막 항목: 현재 화면의 바로 상위 -->
    </ol>
  </nav>
  <h1>월별통계</h1>
  ```
- **의심 패턴**: 현재 페이지명이 브레드크럼 마지막 항목으로 포함됨, 경로 5개 이상, 메인 페이지에 브레드크럼 표시, 스텝 표시에 브레드크럼 사용
- **주석 템플릿**: `<!-- EOSA[디자인]: 브레드크럼 사용 기준 미준수 의심 (Rule ID: DES-3.3) -- 4개 이하 경로, 현재 페이지 미포함, 메인 제외 -->`
- **근거**: KRDS 가이드라인 Ⅳ-2 브레드크럼, 자체 검증 체크리스트 브레드크럼 1·2·3·5·6·7·10

### DES-3.2 페이지네이션

- **심각도**: 낮음
- **기본 동작**: `class="krds-pagination"` 사용. 현재 페이지 링크에 `.active` 추가 및 `<span class="sr-only">현재페이지 </span>` 삽입으로 스크린리더 안내. 이전/다음에 `.disabled` 적용
- **올바른 예시 (HTML)**:
  ```html
  <div class="krds-pagination">
    <span class="page-navi prev disabled">이전</span>
    <div class="page-links">
      <a class="page-link" href="?page=1">1</a>
      <a class="page-link active" href="?page=2"><span class="sr-only">현재페이지 </span>2</a>
      <a class="page-link" href="?page=3">3</a>
    </div>
    <a class="page-navi next" href="?page=3">다음</a>
  </div>
  ```
- **의심 패턴**: 현재 페이지 `.active` 없음, `sr-only` 안내 텍스트 없음, 클릭 영역 20px 이하
- **주석 템플릿**: `<!-- EOSA[디자인]: 페이지네이션 현재 페이지 표시 오류 의심 (Rule ID: DES-3.2) -- .active + sr-only 안내 텍스트 필요 -->`
- **근거**: KRDS 가이드라인 Ⅳ-2 페이지네이션, krds-uiux html/code/pagination.html

---

## DES-4.0 콘텐츠 표현 컴포넌트

### DES-4.1 모달 사용 기준

- **심각도**: 중간
- **기본 동작**: 모달은 최후 수단. 사용자 행동으로만 실행(자동 팝업 금지). 모달 내 복잡한 폼/탭/아코디언 사용 지양. 닫기 버튼은 DOM 마지막 요소. 포커스는 모달 내부로 이동하고 모달 닫으면 원래 요소로 복귀
- **올바른 예시 (HTML)**:
  ```html
  <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <h2 id="modal-title">확인</h2>
    <div>내용</div>
    <footer>
      <button type="button">확인</button>
      <button type="button">취소</button>
    </footer>
    <!-- 닫기 버튼은 DOM 마지막 요소 -->
    <button type="button" aria-label="닫기">×</button>
  </div>
  ```
- **의심 패턴**: 페이지 로드 시 자동 모달, 모달 내 중첩 탭, `role="dialog"` 없음
- **주석 템플릿**: `<!-- EOSA[디자인]: 모달 사용 기준 검토 필요 (Rule ID: DES-4.1) -- 사용자 행동으로만 실행, 내부 상호작용 최소화 -->`
- **근거**: KRDS 가이드라인 Ⅳ-3 모달

### DES-4.2 탭 컴포넌트

- **심각도**: 낮음
- **기본 동작**: 탭에 `disabled` 상태 사용 금지(탭 자체 제거 또는 빈 상태 안내 제공). ARIA `role="tablist"`, `role="tab"`, `role="tabpanel"` 사용
- **올바른 예시 (HTML)**:
  ```html
  <div role="tablist" aria-label="콘텐츠 섹션">
    <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">개요</button>
    <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">세부내용</button>
  </div>
  <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
    <p>개요 내용</p>
  </div>
  <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
    <p>세부 내용</p>
  </div>
  ```
- **의심 패턴**: 탭에 `disabled` 속성, `role="tab"` 없는 탭, 탭 내 탭 중첩
- **주석 템플릿**: `<!-- EOSA[디자인]: 탭 ARIA 마크업 오류 또는 사용 기준 미준수 의심 (Rule ID: DES-4.2) -->`
- **근거**: KRDS 가이드라인 Ⅳ-3 탭

### DES-4.3 표(Table) 사용 기준

- **심각도**: 중간
- **기본 동작**: 제한된 공간(모달·아코디언)에 가로 스크롤 필요 표 사용 금지. 빈 셀에 `-` 제공. 숫자는 오른쪽 정렬. 사용자 정렬 기능 제공 시 `aria-sort`로 현재 정렬 상태 표시
- **올바른 예시 (HTML)**:
  ```html
  <div style="overflow-x: auto;">
    <table>
      <caption>월별 현황</caption>
      <thead>
        <tr>
          <th scope="col" aria-sort="ascending">월</th>
          <th scope="col">건수</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2026년 1월</td>
          <td style="text-align: right;">1,234</td>
        </tr>
        <tr>
          <td>2026년 2월</td>
          <td style="text-align: right;">-</td>
        </tr>
      </tbody>
    </table>
  </div>
  ```
- **의심 패턴**: 모달 내부 가로 스크롤 표, 빈 셀 방치, `<th>` 없는 데이터 표, `scope` 없는 복잡한 표
- **주석 템플릿**: `<!-- EOSA[디자인]: 표 마크업 또는 사용 기준 오류 의심 (Rule ID: DES-4.3) -- caption/th/scope 확인 -->`
- **근거**: KRDS 가이드라인 Ⅳ-3 표, KWCAG 2.2 ACC-1.3

---

## DES-5.0 액션 컴포넌트

### DES-5.1 버튼 및 링크 시맨틱 구분

- **심각도**: 중간
- **기본 동작**: 페이지 이동→`<a>`, 동작 실행→`<button type="button">`, 폼 제출→`<button type="submit">`. 아이콘만 있는 버튼은 숨긴 텍스트 레이블 필수
- **올바른 예시 (HTML)**:
  ```html
  <!-- 이동: <a> 사용 -->
  <a href="/apply">신청하기</a>

  <!-- 동작: <button> 사용 -->
  <button type="button" onclick="openModal()">상세 보기</button>

  <!-- 폼 제출 -->
  <button type="submit">저장</button>

  <!-- 아이콘만 있는 버튼: visually-hidden 레이블 필수 -->
  <button type="button">
    <svg aria-hidden="true">...</svg>
    <span class="visually-hidden">삭제</span>
  </button>
  ```
- **의심 패턴**: `<div onclick="...">`, `<a href="#">` 동작 실행, `type` 없는 `<button>`, 아이콘 버튼에 텍스트 없음
- **주석 템플릿**: `<!-- EOSA[디자인]: 버튼/링크 시맨틱 오류 의심 (Rule ID: DES-5.1) -- 이동은 <a>, 동작은 <button> 사용 -->`
- **근거**: KRDS 가이드라인 Ⅳ-4 링크·버튼

### DES-5.2 링크 상세 규칙

- **심각도**: 중간
- **기본 동작**: 색상만으로 링크를 일반 텍스트와 구분하지 않음 — 밑줄(명도 대비 3:1 이상) 또는 아이콘 제공. 이메일 주소는 `mailto:`, 전화번호는 `tel:` 프로토콜 사용. 외부 서비스 링크에는 아이콘 또는 "새 창 열림" 텍스트로 구분하고 모든 외부 링크에 일관된 방식 사용. "여기를 클릭", "더 읽기" 등 맥락 없는 링크 텍스트 금지
- **올바른 예시 (HTML)**:
  ```html
  <!-- 인라인 링크: 밑줄로 구분 -->
  <p>자세한 내용은 <a href="/guide" class="krds-btn link basic">이용 가이드<span class="underline"></span></a>를 참고하세요.</p>

  <!-- 이메일 링크 -->
  <a href="mailto:info@agency.go.kr">info@agency.go.kr</a>

  <!-- 전화번호 링크 -->
  <a href="tel:02-1234-5678">02-1234-5678</a>

  <!-- 외부 링크: 아이콘 + title 안내 -->
  <a href="https://external.go.kr" target="_blank" title="새 창 열림">
    외부 서비스 <i class="svg-icon ico-go" aria-hidden="true"></i>
    <span class="sr-only">(새 창 열림)</span>
  </a>
  ```
- **의심 패턴**: 색상만 다른 링크(밑줄 없음), `href="mailto:"` 없는 이메일 텍스트, `href="tel:"` 없는 전화번호 텍스트, 외부 링크에 구분 표시 없음, 링크 텍스트가 "클릭", "여기", "더보기" 단독 사용
- **주석 템플릿**: `<!-- EOSA[디자인]: 링크 표현 기준 미준수 의심 (Rule ID: DES-5.2) -- 색상만으로 구분 금지, mailto/tel 프로토콜 사용, 외부 링크 표시 필요 -->`
- **근거**: KRDS 가이드라인 Ⅳ-4 링크, 자체 검증 체크리스트 링크 2·4·5·6

---

## DES-6.0 입력 컴포넌트

### DES-6.1 텍스트 입력 필드 레이블

- **심각도**: 높음
- **기본 동작**: 모든 입력 필드에 명시적 `<label>` 제공. placeholder를 레이블 또는 도움말 대체 수단으로 사용 금지. 도움말은 입력 필드 하단에 텍스트로 제공
- **올바른 예시 (HTML)**:
  ```html
  <div class="form-group">
    <label for="user-name">
      이름 <span aria-hidden="true">*</span>
      <span class="visually-hidden">(필수)</span>
    </label>
    <!-- placeholder는 형식 예시만 — 레이블 역할 금지 -->
    <input type="text" id="user-name" name="user-name"
           placeholder="홍길동" autocomplete="name" required
           aria-describedby="name-hint">
    <p id="name-hint" class="hint">한글 또는 영문으로 입력하세요.</p>
  </div>
  ```
- **의심 패턴**: `<input>`에 대응하는 `<label>` 없음, placeholder만으로 필드 설명
- **주석 템플릿**: `<!-- EOSA[디자인]: 입력 필드 레이블 누락 의심 (Rule ID: DES-6.1) -- <label for="">로 명시적 연결 필수 -->`
- **근거**: KRDS 가이드라인 Ⅳ-8 텍스트 입력 필드, KWCAG 2.2 ACC-3.5

### DES-6.2 라디오·체크박스 그룹

- **심각도**: 중간
- **기본 동작**: 라디오·체크박스 그룹은 `<fieldset>+<legend>` 사용. 수직 배치 기본. 체크박스 전체 선택 시 중간 상태(`indeterminate`) 표현
- **올바른 예시 (HTML)**:
  ```html
  <fieldset>
    <legend>신청 유형 <span class="required">(필수)</span></legend>
    <label><input type="radio" name="type" value="A"> 유형 A</label>
    <label><input type="radio" name="type" value="B"> 유형 B</label>
  </fieldset>
  ```
- **올바른 예시 (JS — 전체 선택 중간 상태)**:
  ```javascript
  function updateSelectAll(checkboxes, selectAll) {
    const checked = checkboxes.filter(cb => cb.checked);
    selectAll.indeterminate = checked.length > 0 && checked.length < checkboxes.length;
    selectAll.checked = checked.length === checkboxes.length;
  }
  ```
- **의심 패턴**: `<fieldset>` 없는 라디오 그룹, 전체 선택 중간 상태 미처리
- **주석 템플릿**: `<!-- EOSA[디자인]: 라디오/체크박스 그룹 마크업 오류 의심 (Rule ID: DES-6.2) -- fieldset+legend 사용 필수 -->`
- **근거**: KRDS 가이드라인 Ⅳ-5 라디오버튼·체크박스

### DES-6.3 셀렉트 사용 기준

- **심각도**: 낮음
- **기본 동작**: 옵션 20개 초과 시 자동완성 입력 사용 권장. 셀렉트 값 변경으로 폼 자동 제출 금지
- **올바른 예시 (HTML)**:
  ```html
  <label for="city">지역 선택</label>
  <select id="city" name="city">
    <option value="">선택하세요</option>
    <option value="seoul">서울</option>
    <option value="busan">부산</option>
  </select>
  <!-- onChange 자동 제출 금지: 별도 확인 버튼 사용 -->
  <button type="submit">조회</button>
  ```
- **의심 패턴**: `<select onchange="this.form.submit()">`, 옵션 30개 이상인 셀렉트
- **주석 템플릿**: `<!-- EOSA[디자인]: 셀렉트 변경 시 자동 제출 사용 금지 (Rule ID: DES-6.3) -- 제출 버튼 별도 제공 필수 -->`
- **근거**: KRDS 가이드라인 Ⅳ-5 셀렉트, KWCAG 2.2 ACC-3.2

### DES-6.4 날짜 입력 필드

- **심각도**: 중간
- **기본 동작**: 날짜 입력 필드는 특정 날짜 입력에만 사용 — "5일 이내", "1일 후" 같은 상대적 날짜 입력에 사용 금지. 레이블 필수("날짜" 같은 모호한 레이블 금지). 다중 필드(년/월/일 분리)에는 각각 "년"·"월"·"일" 레이블 제공. 도움말 텍스트로 입력 형식 안내(플레이스홀더 단독 안내 금지). 개인 날짜 데이터 필드에 `autocomplete` 속성 적용
- **올바른 예시 (HTML)**:
  ```html
  <!-- 단일 날짜 입력 -->
  <div class="form-group">
    <div class="form-tit"><label for="birth-date">생년월일</label></div>
    <div class="form-conts">
      <input type="text" id="birth-date" class="krds-input"
             autocomplete="bday" placeholder="YYYY-MM-DD">
    </div>
    <p class="form-hint">예) 1990-01-15 형식으로 입력해 주세요.</p>
  </div>

  <!-- 다중 날짜 입력 필드 (년/월/일 분리) -->
  <fieldset>
    <legend>생년월일</legend>
    <div class="form-conts">
      <label for="birth-year">년</label>
      <input type="text" id="birth-year" class="krds-input" autocomplete="bday-year" maxlength="4">
      <label for="birth-month">월</label>
      <input type="text" id="birth-month" class="krds-input" autocomplete="bday-month" maxlength="2">
      <label for="birth-day">일</label>
      <input type="text" id="birth-day" class="krds-input" autocomplete="bday-day" maxlength="2">
    </div>
    <p class="form-hint">숫자만 입력해 주세요.</p>
  </fieldset>
  ```
- **`autocomplete` 날짜 속성값**: `bday`(생년월일 전체), `bday-year`, `bday-month`, `bday-day`, `cc-exp`(카드 만료일), `cc-exp-month`, `cc-exp-year`
- **의심 패턴**: 상대 날짜 입력에 날짜 필드 사용, "날짜" 레이블만 제공, 다중 필드에 년/월/일 레이블 없음, 도움말 텍스트 없음, 플레이스홀더로만 형식 안내
- **주석 템플릿**: `<!-- EOSA[디자인]: 날짜 입력 필드 기준 미준수 의심 (Rule ID: DES-6.4) -- 명확한 레이블, 도움말, autocomplete 필요 -->`
- **근거**: KRDS 가이드라인 Ⅳ-8 날짜 입력 필드, 자체 검증 체크리스트 날짜 입력 필드 1·2·3·4·7

### DES-6.5 텍스트 영역(Textarea)

- **심각도**: 중간
- **기본 동작**: 모든 텍스트 영역에 레이블 필수. 플레이스홀더를 레이블·도움말 대체 수단으로 사용 금지. 복사·붙여넣기 기능 제한 금지(보안 모듈 예외). 글자 수 제한 있을 때 최대 글자 수와 남은 글자 수를 동적으로 함께 표시
- **올바른 예시 (HTML + JS)**:
  ```html
  <div class="form-group">
    <div class="form-tit"><label for="inquiry">문의 내용</label></div>
    <div class="form-conts">
      <textarea id="inquiry" class="krds-textarea" maxlength="500"
                aria-describedby="inquiry-count"></textarea>
    </div>
    <p class="form-hint">
      최대 500자 | 남은 글자: <span id="inquiry-count">500</span>자
    </p>
  </div>
  ```
  ```javascript
  document.getElementById('inquiry').addEventListener('input', function () {
    const remaining = 500 - this.value.length;
    document.getElementById('inquiry-count').textContent = remaining;
  });
  ```
- **의심 패턴**: 텍스트 영역에 레이블 없음, 플레이스홀더로만 설명, 붙여넣기 이벤트 차단(`onpaste="return false"`), 글자 수 카운터 없이 maxlength만 적용
- **주석 템플릿**: `<!-- EOSA[디자인]: 텍스트 영역 기준 미준수 의심 (Rule ID: DES-6.5) -- 레이블 필수, 플레이스홀더 단독 사용 금지, 글자 수 표시 필요 -->`
- **근거**: KRDS 가이드라인 Ⅳ-8 텍스트 영역, 자체 검증 체크리스트 텍스트 영역 1·2·3·4

### DES-6.6 파일 업로드

- **심각도**: 중간
- **기본 동작**: 레이블 필수. 파일 항목에 파일명·확장자·크기·삭제 버튼 필수 표시. 파일 유형·크기·개수 제한은 도움말로 사전 안내. 파일 업로드 후에도 파일 선택 버튼 기본 상태 유지(비활성화 금지). 파일 선택 후 자동 제출 금지. 오류 메시지는 원인 구체적으로(형식/크기/개수 각각 구분). 업로드된 파일명은 한 줄+말줄임표(두 줄 금지). 모달 내 다중 파일 업로드 금지
- **올바른 예시 (HTML)**:
  ```html
  <div class="form-group">
    <div class="form-tit"><label>첨부파일</label></div>
    <div class="form-conts">
      <!-- krds-uiux FileUpload 컴포넌트 사용 -->
      <div class="krds-file-upload">
        <button type="button" class="krds-btn secondary medium">파일 선택</button>
        <input type="file" class="sr-only" multiple accept=".pdf,.hwp,.doc,.docx">
      </div>
      <!-- 업로드된 파일 목록: 한 줄 + 말줄임표 -->
      <ul class="file-list">
        <li class="file-item">
          <span class="file-name">신청서.pdf (2.3 MB)</span>
          <button type="button" class="krds-btn icon" aria-label="신청서.pdf 삭제">
            <i class="svg-icon ico-close" aria-hidden="true"></i>
          </button>
        </li>
      </ul>
    </div>
    <!-- 파일 제한 도움말: 사전 안내 필수 -->
    <p class="form-hint">허용 형식: PDF, HWP, DOC | 최대 크기: 10MB | 최대 5개</p>
  </div>
  ```
- **의심 패턴**: 파일 항목에 크기·확장자 없음, 삭제 버튼 없음, 파일 선택 즉시 자동 제출, 업로드 후 파일 선택 버튼 비활성화, 모달 내 다중 파일 업로드, 오류 시 "오류가 발생했습니다"만 표시
- **주석 템플릿**: `<!-- EOSA[디자인]: 파일 업로드 기준 미준수 의심 (Rule ID: DES-6.6) -- 파일 항목 정보 표시, 제한 안내, 자동 제출 금지 -->`
- **근거**: KRDS 가이드라인 Ⅳ-8 파일 업로드, 자체 검증 체크리스트 파일 업로드 1·2·3·4·5·7·8·9

---

## DES-7.0 피드백 및 도움

### DES-7.1 로딩 스피너 제공

- **심각도**: 낮음
- **기본 동작**: 1초 이상 처리 시 스피너 또는 진행 상태 표시. 스피너에 `role="status"` 및 `aria-live="polite"` 제공
- **올바른 예시 (HTML)**:
  ```html
  <div role="status" aria-live="polite" aria-label="처리 중" hidden>
    <span class="spinner" aria-hidden="true"></span>
    <span class="visually-hidden">처리 중입니다. 잠시 기다려 주세요.</span>
  </div>
  ```
- **올바른 예시 (JS)**:
  ```javascript
  async function submitForm(formData) {
    const spinner = document.querySelector('[role="status"]');
    spinner.hidden = false;
    try {
      await fetch('/api/submit', { method: 'POST', body: formData });
      spinner.querySelector('.visually-hidden').textContent = '처리가 완료되었습니다.';
    } finally {
      setTimeout(() => { spinner.hidden = true; }, 1000);
    }
  }
  ```
- **의심 패턴**: 로딩 중 화면 변화 없음, 스피너에 `aria-label` 없음
- **주석 템플릿**: `<!-- EOSA[디자인]: 로딩 상태 피드백 누락 의심 (Rule ID: DES-7.1) -- 1초 이상 처리 시 스피너 및 aria 안내 필요 -->`
- **근거**: KRDS 가이드라인 Ⅳ-6 스피너

---

## DES-9.0 기본 패턴

### DES-9.1 입력폼 패턴

- **심각도**: 중간
- **기본 동작**: 입력폼에 제목 필수 제공. 콘텐츠는 단일 열에 수직 정렬. 입력폼 간·항목 간 충분한 간격 유지. 액션 버튼(이전/다음/저장/제출)은 일관된 위치에 배치. 필수/선택 항목은 명확하고 일관된 방식으로 구분(`*` + sr-only 텍스트 사용). 단위가 있는 입력값은 단위 표시. 사용자가 자주 입력하는 데이터에 `autocomplete` 속성 적용
- **올바른 예시 (HTML)**:
  ```html
  <section>
    <h2>신청서 작성</h2>
    <form>
      <div class="fieldset">
        <!-- 필수 항목 표시: * (시각) + sr-only "(필수)" (스크린리더) -->
        <div class="form-group">
          <div class="form-tit">
            <label for="applicant-name">
              이름 <span aria-hidden="true">*</span>
              <span class="sr-only">(필수)</span>
            </label>
          </div>
          <div class="form-conts">
            <input type="text" id="applicant-name" class="krds-input"
                   autocomplete="name" required>
          </div>
        </div>
        <!-- 단위 표시 -->
        <div class="form-group">
          <div class="form-tit"><label for="amount">신청 금액</label></div>
          <div class="form-conts">
            <input type="number" id="amount" class="krds-input">
            <span class="unit">원</span>
          </div>
        </div>
      </div>
      <!-- 액션 버튼: 일관된 위치 (폼 하단, 오른쪽 정렬) -->
      <div class="btn-wrap">
        <button type="button" class="krds-btn tertiary medium">이전</button>
        <button type="submit" class="krds-btn primary medium">다음</button>
      </div>
    </form>
  </section>
  ```
- **의심 패턴**: 입력폼 제목 없음, 2열 이상 레이아웃, 필수/선택 구분 없음, 화면마다 액션 버튼 위치 다름, 단위 미표시
- **주석 템플릿**: `<!-- EOSA[디자인]: 입력폼 패턴 기준 미준수 의심 (Rule ID: DES-9.1) -- 제목·단일 열·필수 구분·액션 버튼 위치 일관성 확인 -->`
- **근거**: KRDS 가이드라인 기본 패턴 입력폼, 자체 검증 체크리스트 입력폼 1·2·4·6·7·8·9

### DES-9.2 개인 식별 정보 입력 패턴

- **심각도**: 높음
- **기본 동작**: 개인 식별 정보(이름·생년월일·성별·전화번호·주민등록번호·여권번호) 요청 시 활용 목적을 입력폼 상단 또는 필드 주변에 명확히 설명. 입력 필드의 복사·붙여넣기 허용(보안 모듈 예외). 기본값 설정 금지(성별 라디오 기본 선택 금지, 날짜 필드 기본 날짜 금지). 플레이스홀더는 입력 유도 문구 또는 자리 표시자(`000-0000-0000`)로만 사용하고 실제 입력값처럼 보이는 예시(예: `010-1234-5678`) 금지
- **올바른 예시 (HTML)**:
  ```html
  <!-- 활용 목적 안내 -->
  <div class="notice-area">
    <p>입력하신 정보는 본인 확인 및 신청 처리 목적으로만 사용됩니다.</p>
  </div>

  <!-- 이름 입력: 기본값 없음, 유도 문구 플레이스홀더 -->
  <div class="form-group">
    <div class="form-tit"><label for="user-name">이름</label></div>
    <div class="form-conts">
      <input type="text" id="user-name" class="krds-input"
             autocomplete="name" placeholder="이름을 입력해 주세요">
    </div>
  </div>

  <!-- 성별: 기본 선택값 없음 -->
  <fieldset>
    <legend>성별</legend>
    <label><input type="radio" name="gender" value="M"> 남성</label>
    <label><input type="radio" name="gender" value="F"> 여성</label>
    <!-- 특정 성별 기본 선택 금지 -->
  </fieldset>
  ```
- **의심 패턴**: 개인정보 활용 목적 설명 없음, `onpaste="return false"` 붙여넣기 차단, 성별 라디오 기본값 설정, 날짜 필드에 기본 날짜 값, 플레이스홀더에 `010-1234-5678` 같은 실제 데이터처럼 보이는 예시
- **주석 템플릿**: `<!-- EOSA[디자인]: 개인 식별 정보 입력 기준 미준수 의심 (Rule ID: DES-9.2) -- 목적 설명, 기본값 금지, 붙여넣기 허용 확인 -->`
- **근거**: KRDS 가이드라인 기본 패턴 개인 식별 정보 입력, 자체 검증 체크리스트 개인 식별 정보 입력 1·2·3·4

---

## DES-8.0 AI 서비스 UI

### DES-8.1 AI 생성 콘텐츠 표시

- **심각도**: 중간
- **기본 동작**: AI가 생성한 콘텐츠는 AI 생성물임을 명확히 표시. 사용자가 AI 응답과 공식 정보를 혼동하지 않도록 구분
- **올바른 예시 (HTML)**:
  ```html
  <section class="ai-response" role="region" aria-label="AI 응답">
    <span class="ai-badge">AI 생성 응답</span>
    <div>{{ ai_generated_content }}</div>
    <p class="disclaimer">
      <small>이 응답은 AI가 생성한 내용으로, 공식 정보와 다를 수 있습니다.
        정확한 정보는 <a href="/official">공식 안내</a>를 참조하세요.</small>
    </p>
  </section>
  ```
- **의심 패턴**: AI 생성 콘텐츠에 출처 표시 없음, 공식 안내와 AI 응답 구분 없음
- **주석 템플릿**: `<!-- EOSA[디자인]: AI 생성 콘텐츠 표시 누락 의심 (Rule ID: DES-8.1) -- AI 생성물임을 명확히 표시하고 공식 정보와 구분 필요 -->`
- **근거**: KRDS 가이드라인 Ⅱ 디자인 원칙 (신뢰할 수 있는 서비스), KISA AI 보안 안내서

---

## 버전 변경 이력

- **1.1 (2026-06-24)**: 공식 자체 검증 체크리스트(2024.11) 반영. KRDS 컴포넌트 라이브러리(DES-0.x), 헤더 내부 구성 상세화(DES-1.2), 푸터(DES-1.3), 브레드크럼(DES-3.3), 링크 상세 규칙(DES-5.2), 날짜 입력(DES-6.4), 텍스트 영역(DES-6.5), 파일 업로드(DES-6.6), 입력폼 패턴(DES-9.1), 개인 식별 정보 입력(DES-9.2) 신규 추가. krds-react/krds-vue 프레임워크 지원 추가
- **1.0 (2026-06-19)**: KRDS PDF(17,611줄) 기반 초안 작성. 아이덴티티(DES-1.x), 디자인 스타일(DES-2.x), 탐색(DES-3.x), 콘텐츠 표현(DES-4.x), 액션(DES-5.x), 입력(DES-6.x), 피드백(DES-7.x), AI 서비스 UI(DES-8.x)
