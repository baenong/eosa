#!/usr/bin/env node
// eosa — UserPromptSubmit hook to track /eosa on/off commands
// Inspects user input for /eosa commands and updates the flag file

const { isDeactivationCommand } = require('./eosa-config');
const { clearActive, writeHookOutput } = require('./eosa-runtime');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input.replace(/^﻿/, ''));
    const prompt = (data.prompt || '').trim().toLowerCase();

    // Detect /eosa off and /eosa 비활성화 commands
    if (/^[/@$]eosa\s+(off|비활성화)/.test(prompt)) {
      clearActive();
      writeHookOutput('UserPromptSubmit', 'EOSA 비활성화됨. 이 세션에서 가이드라인 자동 준수가 해제되었습니다.');
      return;
    }

    // Detect natural language deactivation ("eosa off")
    if (isDeactivationCommand(prompt)) {
      clearActive();
      writeHookOutput('UserPromptSubmit', 'EOSA 비활성화됨. 이 세션에서 가이드라인 자동 준수가 해제되었습니다.');
    }
  } catch (e) {
    // Silent fail
  }
});
