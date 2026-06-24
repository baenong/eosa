---
guideline_id: accessibility-kwcag22
guideline_name: 웹접근성 KWCAG 2.2
version: "2.2"
legal_basis: "한국형 웹 콘텐츠 접근성 지침 2.2 (KS X OT0003:2022), 장애인차별금지 및 권리구제 등에 관한 법률, 전자정부법 제32조"
source: "국가표준 KS X OT0003:2022 — 한국정보통신기술협회(TTA) 제정"
last_updated: "2026-06-19"
next_review: "2027-06-19"
---

# 웹접근성 가이드라인 KWCAG 2.2
# 4원칙 14지침 33검사항목 전체 포함

## 적용 범위

공공기관이 운영하는 웹사이트 및 모바일 웹 서비스의 HTML, CSS, JavaScript 코드.

---

## ACC-1.0 인식의 용이성 (Perceivable)

### ACC-1.1 이미지 대체 텍스트
KWCAG 5.1.1

- **심각도**: 높음 (Level A)
- **기본 동작**: 모든 `img` 태그에 `alt` 속성 포함. 정보 전달 이미지는 의미 있는 텍스트, 장식용은 빈 문자열
- **올바른 예시**:
  ```html
  <!-- 정보 전달 이미지 -->
  <img src="logo.png" alt="행정안전부 로고">

  <!-- 장식용 이미지 -->
  <img src="divider.png" alt="">

  <!-- 기능 버튼 내 아이콘 -->
  <button><img src="search.png" alt="검색"></button>

  <!-- SVG -->
  <svg aria-label="파일 첨부" role="img">...</svg>
  ```
- **의심 패턴**: `<img src="...">` (alt 없음), `alt="image"` (의미 없는 값)
- **주석 템플릿**: `<!-- EOSA[접근성]: img alt 속성 누락 의심 (Rule ID: ACC-1.1) — 이미지 내용 설명 또는 alt="" 추가 -->`
- **근거**: KS X OT0003:2022 검사항목 5.1.1

### ACC-1.2 자막 제공
KWCAG 5.2.1

- **심각도**: 높음 (Level A)
- **기본 동작**: `<video>` 태그에 자막 트랙(`<track kind="subtitles">`) 제공. 오디오 전용 콘텐츠는 대본 텍스트 함께 제공
- **올바른 예시**:
  ```html
  <video controls>
    <source src="video.mp4" type="video/mp4">
    <track kind="subtitles" src="video_ko.vtt" srclang="ko" label="한국어 자막" default>
    <p>이 브라우저는 비디오를 지원하지 않습니다. <a href="transcript.html">대본 보기</a></p>
  </video>
  ```
- **의심 패턴**: `<video>` 태그에 `<track>` 없음
- **주석 템플릿**: `<!-- EOSA[접근성]: 자막 트랙 누락 의심 (Rule ID: ACC-1.2) — <track kind="subtitles"> 추가 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 5.2.1

### ACC-1.3 표의 구성
KWCAG 5.3.1

- **심각도**: 높음 (Level A)
- **기본 동작**: 데이터 표에는 `<caption>` 제공, 헤더 셀은 `<th scope="col|row">` 사용
- **올바른 예시**:
  ```html
  <table>
    <caption>2024년 민원 처리 현황</caption>
    <thead>
      <tr>
        <th scope="col">구분</th>
        <th scope="col">접수 건수</th>
        <th scope="col">처리 건수</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1월</th>
        <td>1,200</td>
        <td>1,180</td>
      </tr>
    </tbody>
  </table>
  ```
- **의심 패턴**: `<table>` 내 모두 `<td>` 사용, `<caption>` 없음
- **주석 템플릿**: `<!-- EOSA[접근성]: 표 구조 헤더 누락 의심 (Rule ID: ACC-1.3) — <th scope> 및 <caption> 추가 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 5.3.1

### ACC-1.4 콘텐츠의 선형구조
KWCAG 5.3.2

- **심각도**: 중간 (Level A)
- **기본 동작**: DOM 소스 순서가 논리적 읽기 순서와 일치. 시각적 배치 변경은 CSS만으로 처리하고 DOM 순서 유지
- **올바른 예시**:
  ```html
  <!-- DOM 순서 = 논리적 읽기 순서 -->
  <header>...</header>
  <nav>...</nav>
  <main>...</main>
  <aside>...</aside>
  <footer>...</footer>

  <!-- 시각적 배치만 CSS로 변경 (DOM 순서 유지) -->
  <style>
    aside { float: right; }
  </style>
  ```
