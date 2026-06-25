---
name: eosa
description: >
  Use when starting a project, or when the user mentions "eosa", "public sector", "security guidelines",
  "information security", "web accessibility", or similar terms.
license: MIT
---

# EOSA — Korean Public Sector Coding Guidelines

Write code like a developer who has internalized Korean public sector software standards.
Guidelines are not external constraints — they are natural development habits.

## Persistence

**Active in every response.** Remains active until "/eosa off" is stated.
Active even when uncertain. Use `/eosa-review` to review current changes, `/eosa-audit` for a full audit.

## Workflow

### Step 1: Check configuration

Read `$CLAUDE_PROJECT_DIR/.eosa/config.json`.

- **File missing** → initialization workflow (Steps 2–4)
- **File present** → activation workflow (Step 5)

---

### Initialization Workflow (first run)

#### Step 2: Select guidelines

Present the following in a single message:

```
Select the public sector guidelines to apply to this project (multiple selections allowed):

[1] Information Security & Personal Data Protection (PIPA) — recommended mandatory
    SQL injection prevention, personal data encryption, secret management, XSS prevention

[2] Web Accessibility (KWCAG 2.2) — mandatory when web UI is included
    img alt attributes, keyboard access, color contrast, form labels

[3] KRDS Design Patterns — recommended for public sector service deployment
    KRDS component library (krds-uiux/krds-react/krds-vue), government UI components, design tokens

[all] Apply all (recommended)
```

Wait for the user's response.

#### Step 3: Create .eosa/config.json

Based on selection, create the `.eosa/` directory and write `config.json`.

```json
{
  "eosa_version": "0.1.0",
  "schema_version": 1,
  "initialized_at": "[current ISO8601 timestamp]",
  "active_guidelines": [
    {
      "id": "security-pipa",
      "name": "정보보안 및 개인정보보호",
      "file": "security-pipa.md",
      "version": "2024",
      "mandatory": true
    },
    {
      "id": "accessibility-kwcag22",
      "name": "웹접근성 KWCAG 2.2",
      "file": "accessibility-kwcag22.md",
      "version": "2.2",
      "mandatory": true
    },
    {
      "id": "design-krds",
      "name": "디지털 정부서비스 UI/UX (KRDS)",
      "file": "design-krds.md",
      "version": "1.1",
      "mandatory": false
    }
  ],
  "exclude_paths": [
    "node_modules/",
    ".venv/",
    "dist/",
    "*.min.js",
    "__pycache__/"
  ],
  "custom_overrides": {}
}
```

Include only the selected guidelines in `active_guidelines` (remove unselected entries).

#### Step 4: Update CLAUDE.md

Read `CLAUDE.md` in the current directory (empty string if absent).
Find and replace the existing block between `<!-- EOSA:START -->` and `<!-- EOSA:END -->`,
or append to end of file if not found.

Block to insert (include only sections for selected guidelines; omit unselected sections entirely):

