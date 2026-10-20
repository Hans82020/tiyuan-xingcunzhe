// 将 material.txt 过滤目录行后打包为 material.js（const MATERIAL = "..."）
// 用法：node gen-material.mjs [输入.txt] [输出.js]
import fs from 'node:fs';
const inPath = process.argv[2] || 'material.txt';
const outPath = process.argv[3] || 'material.js';
let t = fs.readFileSync(inPath, 'utf8');
const lines = t.split(/\r?\n/);
// 从第一个"笔记块"标记行起截断（用户粘贴的学习笔记：分隔线/小标题/表格/对话开头）
const cut = lines.findIndex(l => /^(---|###|\||你说得完全对)/.test(l.trim()));
const kept = cut >= 0 ? lines.slice(0, cut) : lines;
t = kept
  .filter(l => !/HYPERLINK|PAGEREF|_Toc|TOC \\o/.test(l))
  .join('\n')
  .replace(/\uFEFF/g, '');
console.log('笔记块截断于第', cut + 1, '行，保留', kept.length, '行');
fs.writeFileSync(outPath, 'const MATERIAL = ' + JSON.stringify(t) + ';\n');
console.log('material.js chars:', t.length);