- **의심 패턴**: `position: absolute`로 본문보다 앞에 배치된 사이드바
- **주석 템플릿**: `<!-- EOSA[접근성]: DOM 순서가 논리적 읽기 순서와 다를 수 있음 (Rule ID: ACC-1.4) — CSS로만 시각 배치 변경 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 5.3.2

### ACC-1.5 명확한 지시사항 제공
KWCAG 5.3.3

- **심각도**: 중간 (Level A)
- **기본 동작**: 지시사항을 색·모양·위치·소리에만 의존하지 않고 텍스트로도 제공
- **올바른 예시**:
  ```html
  <!-- 나쁜 예: 색만으로 지시 -->
  <!-- <p>빨간 버튼을 클릭하세요.</p> -->

  <!-- 좋은 예: 색 + 레이블(텍스트) -->
  <p>'저장' 버튼을 클릭하세요.</p>
  <button class="btn-primary">저장</button>

  <!-- 소리 + 시각적 표시 병행 -->
  <div role="alert" aria-live="assertive">
    정답입니다! <span class="icon-correct">✓</span>
  </div>
  ```
- **의심 패턴**: `"오른쪽 버튼"`, `"빨간 항목"`, `"삐 소리 후"` 같은 단일 감각 의존 지시
- **주석 템플릿**: `<!-- EOSA[접근성]: 단일 감각 의존 지시사항 의심 (Rule ID: ACC-1.5) — 텍스트 레이블 병행 제공 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 5.3.3

### ACC-1.6 색에 무관한 콘텐츠 인식
KWCAG 5.4.1

- **심각도**: 높음 (Level A)
- **기본 동작**: 오류·상태·구분 등 정보를 색상 외에 텍스트나 아이콘으로 병행 표시
- **올바른 예시**:
  ```html
  <!-- 오류 필드: 색상 + 아이콘 + 텍스트 -->
  <input class="error" aria-invalid="true" aria-describedby="email-error">
  <span id="email-error">⚠ 올바른 이메일 주소를 입력하세요</span>

  <!-- 필수 항목: 색상 + 기호 + aria-label -->
  <label>이메일 <span class="required" aria-label="필수">*</span></label>

  <!-- 차트: 색상 + 무늬/패턴으로 구분 -->
  <svg>
    <pattern id="diagonal" patternUnits="userSpaceOnUse" width="4" height="4">
      <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#000" stroke-width="1"/>
    </pattern>
    <rect fill="url(#diagonal)"/>
  </svg>
  ```
- **의심 패턴**: CSS `color: red`만으로 오류 표시, 범례가 색상만으로 구성된 차트
- **주석 템플릿**: `<!-- EOSA[접근성]: 색상만으로 정보 전달 의심 (Rule ID: ACC-1.6) — 텍스트/아이콘/무늬 병행 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 5.4.1

### ACC-1.7 자동 재생 금지
KWCAG 5.4.2

- **심각도**: 높음 (Level A)
- **기본 동작**: 3초 이상 자동재생되는 오디오·비디오 제공하지 않음. 불가피하면 정지/일시정지/음량 조절 수단 제공
- **올바른 예시**:
  ```html
  <!-- autoplay 속성 제거 -->
  <video controls>
    <source src="intro.mp4">
  </video>

  <!-- 불가피한 경우: 정지 버튼 제공 -->
  <div class="banner-slider">
    <button id="slider-stop" aria-label="슬라이더 정지">정지</button>
  </div>

  <!-- 배경음악: 정지 수단 제공 -->
  <audio id="bg-music" loop></audio>
  <button onclick="toggleBgMusic()">배경음악 끄기</button>
  ```
- **의심 패턴**: `<video autoplay>`, `<audio autoplay loop>` (정지 수단 없음)
- **주석 템플릿**: `<!-- EOSA[접근성]: 자동 재생 의심 (Rule ID: ACC-1.7) — autoplay 제거 또는 정지 수단 제공 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 5.4.2

### ACC-1.8 텍스트 콘텐츠의 명도 대비
KWCAG 5.4.3

- **심각도**: 중간 (Level AA)
- **기본 동작**: 텍스트와 배경 간 명도 대비 4.5:1 이상. 18pt(24px) 이상 또는 14pt(18.67px) Bold는 3:1 이상
- **올바른 예시**:
  ```css
  /* 본문 텍스트: 충분한 대비 */
  body { color: #333333; background: #ffffff; } /* 12.6:1 */

  /* 큰 텍스트(24px 이상): 3:1 이상이면 OK */
  h1 { color: #767676; background: #ffffff; font-size: 24px; }

  /* 위험 패턴 (흰 배경 기준) */
  /* .hint { color: #aaaaaa; } — 2.32:1, NG */
  ```
