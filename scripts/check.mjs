// Site checks — run on every pull request (.github/workflows/checks.yml)
// and locally with `node scripts/check.mjs`. No dependencies.
//
// 1. Every script in src/ parses.
// 2. Every local link and asset an HTML page points to exists.
// 3. Copy rules agreed with the client are kept (see BANNED below).
// 4. Each page has a <title> and a lang attribute, balanced <div>s, and
//    no leftover merge-conflict markers.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';

const root = join(dirname(new URL(import.meta.url).pathname), '..');
const problems = [];
const fail = (file, msg) => problems.push(`${file}: ${msg}`);

// 1. JavaScript syntax
for (const f of readdirSync(join(root, 'src')).filter(f => f.endsWith('.js'))) {
  try { execFileSync(process.execPath, ['--check', join(root, 'src', f)], { stdio: 'pipe' }); }
  catch (e) { fail(`src/${f}`, 'does not parse: ' + String(e.stderr).split('\n').slice(0, 4).join(' ')); }
}

// Copy rules. Each entry: [pattern, why].
const BANNED = [
  // EquiStaff's own age only; "12 years · sales director" on a candidate is fine.
  [/\b(?:(?:for|over|of)\s+(?:over\s+)?\d{2}\+?\s+years\b(?![^<]{0,20}\b(?:experience|·))|\d{2}\s+years\s+(?:placing|matching|in business))/i, 'say "since 1982", never a year count (it goes stale)'],
  [/Employer confidential/, 'confidential badge was removed on 28 Oct (PR #11)'],
  [/<<<<<<<|>>>>>>>/, 'leftover merge-conflict marker'],
];

// 2–4. HTML pages
const pages = readdirSync(root).filter(f => f.endsWith('.html') && !f.startsWith('_'));
for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  if (!/<title>[^<]+<\/title>/.test(html)) fail(page, 'missing <title>');
  if (!/<html[^>]*\blang=/.test(html)) fail(page, 'missing lang on <html>');
  // An unmatched </div> silently closes a container early (29 Oct: the
  // pricing FAQ lost its side margin this way). Count, outside scripts.
  const markup = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  const opens = (markup.match(/<div\b/g) || []).length, closes = (markup.match(/<\/div>/g) || []).length;
  if (opens !== closes) fail(page, `${opens} <div> but ${closes} </div>`);
  // Every function an on*="..." handler calls must exist in the page or in a
  // script it loads (29 Oct: resume.html called setY/addYard/delYard, which
  // had been deleted, so its employer fields silently broke).
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  let defined = scripts.map(m => m[2]).join('\n');
  for (const m of scripts) { const src = (m[1].match(/src="([^"]+)"/) || [])[1]; if (src && existsSync(join(root, src))) defined += readFileSync(join(root, src), 'utf8'); }
  const known = new Set(['event','this','window','document','location','history','alert','confirm','return','if','void','setTimeout','scrollTo','print','ES','REVISED']);
  for (const [, code] of html.matchAll(/\bon[a-z]+=\\?["']([^"']+)/g))
    for (const [, fn] of code.matchAll(/(?:^|[^.\w$])([A-Za-z_$][\w$]*)\s*\(/g))
      if (!known.has(fn) && !new RegExp('function\\s+' + fn + '\\b|\\b' + fn + '\\s*=\\s*(?:function|\\()|[,{]\\s*' + fn + '\\s*:').test(defined))
        fail(page, `handler calls ${fn}() but it isn't defined anywhere the page loads`);
  // A decorative ::before/::after stretched over a section catches every click
  // unless it has pointer-events:none (29 Oct: sign-in and sign-up forms).
  for (const [rule] of html.matchAll(/::(?:before|after)\s*\{[^}]*\}/g))
    if (/position:\s*absolute/.test(rule) && /inset:\s*0/.test(rule) && !/pointer-events:\s*none/.test(rule))
      fail(page, 'full-cover overlay without pointer-events:none: ' + rule.slice(0, 60));
  // Comments explain history and may quote old copy; don't police those.
  // Comments and the "Revised" notes explain history and may quote old copy.
  const visible = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script>REVISED\([\s\S]*?<\/script>/g, '');
  for (const [re, why] of BANNED) if (re.test(visible)) fail(page, `"${visible.match(re)[0]}" — ${why}`);
  for (const [, url] of visible.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|sms:|data:|#|javascript:)/.test(url) || /\$\{|'\s*\+/.test(url)) continue; // built in JS
    const path = decodeURIComponent(url.split(/[?#]/)[0]);
    if (path && !existsSync(join(root, path))) fail(page, `broken link or asset: ${url}`);
  }
}
for (const f of readdirSync(join(root, 'src')).filter(f => f.endsWith('.js'))) {
  const js = readFileSync(join(root, 'src', f), 'utf8').replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '');
  for (const [re, why] of BANNED) if (re.test(js)) fail(`src/${f}`, `"${js.match(re)[0]}" — ${why}`);
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`✓ ${pages.length} pages and ${readdirSync(join(root, 'src')).filter(f => f.endsWith('.js')).length} scripts pass`);
