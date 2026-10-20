import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const code=html.slice(html.indexOf('// ======================= constants'),html.indexOf('// ======================= storage'));
const E=new Function(code+'\nreturn {newGame,hit,step,respawn,COMBO_WINDOW};')();
const g=E.newGame(0);
function strike(gap=12){g.steps+=gap;g.grid[0]='a';E.hit(g,0,0,0,-1);}
for(let n=1;n<=13;n++){strike();assert.equal(g.combo,Math.min(5,1+Math.floor((n-1)/3)));}
assert.equal(g.score,3500);
strike(E.COMBO_WINDOW+1);assert.equal(g.combo,1);assert.equal(g.chainHits,1);
strike(E.COMBO_WINDOW);assert.equal(g.chainHits,2);
g.steps+=E.COMBO_WINDOW;E.step(g,0);assert.equal(g.chainHits,0);assert.equal(g.combo,0);
strike();g.grid[0]='B';E.hit(g,0,0,1,0);for(let i=0;i<15;i++)E.step(g,0);assert.equal(g.chainHits,0);assert.equal(g.combo,0);
g.ball.color=0;strike();E.respawn(g);assert.equal(g.chainHits,0);assert.equal(g.combo,0);
console.log('Combo tiers, score, window boundary, timeout, repaint and respawn passed.');