```markdown
<!-- EOSA:START — update with /eosa, do not edit manually -->

## EOSA Coding Guidelines (auto-applied)

Korean public sector software standards. Follow every rule below from the first line of code.
Do not load `guidelines/*.md` files — all rules are embedded here.

### Security / PIPA [include when selected]
SEC-1.1 No admin·root account names → use aliases
SEC-1.2 No hardcoded secrets in source → os.environ / process.env
SEC-1.3 Session: HttpOnly·Secure cookies, expire 24h·renew 1h
SEC-1.4 Passwords: bcrypt cost≥12, no sha256 alone
SEC-1.5 5 failed logins → lock account for 15 minutes
SEC-1.6 CSRF token validation required (POST·PUT·DELETE)
SEC-2.1 Personal data stored with AES-256-GCM, key in env var
SEC-2.2 SQL: parameterized queries required, no f-string/concatenation
SEC-2.3 HTML output: escape required, no innerHTML·dangerouslySetInnerHTML
SEC-2.4 OS commands: use execFile(array), no exec(string)
SEC-2.5 File paths: validate with realpath, then confirm allowed directory
SEC-2.6 No eval·exec(code string)·new Function()
SEC-2.7 Redirects: whitelist domains only
SEC-2.8 Deserialization: HMAC signature verification required first
SEC-3.1 No personal data (SSN·phone·card numbers) in logs
SEC-3.2 No stack traces·DB schema·internal paths in error responses
SEC-4.1 Force HTTP → HTTPS redirect, no mixed content
SEC-4.2 CORS: specific domains only, no origin: *
SEC-4.3 SSRF: block internal IPs (127.x·10.x·172.16-31.x·169.254.x)
SEC-5.1 File upload: server-side MIME validation + UUID filename + store outside webroot
SEC-6.1 No direct user input injection into AI prompts → escape first
SEC-6.2 Filter PII from AI output before returning
SEC-6.3 No personal data in training data → de-identify

### Accessibility / KWCAG 2.2 [include when selected]
ACC-1.1 img: alt required, decorative alt=""
ACC-1.2 Provide captions and audio descriptions for video
ACC-1.3 Tables: th+scope·caption required
ACC-1.4 Layout: must be linearizable
ACC-1.5 Instructions: supplement color/shape cues with text
ACC-1.6 No information conveyed by color alone
ACC-1.7 No autoplay beyond 3 seconds, or provide stop·mute controls
ACC-1.8 Color contrast 4.5:1 minimum (18px+ or bold 14px+ → 3:1)
ACC-1.9 Content separation must not rely on color alone
ACC-2.1 All functions accessible by keyboard
ACC-2.2 Focus order: logical·sequential, no focus trap
ACC-2.3 Touch target 44×44px minimum
ACC-2.4 Single-character shortcuts → must be disableable·remappable
ACC-2.5 Warn user 20 seconds before session expiry
ACC-2.6 Moving content: provide stop·hide controls
ACC-2.7 Flashing: 3 times per second or fewer
ACC-2.8 First link on page = skip to main content
ACC-2.9 Every page must have a unique title
ACC-2.10 Link text = purpose understandable, no standalone "here·click"
ACC-2.11 ePub page numbers displayed
ACC-2.12 Complex gestures: provide single-pointer alternative
ACC-2.13 Pointer cancellation: handle on mouseup/pointerup
ACC-2.14 Label text ⊇ accessible name (aria-label)
ACC-2.15 Motion-based functions: provide UI alternative
ACC-3.1 html[lang] attribute required
ACC-3.2 No auto-moving/updating content (user-initiated only)
ACC-3.3 Help features: consistent location
ACC-3.4 Input errors: provide correction guidance
ACC-3.5 Every input must have an associated label
ACC-3.6 CAPTCHA: provide alternative means
ACC-3.7 Apply autocomplete attributes to personal data inputs
ACC-4.1 No markup errors, no duplicate id attributes
ACC-4.2 WAI-ARIA role·state·property must follow the spec

### Design / KRDS [include when selected]
DES-0.1 Install KRDS package matching the project framework:
  HTML/vanilla → `npm install krds-uiux`, load `<link href="node_modules/krds-uiux/resources/cdn/krds.min.css">`
  React        → `npm install krds-react`, add `import 'krds-react/dist/index.css'` in entry file
  Vue          → `npm install krds-vue`,   add `import 'krds-vue/dist/index.css'` in entry file
DES-0.2 Use KRDS components — do NOT reimplement components KRDS already provides:
  HTML/vanilla CSS classes:
    Button → `class="krds-btn [primary|secondary|tertiary] [large|medium|small]"`
    Input  → `class="krds-input"` inside `.form-group > .form-tit > label + .form-conts`
    Modal  → `class="krds-modal fade"` + `role="dialog"`
    Pagination → `class="krds-pagination"` + `.page-link.active`
    Spinner    → `class="krds-spinner" role="status"`
    Masthead exact HTML:
      `<div id="krds-masthead"><div class="toggle-wrap"><div class="toggle-head"><div class="inner"><span class="nuri-txt">이 누리집은 대한민국 공식 전자정부 누리집입니다.</span></div></div></div></div>`
    Header skeleton (class names must match exactly):
      `<header id="krds-header"><div class="header-in"><div class="header-container"><div class="inner"><div class="header-utility"><ul class="utility-list"><li>...</li></ul></div><div class="header-branding"><h2 class="logo"><a href="/"><span class="sr-only">[서비스명] 홈으로 이동</span></a></h2></div></div></div></div></header>`
    Footer skeleton (class names must match exactly):
      `<footer id="krds-footer"><div class="inner"><div class="f-logo"><span class="sr-only">[기관명]</span></div><div class="f-cnt"><div class="f-info">...</div></div><div class="f-btm"><div class="f-btm-text"><div class="f-menu"><a href="/privacy" class="point">개인정보처리방침</a></div><p class="f-copy">© [연도] [기관명]. All rights reserved.</p></div><div class="krds-identifier"><span class="logo"><span class="sr-only">[기관명]</span></span></div></div></div></footer>`
  React/Vue named imports (same component names for both frameworks):
    `import { Button, TextInput, Modal, Pagination, Spinner, Tab, Table, Checkbox, Radio, Select, Textarea, Badge, Masthead, Header, SkipLink } from 'krds-react'`
    Button: `<Button variant="primary" size="medium">` (variant: primary|secondary|tertiary|text|link|icon)
    TextInput: `<TextInput label="이름" hint="도움말" error="오류메시지">`
    Modal: compound — `<Modal.Trigger>` / `<Modal.Header>` / `<Modal.Body>` / `<Modal.Footer>` / `<Modal.Close>`
    Pagination: `<Pagination totalPages={10} currentPage={1} onChange={fn}>`
    Spinner: `<Spinner label="로딩 중">`
DES-0.3 Custom CSS allowed only for layout/spacing not covered by KRDS; use KRDS token variables (`--krds-*`) for colors and spacing
DES-0.4 Before implementing any complex KRDS component, read the official markup from `node_modules/krds-uiux/html/code/[component].html` (e.g. `calendar.html`, `modal.html`, `accordion.html`, `tab.html`, `table.html`, `pagination.html`, `step_indicator.html`, `breadcrumb.html`, `file_upload.html`, `date_input.html`, `toggle_switch.html`, `spinner.html`, `skip_link.html`, `textarea.html`, `select.html`, `checkbox.html`, `radio_button.html`, `text_input.html`) — use exact class names from the file, never guess
DES-1.1 Government banner at top of page, no role attribute on masthead div
DES-1.2 Header: logo top-left, utility links top-right (≤4, separated by divider), order: banner→utility→logo→icons→nav
DES-1.3 Footer: service logo + contact + copyright required; privacy policy link required if PII processed; order: logo→contact→utility links→policy links→copyright→org identifier; footer must be last element with no gap at bottom
DES-2.1 Font: Pretendard GOV (included in krds-uiux/resources/fonts/), minimum 17px, use rem units
DES-2.2 Type scale: h1=40px, h2=32px, h3=24px, line-height≥1.5
DES-2.3 Color contrast 4.5:1 minimum, use KRDS token variables
DES-2.4 Breakpoints: 360/768/1024/1280px, content max-width 1200px
DES-3.1 nav: aria-label required, menu button aria-expanded
DES-3.2 Pagination: `.page-link.active` + `<span class="sr-only">현재페이지 </span>` inside active link
DES-3.3 Breadcrumb: omit on 1-level sites and main/landing pages; do not use for step indicators; first item=home link, last item=parent of current page (not current page itself); max 4 items, single row, left-aligned
DES-4.1 Modals: open only on user action (`.open-modal` + `data-target`), use as last resort only
DES-4.2 Tabs: no disabled attribute, use aria-selected on `role="tab"` button (not li)
DES-4.3 Tables: caption·th·scope required, empty cells "-"
DES-5.1 Actions → `<button>`, navigation → `<a>`, semantic distinction required
DES-5.2 Links: not color-only (provide underline with 3:1 contrast or icon); email → `href="mailto:"`, phone → `href="tel:"`; external links must show icon or "새 창 열림" text; no "click here"/"더보기" standalone link text
DES-6.1 input: label required inside `.form-tit`, placeholder must not replace label; width = full container width (except fixed-length fields like name/zip)
DES-6.2 Radio/checkbox: group with fieldset+legend
DES-6.3 select: onChange must not trigger automatic navigation/submission
DES-6.4 Date input: label required (not "날짜"); multi-field → year/month/day labels each; hint text for format (not placeholder-only); autocomplete: bday/bday-year/bday-month/bday-day/cc-exp etc.
DES-6.5 Textarea: label required; placeholder must not replace label; copy/paste allowed; if maxlength → show max count + live remaining count
DES-6.6 File upload: label required; file item must show name+extension+size+delete button; announce type/size/count limits in hint text; keep file select button enabled after upload; no auto-submit on file select; specific error messages per violation; file name single-line with ellipsis; no multi-file upload inside modals
DES-7.1 Processing >1s → `<div class="krds-spinner" role="status">`
DES-8.1 AI-generated content must be explicitly labeled
DES-9.1 Form pattern: title required; single-column vertical layout; required fields marked with * + sr-only text; action buttons at consistent position; show input units; autocomplete on frequently-entered fields
DES-9.2 Personal info input: explain purpose before fields; allow copy/paste; no preset defaults (gender radio, date fields); placeholder must be prompt text or placeholder pattern (000-0000-0000), not realistic examples (010-1234-5678)

---

Violation **certain**: write the correct approach from the start (no comment needed)
Violation **uncertain**: `# EOSA[domain]: description (Rule ID: X.X) — suggested action`
Domains: security | accessibility | design

<!-- EOSA:END -->
```

After completion, notify the user:

```
EOSA initialized. This project will automatically comply with [selected guidelines].
Activates automatically from the next session.
/eosa-review: review current changes | /eosa-audit: full audit | /eosa-help: command reference | /eosa-add-guideline: add custom guideline
```

---

### Activation Workflow (subsequent runs)

#### Step 5: Confirm activation (do NOT load guideline files)

Read `config.json` to confirm the `active_guidelines` list only.
**Do not read `guidelines/*.md` files at this step.**
All rules needed for everyday coding are already embedded in the CLAUDE.md block below.

When to read guideline files (lazy loading):
- During `/eosa-review` or `/eosa-audit` — read relevant sections as needed
- When a specific rule violation is suspected — read that category section only (e.g., SQL injection concern → check SEC-2.2 only)
- When the exact Rule ID is needed for a comment template — read that rule entry only

Notify the user briefly:

```
EOSA active — [guideline list]. Writing code that complies with the guidelines.
```

---

## Code Writing Principles

### Always write this way

**Security**

- DB queries: `cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))`
- Secrets: `password = os.environ.get("DB_PASSWORD")` / `const key = process.env.API_KEY`
- Personal data: encrypt before storing, mask before logging
- External communication: use `https://`, configure HTTP redirect

**Accessibility**

- Images: `<img src="..." alt="description text">` or `<img src="..." alt="">`(decorative)
- Forms: `<label for="email">Email</label><input id="email">`
- Buttons: `<button type="button">Confirm</button>` (with role, aria attributes as needed)

**KRDS (when active)**

- Install package for the framework: `npm install krds-uiux` (HTML) / `krds-react` (React) / `krds-vue` (Vue)
- Buttons: `<button class="krds-btn primary medium">` or `<Button variant="primary" size="medium">`
- Inputs: wrap with `.form-group > .form-tit > label + .form-conts > input.krds-input` or `<TextInput label="...">`
- Colors: use KRDS token variables (`--krds-*`), never hardcode hex values that KRDS provides
- Footer: include logo + contact + copyright + privacy policy link in every page

### Comments only when uncertain

```python
# EOSA[security]: User input may be included in SQL (Rule ID: SEC-2.2) — review parameterized binding
# EOSA[accessibility]: Dynamic elements may require focus management (Rule ID: ACC-2.2)
// EOSA[design]: This color may not be in the KRDS palette (Rule ID: DES-2.3) — check color tokens
```

## Boundaries

EOSA determines what (code compliance), not how you communicate.
"/eosa off": deactivates.
