#!/usr/bin/env node
// eosa-pdf-convert — PDF to markdown using @opendataloader/pdf
// Node.js native; no Python required. Auto-installs package on first run.
//
// Usage:
//   node eosa-pdf-convert.js <pdf_path> [pdf_path2 ...]
//
// Outputs converted .md file paths to stdout (one per line).
// Progress and errors go to stderr.

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { getPluginRoot } = require('./eosa-config');

const pluginRoot = getPluginRoot();
const PKG = '@opendataloader/pdf';

function ensurePackage() {
  const modulePath = path.join(pluginRoot, 'node_modules', '@opendataloader', 'pdf');
  if (!fs.existsSync(modulePath)) {
    process.stderr.write(`[EOSA] ${PKG} 설치 중 (최초 1회)...\n`);
    execSync(`npm install ${PKG}`, {
      cwd: pluginRoot,
      stdio: ['ignore', 'ignore', 'inherit'],
    });
    process.stderr.write('[EOSA] 설치 완료.\n');
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    process.stderr.write('사용법: node eosa-pdf-convert.js <pdf_경로> [pdf_경로2 ...]\n');
    process.exit(1);
  }

  const pdfPaths = args.map(a => path.resolve(a));
  for (const p of pdfPaths) {
    if (!fs.existsSync(p)) {
      process.stderr.write(`[EOSA] 파일을 찾을 수 없습니다: ${p}\n`);
      process.exit(1);
    }
  }

  const tmpDir = path.join(process.cwd(), '.eosa', 'tmp');
  fs.mkdirSync(tmpDir, { recursive: true });

  ensurePackage();

  process.stderr.write(`[EOSA] 변환 중 (${pdfPaths.length}개 파일)...\n`);

  const { convert } = await import(PKG);
  await convert(pdfPaths, {
    outputDir: tmpDir,
    format: 'markdown',
  });

  // Output converted file paths to stdout for the skill to capture
  for (const pdfPath of pdfPaths) {
    const baseName = path.basename(pdfPath, path.extname(pdfPath));
    const outPath = path.join(tmpDir, baseName + '.md');
    if (fs.existsSync(outPath)) {
      process.stderr.write(`[EOSA] ✓ ${path.basename(pdfPath)} → ${outPath}\n`);
      process.stdout.write(outPath + '\n');
    } else {
      process.stderr.write(`[EOSA] 경고: 변환 결과를 찾을 수 없습니다: ${outPath}\n`);
    }
  }
}

main().catch(e => {
  process.stderr.write(`[EOSA] 오류: ${e.message}\n`);
  process.exit(1);
});
