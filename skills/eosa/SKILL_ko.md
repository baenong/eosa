> **참고**: 이 파일은 `SKILL.md`의 한국어 참조 버전입니다. Claude(Agent)가 실제로 사용하는 활성 버전은 `SKILL.md`입니다.

---

# EOSA — 한국 공공기관 코딩 가이드라인

한국 공공기관 소프트웨어 표준을 내면화한 개발자처럼 코드를 작성합니다.
가이드라인은 외부 제약이 아니라 자연스러운 개발 습관입니다.

## 지속성

**모든 응답에서 활성 상태 유지.** `/eosa off`가 입력될 때까지 유지됩니다.
불확실한 경우에도 활성 상태를 유지합니다. 현재 변경사항 검토는 `/eosa-review`, 전체 감사는 `/eosa-audit`을 사용하세요.

## 워크플로우

### 1단계: 설정 확인

`$CLAUDE_PROJECT_DIR/.eosa/config.json`을 읽습니다.

- **파일 없음** → 초기화 워크플로우 (2~4단계)
- **파일 있음** → 활성화 워크플로우 (5단계)

---

### 초기화 워크플로우 (최초 실행)

#### 2단계: 가이드라인 선택

다음 내용을 단일 메시지로 제시합니다:

```
이 프로젝트에 적용할 공공기관 가이드라인을 선택하세요 (복수 선택 가능):

[1] 정보보안 및 개인정보보호 (PIPA) — 필수 권장
    SQL 인젝션 방지, 개인정보 암호화, 비밀값 관리, XSS 방지

[2] 웹접근성 KWCAG 2.2 — 웹 UI 포함 시 필수
    img alt 속성, 키보드 접근성, 색상 대비, 폼 레이블

[3] 디지털 정부서비스 UI/UX (KRDS) — 공공기관 서비스 배포 시 권장
    KRDS 컴포넌트 라이브러리 (krds-uiux/krds-react/krds-vue), 정부 UI 컴포넌트, 디자인 토큰

[전체] 모두 적용 (권장)
```

사용자 응답을 기다립니다.

#### 3단계: .eosa/config.json 생성

선택에 따라 `.eosa/` 디렉토리를 생성하고 `config.json`을 작성합니다.
파일 형식은 `SKILL.md`의 Step 3을 참조하세요. 선택된 가이드라인만 `active_guidelines`에 포함합니다.

#### 4단계: CLAUDE.md 업데이트

현재 디렉토리의 `CLAUDE.md`를 읽습니다 (없으면 빈 문자열로 처리).
`<!-- EOSA:START -->` ~ `<!-- EOSA:END -->` 사이의 기존 블록을 찾아 교체하거나, 없으면 파일 끝에 추가합니다.

삽입할 블록에는 선택된 가이드라인의 섹션만 포함합니다(선택되지 않은 섹션 제외).
블록 전체 내용은 `SKILL.md`의 Step 4를 참조하세요.

완료 후 사용자에게 알립니다:

```
EOSA 초기화 완료. 이 프로젝트는 이제 [선택된 가이드라인]을 자동으로 준수합니다.
다음 세션부터 자동으로 활성화됩니다.
/eosa-review: 현재 변경사항 검토 | /eosa-audit: 전체 감사 | /eosa-help: 명령어 참조 | /eosa-add-guideline: 커스텀 가이드라인 추가
```

---

### 활성화 워크플로우 (이후 실행)

#### 5단계: 활성화 확인 (가이드라인 파일 로드 금지)

`config.json`을 읽어 `active_guidelines` 목록만 확인합니다.
**이 단계에서 `guidelines/*.md` 파일을 읽지 않습니다.**
일상 코딩에 필요한 모든 규칙은 CLAUDE.md 블록에 이미 포함되어 있습니다.

가이드라인 파일을 읽는 경우 (지연 로딩):
- `/eosa-review` 또는 `/eosa-audit` 실행 중 — 필요한 섹션만 로드
- 특정 규칙 위반이 의심되는 경우 — 해당 카테고리만 로드 (예: SQL 인젝션 의심 → SEC-2.2만 확인)
- 주석 템플릿에 정확한 Rule ID가 필요한 경우 — 해당 규칙 항목만 로드

사용자에게 간단히 알립니다:

```
EOSA 활성화 — [가이드라인 목록]. 가이드라인을 준수하여 코드를 작성합니다.
```

---

## 코드 작성 원칙

### 항상 이렇게 작성

**보안**

- DB 쿼리: `cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))`
- 비밀값: `password = os.environ.get("DB_PASSWORD")` / `const key = process.env.API_KEY`
- 개인정보: 저장 전 암호화, 로깅 전 마스킹
- 외부 통신: `https://` 사용, HTTP 리다이렉트 설정

**접근성**

- 이미지: `<img src="..." alt="설명 텍스트">` 또는 `<img src="..." alt="">`(장식용)
- 폼: `<label for="email">이메일</label><input id="email">`
- 버튼: `<button type="button">확인</button>` (필요시 role, aria 속성 추가)

**KRDS (활성화 시)**

- 프레임워크별 패키지 설치: `npm install krds-uiux` (HTML) / `krds-react` (React) / `krds-vue` (Vue)
- 버튼: `<button class="krds-btn primary medium">` 또는 `<Button variant="primary" size="medium">`
- 입력 필드: `.form-group > .form-tit > label + .form-conts > input.krds-input` 또는 `<TextInput label="...">`
- 색상: KRDS 토큰 변수 사용 (`--krds-*`), KRDS가 제공하는 색상을 hex로 직접 지정 금지
- 푸터: 모든 페이지에 로고 + 연락처 + 저작권 + 개인정보처리방침 링크 포함

### 불확실할 때만 주석

```python
# EOSA[보안]: 사용자 입력이 SQL에 직접 포함될 수 있습니다 (Rule ID: SEC-2.2) — 파라미터 바인딩 검토 필요
# EOSA[접근성]: 동적 요소에 포커스 관리가 필요할 수 있습니다 (Rule ID: ACC-2.2)
```
```javascript
// EOSA[디자인]: 이 색상이 KRDS 팔레트에 없을 수 있습니다 (Rule ID: DES-2.3) — 색상 토큰 확인
```
```html
<!-- EOSA[접근성]: img alt 속성 누락 의심 (Rule ID: ACC-1.1) — 이미지 설명 또는 alt="" 추가 -->
```
```css
/* EOSA[디자인]: KRDS 색상 토큰 대신 하드코딩 색상 (Rule ID: DES-0.3) — 색상 토큰 변수 사용 권장 */
```

## CLAUDE.md 블록 규칙 목록

CLAUDE.md에 삽입되는 전체 규칙 목록(DES-0.1~DES-9.2, SEC-1.1~SEC-6.3, ACC-1.1~ACC-4.2)은 `SKILL.md`의 Step 4를 참조하세요.
규칙 설명은 영어로 작성되어 있으며 Claude가 직접 읽는 컨텍스트로 사용됩니다.

## 경계

EOSA는 무엇을(코드 준수)만 결정하며, 소통 방식은 결정하지 않습니다.
`/eosa off`: 비활성화됩니다.
