import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const problems = [];
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx|css)$/.test(full)) files.push(full);
  }
};
for (const directory of ['member-1', 'member-2', 'member-3', 'app', 'shared']) walk(directory);
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const normalized = file.replaceAll('\\', '/');
  const isMember = /^member-[123]\//.test(normalized);
  if (isMember && /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/.test(text)) {
    problems.push(`${file}: use shared theme variables/classes instead of literal colours.`);
  }
  if (file.endsWith('.css')) continue;
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const isFunction = isMember && /\/functions\//.test(normalized);
  if (isFunction) {
    const functions = source.statements.filter(ts.isFunctionDeclaration);
    const expected = path.basename(file, '.ts');
    if (functions.length !== 1 || functions[0].name?.text !== expected) {
      problems.push(`${file}: keep exactly one named function matching the filename.`);
    }
    const first = source.statements[0];
    if (!first || !ts.isExpressionStatement(first) || first.expression.text !== 'use server') {
      problems.push(`${file}: begin with the use server directive.`);
    }
    if (functions[0]?.body?.statements.length > 0) {
      const hasStore = source.statements.some(node => ts.isImportDeclaration(node) && node.moduleSpecifier.text === '@/shared/storage');
      if (!hasStore && expected !== 'previewMenuImage') {
        problems.push(`${file}: implemented function must use the shared store (or ask the lead to approve an exception).`);
      }
    }
  }
  const visit = node => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      const specifier = node.moduleSpecifier?.text || '';
      if (!normalized.startsWith('shared/storage/json/') && /^(node:)?(fs|fs\/promises)$/.test(specifier)) {
        problems.push(`${file}: filesystem access is allowed only in shared/storage/json/.`);
      }
      if (/@supabase|supabase-js/i.test(specifier)) problems.push(`${file}: Supabase is reserved for the later integration phase.`);
      if ((isMember || normalized.startsWith('app/')) && /(?:^|\/)data(?:\/|$)|\.json$|shared\/storage\/json/.test(specifier)) {
        problems.push(`${file}: use the shared store, not data-file imports or private JSON primitives.`);
      }
      const owner = normalized.match(/^(member-[123])\//)?.[1];
      const other = specifier.match(/(?:^|\/)(member-[123])\//)?.[1];
      if (owner && other && owner !== other && /\/screens\//.test(normalized) && !specifier.includes('/functions/')) {
        problems.push(`${file}: cross-member UI imports must target public function files.`);
      }
    }
    if (ts.isIdentifier(node) && ['localStorage', 'sessionStorage', 'indexedDB', 'require'].includes(node.text)) {
      problems.push(`${file}: browser persistence and require() bypasses are not allowed.`);
    }
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      problems.push(`${file}: dynamic imports need lead review; do not bypass data access checks.`);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}
if (problems.length) {
  console.error('Team rules failed:\n' + [...new Set(problems)].map(p => '- ' + p).join('\n'));
  process.exitCode = 1;
} else console.log('PASS: one business function per file; JSON access boundary; shared colours; no browser storage or Supabase imports.');
