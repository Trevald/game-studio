import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const levels=JSON.parse(readFileSync(new URL('levels.json',import.meta.url),'utf8'));
// Optimistic topological reachability: if even a point cannot get there, a ball cannot.
function reach(rows,color,keys=0){const w=rows[0].length,h=rows.length,a=rows.join('').split(''),start=a.indexOf('o'),seen=new Set([start]),q=[start];while(q.length){const i=q.shift(),x=i%w,y=Math.floor(i/w);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,j=ny*w+nx;if(nx<0||nx>=w||ny<0||ny>=h||seen.has(j))continue;const c=a[j];if(c==='#'||(c==='L'&&!keys)||('abcd'.includes(c)&&c!==color))continue;seen.add(j);q.push(j)}}return {has:ch=>a.some((c,i)=>c===ch&&seen.has(i)),seen};}
const p2=levels.find(l=>l.id==='P2');assert.equal(reach(p2.map,'b').has('A'),false,'painting red before opening blue plug must seal the return');
let opened=p2.map.slice();opened[7]=opened[7].slice(0,2)+'.'+opened[7].slice(3);assert.equal(reach(opened,'b').has('A'),true,'open plug must restore access');
const p3=levels.find(l=>l.id==='P3');assert.equal(reach(p3.map,'a').has('B'),false);assert.equal(reach(p3.map,'a').has('k'),true);assert.equal(reach(p3.map,'a',1).has('B'),true);
const p1=levels.find(l=>l.id==='P1');assert.equal(p1.map[5][2],'g');assert.equal(p1.map[8][2],'A');
console.log('P2 wrong-order return seal, prepared return access, P3 required gate/key access, and P1 temporary roof placement passed.');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const E=new Function(html.slice(html.indexOf('// ======================= constants'),html.indexOf('// ======================= storage'))+';return {LEVELS,newGame,isStuck};')();
const g=E.newGame(E.LEVELS.findIndex(l=>l.id==='P2'));g.ball.color=1;
assert.equal(E.isStuck(g),true);g.grid[7*14+2]='.';assert.equal(E.isStuck(g),false);
console.log('Wrong-order failure detection and prepared-return recovery passed.');