- **의심 패턴**: `#999`, `#aaa`, `#ccc` 텍스트 색상 (흰 배경 기준 불충분)
- **주석 템플릿**: `/* EOSA[접근성]: 명도대비 불충분 의심 (Rule ID: ACC-1.8) — 4.5:1 이상 확인 필요 */`
- **근거**: KS X OT0003:2022 검사항목 5.4.3

### ACC-1.9 콘텐츠 간의 구분
KWCAG 5.4.4

- **심각도**: 낮음 (Level A)
- **기본 동작**: 이웃한 콘텐츠 영역을 테두리·배경색·간격 중 하나 이상으로 시각적 구분
- **올바른 예시**:
  ```css
  /* 방법 1: 테두리 */
  .card { border: 1px solid #e0e0e0; }

  /* 방법 2: 배경색 차이 */
  .section-a { background: #f5f5f5; }
  .section-b { background: #ffffff; }

  /* 방법 3: 간격 */
  .list-item + .list-item { margin-top: 16px; }
  ```
- **의심 패턴**: 배경색·테두리·간격 없이 붙어있는 카드/목록
- **주석 템플릿**: `/* EOSA[접근성]: 이웃한 콘텐츠 구분 없음 의심 (Rule ID: ACC-1.9) — 테두리/배경색/간격 추가 필요 */`
- **근거**: KS X OT0003:2022 검사항목 5.4.4

---

## ACC-2.0 운용의 용이성 (Operable)

### ACC-2.1 키보드 사용 보장
KWCAG 6.1.1

- **심각도**: 높음 (Level A)
- **기본 동작**: 모든 기능을 키보드만으로 사용 가능. 마우스 전용 이벤트 사용 시 키보드 대응 이벤트 추가
- **올바른 예시**:
  ```javascript
  // mouseover/mouseout과 함께 focus/blur 제공
  element.addEventListener('mouseover', showTooltip);
  element.addEventListener('focus', showTooltip);
  element.addEventListener('mouseout', hideTooltip);
  element.addEventListener('blur', hideTooltip);

  // 커스텀 클릭 요소에 키보드 지원
  div.setAttribute('role', 'button');
  div.setAttribute('tabindex', '0');
  div.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') div.click();
  });
  ```
- **의심 패턴**: `onclick`만 있고 `role="button"` + `tabindex` 없는 `<div>`, `<span>`
- **주석 템플릿**: `// EOSA[접근성]: 키보드 접근 불가 의심 (Rule ID: ACC-2.1) — tabindex=0 및 keydown 이벤트 추가 필요`
- **근거**: KS X OT0003:2022 검사항목 6.1.1

### ACC-2.2 초점 이동과 표시
KWCAG 6.1.2

- **심각도**: 높음 (Level AA)
- **기본 동작**: 포커스 스타일 제거하지 않음. 키보드 초점이 논리적 순서로 이동하며 포커스 트랩 없음
- **올바른 예시**:
  ```css
  /* outline 제거 시 대체 스타일 반드시 제공 */
  button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px #0066cc;
  }
  ```
  ```javascript
  // 모달 내 포커스 트랩 (ESC로 닫기 포함)
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') trapFocusInModal(e, modal);
    if (e.key === 'Escape') closeModal();
  });
  ```
- **의심 패턴**: `outline: none` 단독 사용, `tabindex="-1"` 남발로 건너뛰어지는 요소
- **주석 템플릿**: `/* EOSA[접근성]: 포커스 스타일 제거 의심 (Rule ID: ACC-2.2) — :focus-visible 대체 스타일 제공 필요 */`
- **근거**: KS X OT0003:2022 검사항목 6.1.2

### ACC-2.3 조작 가능
KWCAG 6.1.3

- **심각도**: 중간 (Level A)
- **기본 동작**: 버튼·링크 등 인터랙티브 요소의 터치 대상 최소 44×44px 확보
- **올바른 예시**:
  ```css
  /* 터치 대상 최소 크기 */
  button, a {
    min-width: 44px;
    min-height: 44px;
  }

  /* 시각적 크기가 작아도 패딩으로 클릭 영역 확장 */
  .icon-btn {
    padding: 12px;
  }
  ```
- **의심 패턴**: `height: 20px; width: 20px` 아이콘 버튼 패딩 없음
- **주석 템플릿**: `/* EOSA[접근성]: 터치 대상 크기 미달 의심 (Rule ID: ACC-2.3) — 최소 44×44px 확보 필요 */`
- **근거**: KS X OT0003:2022 검사항목 6.1.3

### ACC-2.4 문자 단축키
KWCAG 6.1.4

