#!/usr/bin/env node
// eosa — runtime utilities for hooks
// Handles state file management and multi-agent output formatting.

const fs = require('fs');
const path = require('path');
const { getClaudeDir } = require('./eosa-config');

const STATE_FILE = '.eosa-active';
const isCopilot = Boolean(process.env.COPILOT_PLUGIN_DATA);
const isCodex = !isCopilot && Boolean(process.env.PLUGIN_DATA);

let stateDir = getClaudeDir();
if (isCodex) stateDir = process.env.PLUGIN_DATA;
if (isCopilot) stateDir = process.env.COPILOT_PLUGIN_DATA;

const statePath = path.join(stateDir, STATE_FILE);

function setActive(guidelineIds) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, guidelineIds.join('\n'));
}

function clearActive() {
  try { fs.unlinkSync(statePath); } catch (e) {}
}

function writeHookOutput(event, context = '') {
  if (isCopilot) {
    process.stdout.write(JSON.stringify(
      event === 'SessionStart' && context ? { additionalContext: context } : {}));
    return;
  }
  if (isCodex) {
    const output = { systemMessage: 'EOSA:ACTIVE' };
    if (context) {
      output.hookSpecificOutput = {
        hookEventName: event,
        additionalContext: context,
      };
    }
    process.stdout.write(JSON.stringify(output));
    return;
  }
  process.stdout.write(context);
}

module.exports = {
  clearActive,
  isCodex,
  isCopilot,
  setActive,
  statePath,
  writeHookOutput,
};
