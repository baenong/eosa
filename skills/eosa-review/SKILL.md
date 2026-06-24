---
name: eosa-review
description: >
  Use when the user requests a security review, guideline review, accessibility check, or code review,
  or when a specific file review is requested as /eosa-review [filename].
license: MIT
---

# EOSA Review — Single-pass Guideline Review

Review current changes or a specified file against public sector guidelines.
Does not modify code. Outputs violation list and remediation instructions only.

## Workflow

### Step 1: Check configuration

Read `.eosa/config.json`. If missing:
```
EOSA is not initialized. Run /eosa first.
```

### Step 2: Determine review scope

- **Argument provided** (e.g., `/eosa-review src/auth.py`): review that file only
- **No argument**: run `git diff --name-only HEAD~1 HEAD` to find changed files.
  If no git history, review the currently open file, or ask the user for a file path if it cannot be determined.

Reviewable file types: `.py`, `.js`, `.ts`, `.jsx`, `.tsx`, `.vue`, `.html`, `.jinja`, `.jinja2`, `.css`, `.scss`

### Step 3: Read files and review

Read each file and check against the rules.

Rule reference priority:
1. EOSA rule index in CLAUDE.md (always in context) — sufficient for most checks
2. `guidelines/[relevant].md` — load the relevant section only when a suspicious pattern or specific code example is needed

### Step 4: Output results

Output in the following format:

```
## EOSA Review Results

**Files reviewed**: src/auth.py, templates/login.html
**Active guidelines**: Security/PIPA, Web Accessibility KWCAG 2.2, KRDS Design

### Violations

#### 🔴 High (fix immediately)
- **src/auth.py:42** — SEC-1.2 Hardcoded secret
  `password = "admin123"` → `os.environ.get("ADMIN_PASSWORD")`

- **src/auth.py:67** — SEC-2.2 SQL injection risk
  `f"SELECT * FROM users WHERE id = {user_id}"` → use parameterized binding

#### 🟡 Medium (fix this sprint)
- **templates/login.html:15** — ACC-1.1 img alt missing
  `<img src="logo.png">` → `<img src="logo.png" alt="Agency logo">`

- **templates/login.html:52** — DES-1.3 Footer missing privacy policy link
  Add `<a href="/privacy">개인정보 처리 방침</a>` to footer

#### 🟢 Low (recommended)
- **templates/login.html:28** — ACC-3.5 / DES-6.1 label not connected
  `<input type="text" placeholder="Email">` → `<label for="email">Email</label><input id="email" class="krds-input">`

- **templates/login.html:61** — DES-5.2 External link not distinguished
  Add `<i class="svg-icon ico-go"></i><span class="sr-only">(새 창 열림)</span>` to external links

### Summary
High: 2 | Medium: 2 | Low: 2
Run /eosa-review to re-check after fixes, or /eosa-audit to audit the full project.
```

If no issues found:
```
✅ No violations found in the reviewed files.
```

## Boundaries

Review only. No automatic code modification.
To fix violations, request: "Fix these violations."