- **심각도**: 중간 (Level A)
- **기본 동작**: 단일 문자 키만으로 동작하는 단축키 제공 시 비활성화 또는 재설정 수단 제공
- **올바른 예시**:
  ```javascript
  const shortcutsEnabled = userSettings.shortcuts ?? true;

  document.addEventListener('keydown', (e) => {
    if (!shortcutsEnabled) return;
    // 입력 필드 포커스 중에는 단축키 비활성화
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (e.key === 's' && !e.ctrlKey) saveDocument();
  });
  ```
- **의심 패턴**: 수식어 키(Ctrl/Alt/Shift) 없이 단일 알파벳 키로 전역 동작 실행
- **주석 템플릿**: `// EOSA[접근성]: 단일 문자 단축키 의심 (Rule ID: ACC-2.4) — 비활성화 옵션 또는 수식어 키 조합 필요`
- **근거**: KS X OT0003:2022 검사항목 6.1.4

### ACC-2.5 응답시간 조절
KWCAG 6.2.1

- **심각도**: 높음 (Level A)
- **기본 동작**: 세션 타임아웃 발생 전 최소 20초 이상 전에 사용자에게 알림 후 연장/해제 수단 제공
- **올바른 예시**:
  ```javascript
  function scheduleSessionWarning(sessionDurationMs) {
    const warningMs = sessionDurationMs - 2 * 60 * 1000; // 2분 전
    setTimeout(() => {
      showModal({
        message: '세션이 2분 후 만료됩니다.',
        actions: [
          { label: '연장', onClick: extendSession },
          { label: '로그아웃', onClick: logout }
        ]
      });
    }, warningMs);
  }
  ```
- **의심 패턴**: `setTimeout(logout, timeout)` 경고 없이 자동 로그아웃
- **주석 템플릿**: `// EOSA[접근성]: 시간제한 경고 없음 의심 (Rule ID: ACC-2.5) — 만료 전 20초 이상 전 안내 및 연장 수단 필요`
- **근거**: KS X OT0003:2022 검사항목 6.2.1

### ACC-2.6 정지 기능 제공
KWCAG 6.2.2

- **심각도**: 높음 (Level A)
- **기본 동작**: 자동 슬라이더·스크롤 배너 등 자동 변경 콘텐츠에 정지/일시정지 버튼 제공
- **올바른 예시**:
  ```html
  <section class="banner-slider" aria-label="주요 공지 슬라이더">
    <button id="slider-pause" aria-pressed="false" onclick="toggleSlider()">정지</button>
    <ul class="slides">...</ul>
  </section>
  ```
  ```javascript
  function toggleSlider() {
    const btn = document.getElementById('slider-pause');
    const isPaused = btn.getAttribute('aria-pressed') === 'true';
    isPaused ? startSlider() : stopSlider();
    btn.setAttribute('aria-pressed', String(!isPaused));
    btn.textContent = isPaused ? '정지' : '재생';
  }
  ```
- **의심 패턴**: `setInterval`로 자동 슬라이드 구현, 정지 버튼 없음
- **주석 템플릿**: `// EOSA[접근성]: 자동 변경 콘텐츠 정지 수단 없음 (Rule ID: ACC-2.6) — 정지/일시정지 버튼 추가 필요`
- **근거**: KS X OT0003:2022 검사항목 6.2.2

### ACC-2.7 깜빡임과 번쩍임 사용 제한
KWCAG 6.3.1

- **심각도**: 높음 (Level A)
- **기본 동작**: 초당 3~50회 깜빡이거나 번쩍이는 콘텐츠 제공하지 않음. 불가피하면 3초 미만으로 제한
- **올바른 예시**:
  ```css
  /* 안전: 초당 1회(1Hz), 3회 반복 = 3초 */
  @keyframes blink-slow {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  .notification { animation: blink-slow 1s ease 3; }

  /* 금지: 빠른 번쩍임 */
  /* .alert { animation: flash 0.1s infinite; } — 10Hz, NG */
  ```
- **의심 패턴**: CSS/JS로 빠른 깜빡임 효과, 빠른 전환 GIF 애니메이션
- **주석 템플릿**: `/* EOSA[접근성]: 빠른 깜빡임 의심 (Rule ID: ACC-2.7) — 초당 3~50회 범위 확인 필요 */`
- **근거**: KS X OT0003:2022 검사항목 6.3.1

### ACC-2.8 반복 영역 건너뛰기
KWCAG 6.4.1

