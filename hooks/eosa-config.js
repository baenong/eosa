#!/usr/bin/env node
// eosa — shared configuration resolver
//
// Reads project-level config from $CLAUDE_PROJECT_DIR/.eosa/config.json.
// Unlike ponytail (global mode), eosa config is per-project.

const fs = require('fs');
const path = require('path');
const os = require('os');

function getClaudeDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
}

function getPluginRoot() {
  return process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, '..');
}

function getProjectDir() {
  return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

function getProjectConfigPath() {
  return path.join(getProjectDir(), '.eosa', 'config.json');
}

function getProjectConfig() {
  try {
    const configPath = getProjectConfigPath();
    if (!fs.existsSync(configPath)) return null;
    const raw = fs.readFileSync(configPath, 'utf8').replace(/^﻿/, '');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function isDeactivationCommand(text) {
  const t = String(text || '').trim().toLowerCase().replace(/[.!?\s]+$/, '');
  return t === 'eosa off' || t === '/eosa off' || t === 'eosa 비활성화' || t === '/eosa 비활성화';
}

module.exports = {
  getClaudeDir,
  getPluginRoot,
  getProjectDir,
  getProjectConfigPath,
  getProjectConfig,
  isDeactivationCommand,
};
