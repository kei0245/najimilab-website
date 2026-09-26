import {readdir,readFile,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
async function walk(p){const entries=await readdir(p,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?walk(resolve(p,e.name)):resolve(p,e.name)))).flat();}
const files=await walk(root);let links=0;
for(const file of files.filter(f=>f.endsWith('.html'))){
  const html=await readFile(file,'utf8');
  assert.match(html,/<html lang="ja">/);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file);assert.match(html,/name="viewport"/);
  assert(!/<script\b|<form\b/i.test(html),'Unexpected active content');
  for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    if(/^(https:|mailto:|#)/.test(url))continue;
    let target=resolve(url.startsWith('/')?root:dirname(file),'.'+(url.startsWith('/')?url:'/'+url));
    if((await stat(target)).isDirectory())target=resolve(target,'index.html');
    await stat(target);links++;
  }
}
const ads=await readFile(resolve(root,'app-ads.txt'),'utf8');
assert(ads.split(/\r?\n/).every(l=>!l.trim()||l.trim().startsWith('#')),'Unconfirmed ad seller entry');
for(const slug of ['privacy','terms'])assert.match(await readFile(resolve(root,slug,'index.html'),'utf8'),/TODO/);
console.log(`PASS: ${files.length} output files, ${links} local links, page structure, draft notices, comment-only app-ads.txt.`);