- **심각도**: 높음 (Level A)
- **기본 동작**: 페이지 최상단 첫 번째 요소로 "본문 바로가기" 링크 제공 (시각적으로 보이도록 구현 권장)
- **올바른 예시**:
  ```html
  <!-- <body> 최상단 첫 번째 요소 -->
  <a href="#main-content" class="skip-link">본문 바로가기</a>

  <header>...</header>
  <nav>...</nav>
  <main id="main-content" tabindex="-1">...</main>
  ```
  ```css
  .skip-link { position: absolute; top: -999px; left: 0; }
  .skip-link:focus { top: 0; z-index: 9999; }
  ```
- **의심 패턴**: `<body>` 첫 자식이 `<header>` 또는 `<nav>` (건너뛰기 링크 없음)
- **주석 템플릿**: `<!-- EOSA[접근성]: 건너뛰기 링크 없음 의심 (Rule ID: ACC-2.8) — <a href="#main"> 최상단 추가 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 6.4.1

### ACC-2.9 제목 제공
KWCAG 6.4.2

- **심각도**: 중간 (Level A)
- **기본 동작**: 모든 페이지에 고유한 `<title>` 제공. `h1~h6` 계층적 사용 (단계 건너뛰기 금지). 모든 `<iframe>`에 `title` 속성
- **올바른 예시**:
  ```html
  <!-- 페이지 고유 제목 -->
  <title>민원 신청 — 행정안전부 민원포털</title>

  <!-- 올바른 제목 계층 -->
  <h1>행정민원 서비스</h1>
    <h2>신청 안내</h2>
      <h3>필요 서류</h3>
    <h2>온라인 신청</h2>

  <!-- iframe 제목 -->
  <iframe src="map.html" title="오시는 길 지도"></iframe>
  ```
- **의심 패턴**: `<title>` 없음, 모든 페이지 동일 제목, h1 → h3 건너뜀, `<iframe title>` 없음
- **주석 템플릿**: `<!-- EOSA[접근성]: 제목 구조 이상 의심 (Rule ID: ACC-2.9) — 고유 title 및 h1~h6 계층 준수 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 6.4.2

### ACC-2.10 적절한 링크 텍스트
KWCAG 6.4.3

- **심각도**: 중간 (Level A)
- **기본 동작**: 링크 텍스트만으로 또는 주변 맥락으로 목적지·용도를 이해할 수 있도록 제공
- **올바른 예시**:
  ```html
  <!-- 나쁜 예 -->
  <!-- <a href="notice.html">여기를 클릭하세요</a> -->

  <!-- 좋은 예 -->
  <a href="notice.html">2024년 민원 처리 공지사항 보기</a>
  <a href="file.pdf">개인정보처리방침 PDF 다운로드</a>

  <!-- 아이콘 링크: aria-label로 목적지 제공 -->
  <a href="home.html" aria-label="홈 페이지로 이동">
    <img src="home-icon.svg" alt="">
  </a>

  <!-- "더보기" 패턴 -->
  <a href="notices.html" aria-label="공지사항 더보기">더보기</a>
  ```
- **의심 패턴**: `"여기"`, `"클릭"`, `"바로가기"`, `"더보기"` 단독 사용 (aria-label 없음)
- **주석 템플릿**: `<!-- EOSA[접근성]: 링크 텍스트 불명확 의심 (Rule ID: ACC-2.10) — aria-label 또는 구체적 텍스트로 목적지 명시 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 6.4.3

### ACC-2.11 고정된 참조 위치 정보
KWCAG 6.4.4

- **심각도**: 낮음 (Level AA)
- **기본 동작**: 전자출판(ePub 등) 형식 웹 페이지에서 확대/축소 후에도 페이지 번호 등 참조 위치 정보 유지
- **올바른 예시**:
  ```html
  <span epub:type="pagebreak" id="page-42" aria-label="42페이지">42</span>
  ```
- **적용 범위**: 전자출판 형식 웹페이지에만 적용. 일반 웹사이트는 해당 없음
- **근거**: KS X OT0003:2022 검사항목 6.4.4

### ACC-2.12 단일 포인터 입력 지원
KWCAG 6.5.1

- **심각도**: 중간 (Level A)
- **기본 동작**: 멀티터치(핀치줌, 두 손가락 탭 등) 또는 경로기반 동작(스와이프, 드래그)에 단일 탭/클릭 대안 제공
- **올바른 예시**:
  ```javascript
  // 핀치줌 대신 확대/축소 버튼 제공
  document.getElementById('zoom-in').addEventListener('click', () => zoomIn());
  document.getElementById('zoom-out').addEventListener('click', () => zoomOut());

  // 스와이프 슬라이더: 이전/다음 버튼도 함께 제공
  slider.addEventListener('touchstart', handleSwipeStart, { passive: true });
  document.getElementById('prev-btn').addEventListener('click', slidePrev);
  document.getElementById('next-btn').addEventListener('click', slideNext);
  ```
- **의심 패턴**: 핀치줌만 지원하고 확대 버튼 없는 이미지 뷰어
- **주석 템플릿**: `// EOSA[접근성]: 멀티터치 전용 기능 의심 (Rule ID: ACC-2.12) — 단일 포인터 대안 제공 필요`
- **근거**: KS X OT0003:2022 검사항목 6.5.1

