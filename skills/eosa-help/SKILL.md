---
name: eosa-help
description: >
  Use when the user asks about eosa usage, commands, or help,
  or wants to check the current active guideline configuration.
license: MIT
---

# EOSA Help — Quick Reference Card

Outputs the current EOSA configuration and available commands.

## Workflow

### Step 1: Read current configuration

Read `.eosa/config.json` to check active guidelines and versions.
If the file is missing, display "not initialized" status.

### Step 2: Output reference card

```
## EOSA — Korean Public Sector Coding Guidelines Plugin

### Current Status
Project: [path]
Initialized: [yes/no]

### Active Guidelines
✅ Information Security & Personal Data Protection (PIPA 2024)
✅ Web Accessibility (KWCAG 2.2)
⬜ KRDS Design Patterns — krds-uiux / krds-react / krds-vue (inactive)

### Commands

| Command | Description |
|---------|-------------|
| `/eosa` | Initialize or activate |
| `/eosa off` | Deactivate |
| `/eosa-review` | Review current changes (diff) |
| `/eosa-review [file]` | Review a specific file |
| `/eosa-audit` | Full project audit |
| `/eosa-add-guideline [file]` | Add custom guideline from PDF/Markdown |
| `/eosa-help` | This reference card |

### Comment Format
`# EOSA[security]: description (Rule ID: SEC-X.X)`
`# EOSA[accessibility]: description (Rule ID: ACC-X.X)`
`// EOSA[design]: description (Rule ID: DES-X.X)`

### Adding Guidelines
Update guidelines: re-run `/eosa` → select new guidelines
Configuration file: `.eosa/config.json`

### Version
EOSA version: 0.1.0
Full rule sets: [plugin root]/guidelines/
```
