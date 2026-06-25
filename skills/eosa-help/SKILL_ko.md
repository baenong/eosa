> **참고**: 이 파일은 `SKILL.md`의 한국어 참조 버전입니다. Claude(Agent)가 실제로 사용하는 활성 버전은 `SKILL.md`입니다.

---

# EOSA Help — 빠른 참조 카드

현재 EOSA 설정과 사용 가능한 명령어를 출력합니다.

## 워크플로우

### 1단계: 현재 설정 읽기

`.eosa/config.json`을 읽어 활성 가이드라인과 버전을 확인합니다.
파일이 없으면 "초기화되지 않음" 상태를 표시합니다.

### 2단계: 참조 카드 출력

```
## EOSA — 한국 공공기관 AI 코딩 가이드라인 플러그인

### 현재 상태
프로젝트: [경로]
초기화: [예/아니오]

### 활성 가이드라인
✅ 정보보안 및 개인정보보호 (PIPA 2024)
✅ 웹접근성 KWCAG 2.2
⬜ 디지털 정부서비스 UI/UX (KRDS) — krds-uiux / krds-react / krds-vue (비활성)

### 명령어

| 명령어 | 설명 |
|--------|------|
| `/eosa` | 초기화 또는 활성화 |
| `/eosa off` | 비활성화 |
| `/eosa-review` | 현재 변경사항 검토 (diff) |
| `/eosa-review [파일]` | 특정 파일 검토 |
| `/eosa-audit` | 프로젝트 전체 감사 |
| `/eosa-add-guideline [파일]` | PDF/Markdown에서 커스텀 가이드라인 추가 |
| `/eosa-help` | 이 참조 카드 |

### 주석 형식
파일 언어에 따라 구문을 선택합니다:
`# EOSA[보안]: 설명 (Rule ID: SEC-X.X)` — Python
`// EOSA[접근성]: 설명 (Rule ID: ACC-X.X)` — JavaScript/TypeScript
`<!-- EOSA[디자인]: 설명 (Rule ID: DES-X.X) -->` — HTML
`/* EOSA[보안]: 설명 (Rule ID: SEC-X.X) */` — CSS/SCSS

### 가이드라인 관리
가이드라인 업데이트: config.json에서 직접 수정하거나, 삭제 후 `/eosa`로 재초기화
커스텀 가이드라인 추가: `/eosa-add-guideline [파일경로]`
설정 파일: `.eosa/config.json`

### 버전
EOSA 버전: 0.1.0
전체 규칙셋: [플러그인 루트]/guidelines/
```