### ACC-2.13 포인터 입력 취소
KWCAG 6.5.2

- **심각도**: 중간 (Level A)
- **기본 동작**: 기능을 `mousedown`/`touchstart`(눌렀을 때)가 아닌 `mouseup`/`click`(뗐을 때)에 실행하여 취소 가능하게 구현
- **올바른 예시**:
  ```javascript
  // 나쁜 예: mousedown에 즉시 실행
  // button.addEventListener('mousedown', deleteRecord);

  // 좋은 예: click 이벤트 + 확인 절차
  button.addEventListener('click', async () => {
    const confirmed = await showConfirmDialog('삭제하시겠습니까?');
    if (confirmed) deleteRecord();
  });
  ```
- **의심 패턴**: 삭제/결제 등 중요 기능을 `mousedown` 또는 `touchstart`에서 즉시 실행
- **주석 템플릿**: `// EOSA[접근성]: mousedown 즉시 실행 의심 (Rule ID: ACC-2.13) — click 이벤트로 변경 또는 실행취소 수단 필요`
- **근거**: KS X OT0003:2022 검사항목 6.5.2

### ACC-2.14 레이블과 네임
KWCAG 6.5.3

- **심각도**: 중간 (Level AA)
- **기본 동작**: 시각적으로 보이는 텍스트 레이블이 접근성 네임(aria-label, aria-labelledby)의 앞부분에 포함되도록 구현
- **올바른 예시**:
  ```html
  <!-- 시각적 텍스트 "검색"이 aria-label 앞부분에 포함 -->
  <button aria-label="검색 — 전체 사이트 검색 실행">검색</button>

  <!-- 나쁜 예: 시각적 텍스트 "저장"이 aria-label에 없음 -->
  <!-- <button aria-label="문서를 서버에 업로드">저장</button> -->

  <!-- 좋은 예: 시각적 텍스트 포함 -->
  <button aria-label="저장 — 문서를 서버에 업로드">저장</button>
  ```
- **의심 패턴**: 버튼 텍스트와 `aria-label`이 다른 내용
- **주석 템플릿**: `<!-- EOSA[접근성]: aria-label이 시각적 텍스트와 불일치 의심 (Rule ID: ACC-2.14) — 시각적 텍스트를 네임 앞부분에 포함 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 6.5.3

### ACC-2.15 동작기반 작동
KWCAG 6.5.4

- **심각도**: 중간 (Level A)
- **기본 동작**: 기기 흔들기/기울이기 등 동작기반 기능에 UI 버튼 대안 제공 및 비활성화 옵션 제공
- **올바른 예시**:
  ```javascript
  // 흔들기 실행취소 — UI 버튼도 함께 제공
  if (userPrefs.motionControl) {
    window.addEventListener('devicemotion', (e) => {
      if (detectShake(e)) undoAction();
    });
  }
  document.getElementById('undo-btn').addEventListener('click', undoAction);
  ```
- **의심 패턴**: 흔들기/기울이기로만 동작하는 기능 (UI 대안 없음)
- **주석 템플릿**: `// EOSA[접근성]: 동작기반 전용 기능 의심 (Rule ID: ACC-2.15) — UI 버튼 대안 및 비활성화 옵션 추가 필요`
- **근거**: KS X OT0003:2022 검사항목 6.5.4

---

## ACC-3.0 이해의 용이성 (Understandable)

### ACC-3.1 기본 언어 표시
KWCAG 7.1.1

- **심각도**: 높음 (Level A)
- **기본 동작**: `<html>` 태그에 `lang` 속성 지정. 페이지 내 다른 언어 텍스트는 해당 요소에 `lang` 속성 추가
- **올바른 예시**:
  ```html
  <html lang="ko">

  <!-- 페이지 내 다른 언어 -->
  <p>영어 표현: <span lang="en">Hello, World!</span></p>
  ```
