---
name: eosa-audit
description: >
  Use when the user requests a full project audit against public sector guidelines.
  Where /eosa-review audits a diff, eosa-audit audits the entire codebase.
  Triggers on requests like "full audit", "project review", "security audit".
license: MIT
---

# EOSA Audit — Full Project Audit

Audit the entire codebase against public sector guidelines.
Output the most severe violations first when there are many.

## Workflow

### Step 1: Check configuration

Read `.eosa/config.json`. If missing:
```
EOSA is not initialized. Run /eosa first.
```

Check the `exclude_paths` list (defaults: `node_modules/`, `.venv/`, `dist/`, `*.min.js`, `__pycache__/`).

### Step 2: Collect file list

List all Python (`.py`), JavaScript/TypeScript (`.js`, `.ts`, `.jsx`, `.tsx`), Vue (`.vue`), HTML (`.html`, `.jinja`, `.jinja2`), and CSS/SCSS (`.css`, `.scss`) files, excluding `.gitignore` and `exclude_paths`.

If more than 50 files, notify the user and confirm before continuing.

### Step 3: Review each file

Read each file and check against the rules. Collect all violations.

Rule reference priority:
1. EOSA rule index in CLAUDE.md (always in context) — sufficient for most checks
2. `guidelines/[relevant].md` — load the relevant section only when a suspicious pattern or specific code example is needed

### Step 4: Output audit report

```
## EOSA Audit Report

**Project**: [project root directory name]
**Audit date**: [current date]
**Files reviewed**: 23
**Active guidelines**: Security/PIPA, Web Accessibility KWCAG 2.2, KRDS Design

---

### Summary

| Guideline | 🔴 High | 🟡 Medium | 🟢 Low | Total |
|-----------|---------|-----------|--------|-------|
| Security/PIPA | 3 | 2 | 1 | 6 |
| Web Accessibility KWCAG 2.2 | 1 | 4 | 8 | 13 |
| KRDS Design | 2 | 3 | 2 | 7 |
| **Total** | **6** | **9** | **11** | **26** |

---

### Security / PIPA Violations

#### 🔴 High

**SEC-1.2 Hardcoded secrets** (3 instances)
- `src/config.py:12` — `SECRET_KEY = "hardcoded-key-here"`
- `src/database.py:8` — `password = "db_password_123"`
- `api/auth.py:34` — `API_TOKEN = "sk-prod-xxxx"`
  → Move all to env vars: `os.environ.get("SECRET_KEY")`

**SEC-2.2 SQL injection** (1 instance)
- `src/users.py:67` — `f"SELECT * FROM users WHERE name = '{name}'"`
  → `cursor.execute("SELECT * FROM users WHERE name = ?", (name,))`

#### 🟡 Medium

**SEC-3.1 Personal data in logs** (2 instances)
- `src/auth.py:89` — `logger.info(f"Login: {user.phone}")`
- `src/users.py:112` — `print(f"User SSN: {ssn}")`
  → Mask before logging

---

### Web Accessibility / KWCAG 2.2 Violations

[same format...]

---

### KRDS Design Violations

#### 🔴 High

**DES-6.1 Input label missing** (2 instances)
- `templates/apply.html:34` — `<input type="text" placeholder="이름">` (no label)
  → `<div class="form-group"><div class="form-tit"><label for="name">이름</label></div><div class="form-conts"><input id="name" class="krds-input"></div></div>`

#### 🟡 Medium

**DES-1.3 Footer missing required elements** (1 instance)
- `templates/base.html:120` — Footer has no privacy policy link
  → Add `<a href="/privacy">개인정보 처리 방침</a>` to footer policy links

**DES-0.2 KRDS component not used** (2 instances)
- `templates/apply.html:18` — Custom button instead of KRDS component
  → `<button class="krds-btn primary medium">` or `import { Button } from 'krds-react'`

---

### Recommended action priority

1. **Immediate** (🔴 High): Move 3 hardcoded secrets to env vars — SEC-1.2; fix 2 missing input labels — DES-6.1
2. **This sprint** (🟡 Medium): Fix SQL injection, mask PII logs, add footer privacy policy link
3. **Next sprint** (🟢 Low): 11 accessibility + design improvements
```

### Step 5: Confirm report save

```
Save this report as `.eosa/audit-[date].md`?
```

Save if the user agrees.

## Boundaries

Audit only. No automatic fixes.
To fix specific violations, specify the file and violation details in your request.
