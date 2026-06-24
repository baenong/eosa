#!/usr/bin/env node
// eosa — Claude Code SessionStart activation hook
//
// Runs on every session start:
//   1. Reads .eosa/config.json from project root ($CLAUDE_PROJECT_DIR)
//   2. Writes flag file at $CLAUDE_CONFIG_DIR/.eosa-active (statusline reads this)
//   3. Emits active guideline rules as hidden SessionStart context
//   4. Detects missing statusline config and emits setup nudge

const fs = require('fs');
const path = require('path');
const { getProjectConfig, getClaudeDir } = require('./eosa-config');
const { getEosaInstructions } = require('./eosa-instructions');
const { clearActive, isCodex, setActive, writeHookOutput } = require('./eosa-runtime');

const config = getProjectConfig();

// No project config — eosa not initialized for this project, exit silently
if (!config || !config.active_guidelines || config.active_guidelines.length === 0) {
  clearActive();
  process.exit(0);
}

const activeGuidelines = config.active_guidelines;
const guidelineIds = activeGuidelines.map(g => g.id);

// 1. Write flag file (statusline reads this)
try {
  setActive(guidelineIds);
} catch (e) {
  // Silent fail — flag is best-effort, don't block the hook
}

// 2. Build context text from active guidelines
let output = getEosaInstructions(activeGuidelines);

// 3. Detect missing statusline config — nudge Claude to help set it up
if (!isCodex) try {
  const claudeDir = getClaudeDir();
  const settingsPath = path.join(claudeDir, 'settings.json');
  let hasStatusline = false;

  if (fs.existsSync(settingsPath)) {
    const raw = fs.readFileSync(settingsPath, 'utf8').replace(/^﻿/, '');
    const settings = JSON.parse(raw);
    if (settings.statusLine) hasStatusline = true;
  }

  if (!hasStatusline) {
    const isWindows = process.platform === 'win32';
    const scriptName = isWindows ? 'eosa-statusline.ps1' : 'eosa-statusline.sh';
    const scriptPath = path.join(__dirname, scriptName);
    const command = isWindows
      ? `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`
      : `bash "${scriptPath}"`;
    const statusLineSnippet =
      '"statusLine": { "type": "command", "command": ' + JSON.stringify(command) + ' }';
    output += '\n\nSTATUSLINE SETUP NEEDED: EOSA 플러그인은 활성 가이드라인을 표시하는 상태표시줄 배지를 포함합니다 ' +
      '(예: [EOSA:보안+접근성+디자인]). 아직 설정되지 않았습니다. ' +
      '~/.claude/settings.json에 다음을 추가하면 활성화됩니다: ' + statusLineSnippet + ' ' +
      '첫 번째 상호작용에서 사용자에게 설정을 제안하세요.';
  }
} catch (e) {
  // Silent fail — don't block session start over statusline detection
}

try {
  writeHookOutput('SessionStart', output);
} catch (e) {
  // Silent fail — stdout closed/EPIPE at hook exit must not surface as a hook failure
}