- **의심 패턴**: `<html>` (lang 없음), `<html lang="">` (빈 값)
- **주석 템플릿**: `<!-- EOSA[접근성]: html lang 속성 누락 (Rule ID: ACC-3.1) — <html lang="ko"> 추가 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 7.1.1

### ACC-3.2 사용자 요구에 따른 실행
KWCAG 7.2.1

- **심각도**: 높음 (Level A)
- **기본 동작**: 포커스 이동만으로 페이지 전환·폼 제출·새 창이 자동 실행되지 않음. `select` `onChange` 자동 제출 금지
- **올바른 예시**:
  ```javascript
  // 나쁜 예: select onChange로 자동 이동
  // select.addEventListener('change', () => location.href = select.value);

  // 좋은 예: 명시적 이동 버튼 제공
  document.getElementById('go-btn').addEventListener('click', () => {
    location.href = select.value;
  });
  ```
  ```html
  <!-- 새 창 사전 안내 -->
  <a href="external.html" target="_blank">
    외부 사이트 <span class="sr-only">(새 창으로 열림)</span>
  </a>
  ```
- **의심 패턴**: `select.onchange = () => this.form.submit()`, focus 이벤트에서 자동 페이지 이동
- **주석 템플릿**: `// EOSA[접근성]: 자동 실행 의심 (Rule ID: ACC-3.2) — onChange 자동 제출 제거 및 명시적 실행 버튼 추가 필요`
- **근거**: KS X OT0003:2022 검사항목 7.2.1

### ACC-3.3 찾기 쉬운 도움 정보
KWCAG 7.2.2

- **심각도**: 낮음 (Level A)
- **기본 동작**: 도움말/연락처 정보가 제공되는 경우 모든 페이지에서 동일한 상대적 위치에 배치
- **올바른 예시**:
  ```html
  <!-- 모든 페이지 동일 위치 (예: 푸터 첫 번째 항목) -->
  <footer>
    <nav aria-label="도움 정보">
      <a href="help.html">도움말(FAQ)</a>
      <a href="contact.html">담당자 문의</a>
      <a href="chatbot.html">챗봇 상담</a>
    </nav>
  </footer>
  ```
- **의심 패턴**: 도움말 링크가 일부 페이지에만 존재하거나 페이지마다 위치가 다름
- **근거**: KS X OT0003:2022 검사항목 7.2.2

### ACC-3.4 오류 정정
KWCAG 7.3.1

- **심각도**: 중간 (Level A)
- **기본 동작**: 폼 오류 발생 시 오류 항목과 수정 방법을 텍스트로 안내하고 오류 발생 위치로 초점 이동
- **올바른 예시**:
  ```html
  <input type="email" aria-invalid="true" aria-describedby="email-error">
  <span id="email-error" role="alert">
    이메일 형식이 올바르지 않습니다. 예: user@example.com
  </span>
  ```
  ```javascript
  function showError(inputEl, message) {
    inputEl.setAttribute('aria-invalid', 'true');
    document.getElementById(inputEl.getAttribute('aria-describedby')).textContent = message;
    inputEl.focus();
  }
  ```
- **주석 템플릿**: `<!-- EOSA[접근성]: 오류 안내 텍스트 누락 의심 (Rule ID: ACC-3.4) — aria-describedby로 오류 메시지 연결 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 7.3.1

### ACC-3.5 레이블 제공
KWCAG 7.3.2

- **심각도**: 높음 (Level A)
- **기본 동작**: 모든 `input`, `select`, `textarea`에 `label` 연결 (for/id 또는 aria-label 또는 aria-labelledby)
- **올바른 예시**:
  ```html
  <!-- for/id 연결 -->
  <label for="user-email">이메일 주소</label>
  <input type="email" id="user-email" name="email">

  <!-- aria-label (시각적 레이블 없을 때) -->
  <input type="search" aria-label="사이트 내 검색">

  <!-- fieldset/legend (라디오·체크박스 그룹) -->
  <fieldset>
    <legend>성별</legend>
    <label><input type="radio" name="gender" value="m"> 남</label>
    <label><input type="radio" name="gender" value="f"> 여</label>
  </fieldset>
  ```
- **의심 패턴**: `placeholder`만 있고 `label` 없는 `input`
- **주석 템플릿**: `<!-- EOSA[접근성]: label 없는 form 요소 의심 (Rule ID: ACC-3.5) — label[for] 또는 aria-label 추가 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 7.3.2

### ACC-3.6 접근 가능한 인증
KWCAG 7.3.3

- **심각도**: 높음 (Level AA)
- **기본 동작**: 인증 과정에서 인지 기능 테스트(이미지 CAPTCHA 등)만 단독 사용 금지. 자동완성 허용 및 대체 인증 수단 제공
- **올바른 예시**:
  ```html
  <!-- 자동완성 허용 -->
  <input type="email" id="email" autocomplete="email">
  <input type="password" id="pwd" autocomplete="current-password">

  <!-- CAPTCHA 대체 수단 병행 제공 -->
  <div class="auth-options">
    <div class="captcha">...</div>
    <a href="?auth=email-otp">이메일 인증으로 대신하기</a>
  </div>
  ```
