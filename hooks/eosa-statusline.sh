#!/usr/bin/env bash
# eosa statusline — outputs active guideline badge for Claude Code status bar
# Outputs [EOSA:보안+접근성+디자인] or empty string if inactive

flag="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/.eosa-active"
[ -f "$flag" ] || exit 0

ids=$(tr '\n' '+' < "$flag" | sed 's/+$//')
[ -z "$ids" ] && exit 0

display=$(echo "$ids" \
  | sed 's/security-pipa/보안/g' \
  | sed 's/accessibility-kwcag22/접근성/g' \
  | sed 's/design-krds/디자인/g')

printf '\033[38;5;214m[EOSA:%s]\033[0m' "$display"
