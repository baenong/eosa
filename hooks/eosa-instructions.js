#!/usr/bin/env node
// eosa — guideline instruction builder for session context injection
// Builds a compact but complete summary of active guidelines for Claude.

const fs = require('fs');
const path = require('path');
const { getPluginRoot } = require('./eosa-config');
const GUIDELINE_SUMMARIES = {
  'security-pipa': {
    name: '정보보안 및 개인정보보호 (PIPA)',
    rules: [
      'SQL 쿼리는 반드시 파라미터 바인딩 사용 — cursor.execute("... WHERE id = ?", (id,)) / db.query("... WHERE id = $1", [id])',
      '비밀번호·API 키·토큰은 환경변수 또는 시크릿 관리 서비스 사용 — os.environ.get("KEY") / process.env.KEY',
      '개인정보(주민번호·전화번호·이메일 등) 저장 시 AES-256 이상 암호화 필수',
      '로그에 개인정보 포함 금지 — 마스킹 처리 필수 (예: 010-****-5678)',
      '외부 HTTP 통신은 HTTPS 강제, HTTP 리다이렉트 설정',
      '기본 관리자 계정명(admin/root) 사용 금지',
      '사용자 입력은 HTML 이스케이프 또는 Content Security Policy 적용하여 XSS 방지',
      '파일 업로드 시 확장자·MIME 타입·크기 검증 필수',
    ],
  },
  'accessibility-kwcag22': {
    name: '웹접근성 KWCAG 2.2',
    rules: [
      'img 태그에 alt 속성 항상 포함 — 장식용이면 alt=""',
      'form 요소(input/select/textarea)에 label 연결 필수 — for 속성 또는 aria-label/aria-labelledby',
      '색상만으로 정보를 전달하지 말 것 — 텍스트 또는 아이콘 병행',
      '키보드만으로 모든 기능 접근 가능하도록 구현 (tabindex, onKeyDown)',
      'focus 스타일 제거(outline: none) 금지 — 커스텀 포커스 스타일 제공 필수',
      '텍스트·배경 명도대비 최소 4.5:1 유지 (큰 텍스트 3:1)',
      'HTML lang 속성 지정 필수 — <html lang="ko">',
      '제목 태그(h1~h6) 계층 구조 준수, 단계 건너뛰기 금지',
    ],
  },
  'design-krds': {
    name: 'KRDS 디자인 패턴',
    rules: [
      '프레임워크에 맞는 KRDS 패키지 설치 — HTML: npm install krds-uiux / React: npm install krds-react / Vue: npm install krds-vue',
      'KRDS가 제공하는 컴포넌트는 직접 구현하지 말고 반드시 라이브러리 사용 — 버튼: krds-btn / 입력: krds-input / 모달: krds-modal',
      'React·Vue 컴포넌트: import { Button, TextInput, Modal, Pagination, Spinner } from \'krds-react\'',
      '색상·간격은 KRDS 토큰 변수 사용 — var(--krds-*), 임의 hex 색상 직접 사용 금지',
      '입력 필드: label 필수, placeholder가 label을 대체 불가 — .form-group > .form-tit > label + .form-conts 구조 준수',
      '푸터: 로고 + 연락처 + 저작권 필수, 개인정보 수집 시 개인정보 처리 방침 링크 필수',
    ],
  },
};

// Loads guideline rules from a markdown file by extracting '기본 동작' lines.
// Used for custom guidelines not listed in GUIDELINE_SUMMARIES.
function loadGuidelineFromFile(guidelineConfig) {
  try {
    const filePath = path.join(getPluginRoot(), 'guidelines', guidelineConfig.file);
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf8');

    const nameMatch = content.match(/guideline_name:\s*["']?([^"'\n]+)["']?/);
    const name = nameMatch ? nameMatch[1].trim() : (guidelineConfig.name || guidelineConfig.id);

    const rules = [];
    const rulePattern = /\*\*기본 동작\*\*:\s*(.+)/g;
    let match;
    while ((match = rulePattern.exec(content)) !== null) {
      rules.push(match[1].trim());
    }

    return rules.length > 0 ? { name, rules } : null;
  } catch (e) {
    return null;
  }
}

function getFallbackInstructions(activeGuidelines) {
  const lines = [
    'EOSA 활성 — 한국 공공기관 코딩 가이드라인',
    '',
    '아래 규칙을 코드 작성 시 자연스럽게 따르세요. 별도 언급 없이 준수합니다.',
    '',
  ];

  for (const g of activeGuidelines) {
    const summary = GUIDELINE_SUMMARIES[g.id] || loadGuidelineFromFile(g);
    if (!summary) continue;
    lines.push(`## ${summary.name}`);
    summary.rules.forEach(r => lines.push(`- ${r}`));
    lines.push('');
  }

  lines.push('## 주석 사용 원칙');
  lines.push('- 위반이 **확실한 경우**: 올바른 방식으로 처음부터 작성 (주석 불필요)');
  lines.push('- 위반 여부가 **불확실한 경우에만**: 코드를 수정하지 않고 주석으로 표시');
  lines.push('  형식: `# EOSA[도메인]: 설명 (Rule ID: X.X.X)`');
  lines.push('  도메인 태그: 보안 | 접근성 | 디자인');
  lines.push('');
  lines.push('/eosa-review 로 현재 변경사항 검토 | /eosa-audit 로 전체 감사 | /eosa off 로 비활성화');

  return lines.join('\n');
}

function getEosaInstructions(activeGuidelines) {
  return getFallbackInstructions(activeGuidelines);
}

module.exports = {
  getFallbackInstructions,
  getEosaInstructions,
};