- **의심 패턴**: `autocomplete="off"` 로그인 폼, CAPTCHA 단독 인증 (대체 수단 없음)
- **주석 템플릿**: `<!-- EOSA[접근성]: 인지 기능 테스트 단독 인증 의심 (Rule ID: ACC-3.6) — 자동완성 허용 또는 대체 인증 수단 제공 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 7.3.3

### ACC-3.7 반복 입력 정보
KWCAG 7.3.4

- **심각도**: 낮음 (Level A)
- **기본 동작**: 다단계 폼에서 이전 단계 입력 정보를 자동완성 또는 선택 입력 가능하게 제공 (비밀번호 등 보안 정보 제외)
- **올바른 예시**:
  ```html
  <!-- autocomplete 속성으로 브라우저 자동완성 지원 -->
  <input type="text" name="name" autocomplete="name">
  <input type="email" autocomplete="email">
  <input type="tel" autocomplete="tel">
  <input type="text" name="address" autocomplete="street-address">

  <!-- 이전 단계 정보 재사용 체크박스 -->
  <label>
    <input type="checkbox" id="same-as-orderer" onchange="copyOrdererInfo(this)">
    배송지를 주문자 정보와 동일하게 설정
  </label>
  ```
- **의심 패턴**: 다단계 폼에서 이미 입력한 이름/주소를 재입력 요구, `autocomplete` 속성 없음
- **주석 템플릿**: `<!-- EOSA[접근성]: 반복 입력 자동완성 미지원 의심 (Rule ID: ACC-3.7) — autocomplete 속성 추가 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 7.3.4

---

## ACC-4.0 견고성 (Robust)

### ACC-4.1 마크업 오류 방지
KWCAG 8.1.1

- **심각도**: 중간 (Level A)
- **기본 동작**: HTML 요소 올바른 중첩, 시작/종료 태그 일치, 페이지 내 `id` 값 고유 유지, 속성 중복 선언 금지
- **올바른 예시**:
  ```html
  <!-- 올바른 중첩 -->
  <ul>
    <li><a href="#">링크</a></li>
  </ul>

  <!-- id 고유성 -->
  <input id="email-field">
  <label for="email-field">이메일</label>
  ```
  ```javascript
  // 동적 생성 시 고유 ID 보장
  let counter = 0;
  function createInput(label) {
    const id = `input-${++counter}`;
    return `<label for="${id}">${label}</label><input id="${id}">`;
  }
  ```
- **의심 패턴**: 같은 `id` 여러 요소에 사용, 태그 미닫힘, `<li>` 없이 바로 `<ul>` 안에 `<div>`
- **주석 템플릿**: `<!-- EOSA[접근성]: 마크업 오류 의심 (Rule ID: ACC-4.1) — HTML 유효성 검사 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 8.1.1

### ACC-4.2 웹 애플리케이션 접근성 준수
KWCAG 8.2.1

- **심각도**: 높음 (Level A)
- **기본 동작**: 커스텀 컴포넌트에 적절한 ARIA 역할(role)·상태(state)·속성(property) 부여. 동적 상태 변경 시 ARIA 속성도 함께 업데이트
- **올바른 예시**:
  ```html
  <!-- 커스텀 탭 -->
  <div role="tablist" aria-label="문서 섹션">
    <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">개요</button>
    <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">상세</button>
  </div>
  <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">...</div>
  <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>...</div>

  <!-- 동적 상태 안내 -->
  <div aria-live="polite" aria-atomic="true" id="status-msg"></div>
  ```
  ```javascript
  function setLoading(isLoading) {
    btn.setAttribute('aria-busy', String(isLoading));
    btn.disabled = isLoading;
    document.getElementById('status-msg').textContent = isLoading ? '처리 중...' : '완료';
  }
  ```
- **의심 패턴**: `<div onclick>` 만든 드롭다운 (role/aria 없음), `aria-hidden="true"` 인터랙티브 요소
- **주석 템플릿**: `<!-- EOSA[접근성]: ARIA 역할/속성 누락 의심 (Rule ID: ACC-4.2) — role, aria-* 속성 추가 필요 -->`
- **근거**: KS X OT0003:2022 검사항목 8.2.1

---

## 버전 변경 이력

- **2.2 (KS X OT0003:2022, 2026-06-19 갱신)**: 4원칙 14지침 33검사항목 전체 반영. 공식 원문 기반으로 재작성. 입력 방식(ACC-2.12~2.15), 이해의 용이성 전체(ACC-3.x), 견고성(ACC-4.x) 보강
- **2.1 (초안)**: 9개 규칙만 포함, 공식 원문 반영 전 버전
