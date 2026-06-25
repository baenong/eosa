> **참고**: 이 파일은 `SKILL.md`의 한국어 참조 버전입니다. Claude(Agent)가 실제로 사용하는 활성 버전은 `SKILL.md`입니다.

---

# EOSA Review — 단일 검토

현재 변경사항 또는 지정된 파일을 공공기관 가이드라인에 따라 검토합니다.
코드를 수정하지 않으며, 위반 목록과 수정 지침만 출력합니다.

## 워크플로우

### 1단계: 설정 확인

`.eosa/config.json`을 읽습니다. 없으면:
```
EOSA가 초기화되지 않았습니다. 먼저 /eosa를 실행하세요.
```

### 2단계: 검토 범위 결정

- **인자 있음** (예: `/eosa-review src/auth.py`): 해당 파일만 검토
- **인자 없음**: `git diff HEAD --name-only`로 미커밋 변경사항 확인 (staged + unstaged).
  결과가 없으면 (미커밋 없음) `git diff --name-only HEAD~1 HEAD`로 마지막 커밋 검토.
  git 이력이 없으면 현재 열린 파일을 검토하거나 사용자에게 파일 경로를 요청.

검토 가능한 파일 형식: `.py`, `.js`, `.ts`, `.jsx`, `.tsx`, `.vue`, `.html`, `.jinja`, `.jinja2`, `.css`, `.scss`

### 3단계: 파일 읽기 및 검토

각 파일을 읽고 규칙을 확인합니다.

규칙 참조 우선순위:
1. CLAUDE.md의 EOSA 규칙 인덱스 (항상 컨텍스트에 있음) — 대부분의 검사에 충분
2. `guidelines/[관련].md` — 의심 패턴이나 구체적인 코드 예시가 필요할 때만 해당 섹션 로드

### 4단계: 결과 출력

출력 형식:

```
## EOSA 검토 결과

**검토 파일**: src/auth.py, templates/login.html
**적용 가이드라인**: 정보보안 및 개인정보보호, 웹접근성 KWCAG 2.2, 디지털 정부서비스 UI/UX (KRDS)

### 위반 사항

#### 🔴 높음 (즉시 수정)
- **src/auth.py:42** — SEC-1.2 하드코딩된 비밀값
  `password = "admin123"` → `os.environ.get("ADMIN_PASSWORD")`

- **src/auth.py:67** — SEC-2.2 SQL 인젝션 위험
  `f"SELECT * FROM users WHERE id = {user_id}"` → 파라미터 바인딩 사용

#### 🟡 중간 (이번 스프린트 내 수정)
- **templates/login.html:15** — ACC-1.1 img alt 누락
  `<img src="logo.png">` → `<img src="logo.png" alt="기관 로고">`

- **templates/login.html:52** — DES-1.3 푸터에 개인정보처리방침 링크 없음
  푸터에 `<a href="/privacy" class="point">개인정보처리방침</a>` 추가

#### 🟢 낮음 (권장)
- **templates/login.html:28** — ACC-3.5 / DES-6.1 label 연결 안 됨
  `<input type="text" placeholder="이메일">` → `<label for="email">이메일</label><input id="email" class="krds-input">`

- **templates/login.html:61** — DES-5.2 외부 링크 구분 없음
  외부 링크에 `<i class="svg-icon ico-go"></i><span class="sr-only">(새 창 열림)</span>` 추가

### 요약
높음: 2 | 중간: 2 | 낮음: 2
수정 후 /eosa-review로 재검토, 또는 /eosa-audit으로 전체 프로젝트 감사를 실행하세요.
```

위반 사항이 없으면:
```
✅ 검토한 파일에서 위반 사항을 발견하지 못했습니다.
```

## 경계

검토만 수행합니다. 코드 자동 수정 없음.
위반 사항 수정은 "이 위반 사항들을 수정해줘."로 별도 요청하세요.
