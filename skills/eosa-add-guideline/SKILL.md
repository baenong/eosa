---
name: eosa-add-guideline
description: >
  Use when converting an agency guideline document (PDF, Markdown, text) to EOSA format and adding it to the project.
  Triggers on requests like "add custom guideline", "register guideline file", "our agency's guideline".
license: MIT
---

# EOSA Add Guideline — Add Custom Guideline

Converts an agency guideline document to EOSA format and registers it in the project.
PDF files are automatically converted to Markdown before processing.

## Workflow

### Step 1: Check configuration

Read `.eosa/config.json`. If missing:
```
EOSA is not initialized. Run /eosa first.
```

### Step 2: Confirm file path

If a file path was provided as an argument, use it directly.
Otherwise, ask the user:

```
Enter the guideline file path to add (PDF, Markdown, or text):
```

### Step 3: PDF conversion (PDF files only)

If the file extension is `.pdf`, run the Node.js conversion script.
Multiple PDFs can be passed at once (recommended when related documents exist, as with security guidelines):

```bash
node "$CLAUDE_PLUGIN_ROOT/hooks/eosa-pdf-convert.js" "[pdf_path1]" "[pdf_path2]" ...
```

Windows:
```powershell
node "$env:CLAUDE_PLUGIN_ROOT\hooks\eosa-pdf-convert.js" "[pdf_path1]" "[pdf_path2]" ...
```

- If `@opendataloader/pdf` is not installed, it installs automatically (first run only).
- Converted Markdown file paths are output to stdout (`.eosa/tmp/[filename].md`, one line per file).
- **Use these Markdown files in subsequent steps instead of the original PDFs.**

If conversion fails, notify the user of the error and stop.

### Step 4: Read and analyze file

Read the file and identify:
- Guideline name and version
- Legal basis (law name, article)
- Scope (language, system type)
- Individual rule list

**Large files (very long converted Markdown)**: Do not process all at once. First identify the table of contents or section headings, then focus on sections containing coding rules. Exclude background descriptions, law introductions, and appendices.

### Step 5: Convert to EOSA format

Convert strictly following this format.

`[DOMAIN]` is determined by document content (e.g., SEC, ACC, DES, CLOUD, MOBILE).
`guideline_id` uses lowercase letters and hyphens only (e.g., `cloud-csap`, `mobile-security`).

```markdown
---
guideline_id: [lowercase-hyphenated]
guideline_name: [guideline name]
version: "[version]"
legal_basis: "[law name and article]"
source: "[original filename or issuing organization]"
last_updated: "[current date YYYY-MM-DD]"
next_review: "[one year later YYYY-MM-DD]"
---

# [Guideline Name]

## Scope

[Target language/system description]

---

## [DOMAIN]-1.0 [Rule Category]

### [DOMAIN]-1.1 [Rule Name]

- **Severity**: high/medium/low
- **Default behavior**: [What must always be done — a single actionable rule applied automatically when writing code]
- **Correct example (Python)**:
  ```python
  [correct code]
  ```
- **Correct example (JS)**:
  ```javascript
  [correct code]
  ```
- **Suspicious patterns**: [Code patterns to avoid — basis for adding EOSA comments]
- **Comment template**: `# EOSA[[domain]]: [description] (Rule ID: [DOMAIN]-X.X) — [action]`
- **Basis**: [Law/guideline source]
```

### Step 6: Review conversion result

Show the converted Markdown to the user and ask for confirmation:

```
Here is the converted guideline draft. Please review and decide.

[full converted Markdown]

[Yes] Save  [No] Cancel  [Edit] Modify content
```

### Step 7: Save and register

If the user approves, execute in order:

**7-1. Save guideline file**

Save as `guidelines/[guideline_id].md`.

**7-2. Update config.json**

Add to the `active_guidelines` array in `.eosa/config.json`:

```json
{
  "id": "[guideline_id]",
  "name": "[guideline_name]",
  "file": "[guideline_id].md",
  "version": "[version]",
  "mandatory": false
}
```

**7-3. Completion notice**

```
✅ [Guideline name] added successfully.
File: guidelines/[guideline_id].md

Will be applied automatically from the next session.
/eosa-review to review current changes | /eosa-audit for full audit
```

## Conversion Principles

- The **default behavior** field is the core. It becomes the rule Claude follows automatically when writing code. Write it as a clear, actionable single sentence.
- If the source document has no code examples, interpret the rule and write appropriate examples.
- If the source has no severity ratings: security/personal data → high, functional/accessibility → medium, recommendations → low.
- If there are more than 10 rules, group them into categories (1.0, 2.0, 3.0...) to create a hierarchy.
- **If the same rule appears across multiple documents, merge them into one.** Adopt the version with the most specific example.
- Exclude background descriptions, full law text, and appendices. Extract only actual coding rules.

## Boundaries

Conversion and registration only. Does not modify existing guideline files.
Intermediate conversion files in `.eosa/tmp/` may be deleted after the task is complete.
