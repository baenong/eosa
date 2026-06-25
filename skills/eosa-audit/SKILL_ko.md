> **참고**: 이 파일은 `SKILL.md`의 한국어 참조 버전입니다. Claude(Agent)가 실제로 사용하는 활성 버전은 `SKILL.md`입니다.

---

# EOSA Audit — 전체 프로젝트 감사

공공기관 가이드라인에 따라 전체 코드베이스를 감사합니다.
위반 사항이 많을 경우 심각도 높은 것부터 출력합니다.

## 워크플로우

### 1단계: 설정 확인

`.eosa/config.json`을 읽습니다. 없으면:
```
EOSA가 초기화되지 않았습니다. 먼저 /eosa를 실행하세요.
```

`exclude_paths` 목록을 확인합니다 (기본값: `node_modules/`, `.venv/`, `dist/`, `*.min.js`, `__pycache__/`).

### 2단계: 파일 목록 수집

`.gitignore`와 `exclude_paths`를 제외하고 Python(`.py`), JavaScript/TypeScript(`.js`, `.ts`, `.jsx`, `.tsx`), Vue(`.vue`), HTML(`.html`, `.jinja`, `.jinja2`), CSS/SCSS(`.css`, `.scss`) 파일 목록을 수집합니다.

파일이 50개 이상이면 사용자에게 알리고 확인 후 진행합니다.

### 3단계: 각 파일 검토

각 파일을 읽고 규칙을 확인합니다. 모든 위반 사항을 수집합니다.

규칙 참조 우선순위:
1. CLAUDE.md의 EOSA 규칙 인덱스 (항상 컨텍스트에 있음) — 대부분의 검사에 충분
2. `guidelines/[관련].md` — 의심 패턴이나 구체적인 코드 예시가 필요할 때만 해당 섹션 로드

### 4단계: 감사 리포트 출력

```
## EOSA 감사 리포트

**프로젝트**: [프로젝트 루트 디렉토리명]
**감사 일시**: [현재 날짜]
**검토 파일 수**: 23개
**적용 가이드라인**: 정보보안 및 개인정보보호, 웹접근성 KWCAG 2.2, 디지털 정부서비스 UI/UX (KRDS)

---

### 요약

| 가이드라인 | 🔴 높음 | 🟡 중간 | 🟢 낮음 | 합계 |
|-----------|---------|---------|--------|------|
| 정보보안 및 개인정보보호 | 3 | 2 | 1 | 6 |
| 웹접근성 KWCAG 2.2 | 1 | 4 | 8 | 13 |
| 디지털 정부서비스 UI/UX (KRDS) | 2 | 3 | 2 | 7 |
| **합계** | **6** | **9** | **11** | **26** |

---

### 정보보안 / PIPA 위반

#### 🔴 높음

**SEC-1.2 하드코딩된 비밀값** (3건)
- `src/config.py:12` — `SECRET_KEY = "hardcoded-key-here"`
- `src/database.py:8` — `password = "db_password_123"`
- `api/auth.py:34` — `API_TOKEN = "sk-prod-xxxx"`
  → 모두 환경 변수로 이동: `os.environ.get("SECRET_KEY")`

**SEC-2.2 SQL 인젝션** (1건)
- `src/users.py:67` — `f"SELECT * FROM users WHERE name = '{name}'"`
  → `cursor.execute("SELECT * FROM users WHERE name = ?", (name,))`

#### 🟡 중간

**SEC-3.1 로그에 개인정보 포함** (2건)
- `src/auth.py:89` — `logger.info(f"Login: {user.phone}")`
- `src/users.py:112` — `print(f"User SSN: {ssn}")`
  → 로깅 전 마스킹

---

### 웹접근성 / KWCAG 2.2 위반

[동일 형식으로...]

---

### KRDS 디자인 위반

#### 🔴 높음

**DES-6.1 입력 필드 label 없음** (2건)
- `templates/apply.html:34` — `<input type="text" placeholder="이름">` (label 없음)
  → `<div class="form-group"><div class="form-tit"><label for="name">이름</label></div><div class="form-conts"><input id="name" class="krds-input"></div></div>`

#### 🟡 중간

**DES-1.3 푸터 필수 요소 없음** (1건)
- `templates/base.html:120` — 개인정보처리방침 링크 없음
  → 푸터 정책 링크에 `<a href="/privacy" class="point">개인정보처리방침</a>` 추가

**DES-0.2 KRDS 컴포넌트 미사용** (2건)
- `templates/apply.html:18` — 커스텀 버튼 사용
  → `<button class="krds-btn primary medium">` 또는 `import { Button } from 'krds-react'`

---

### 권장 조치 우선순위

1. **즉시** (🔴 높음): 하드코딩 비밀값 3건 환경 변수로 이동 — SEC-1.2; 입력 필드 label 2건 추가 — DES-6.1
2. **이번 스프린트** (🟡 중간): SQL 인젝션 수정, 개인정보 로그 마스킹, 푸터 개인정보처리방침 링크 추가
3. **다음 스프린트** (🟢 낮음): 접근성 + 디자인 개선 11건
```

### 5단계: 리포트 저장 확인

```
이 리포트를 `.eosa/audit-[날짜].md`로 저장할까요?
```

사용자가 동의하면 저장합니다.

## 경계

감사만 수행합니다. 자동 수정 없음.
특정 위반을 수정하려면 파일과 위반 내용을 지정하여 별도 요청하세요.
