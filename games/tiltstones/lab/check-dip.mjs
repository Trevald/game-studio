import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const h=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const E=new Function(h.slice(h.indexOf('// ======================= constants'),h.indexOf('// ======================= storage'))+';return {newGame,hit,step,isStuck,DIP,cloneGame};')();
const g=E.newGame(0);g.grid.fill('.');g.grid[22]='B';g.grid[10]='a';g.grid[30]='A';
g.ball.x=2.5;g.ball.y=1.7;g.ball.vy=-9;
E.hit(g,2,2,0,1);assert.equal(g.ball.color,0);
for(let i=0;i<E.DIP/2;i++)E.step(g,0);
assert.equal(g.ball.x,2.5);assert.equal(g.ball.y,2.65);assert.equal(g.ball.color,1);assert.equal(E.isStuck(g),false);
const copy=E.cloneGame(g);for(let i=0;i<E.DIP/2;i++){E.step(g,0);E.step(copy,0);}
assert.equal(g.ball.y,1.7);assert.equal(g.ball.vy,-9);assert.equal(g.dip,0);assert.equal(copy.ball.y,g.ball.y);
E.hit(g,0,3,0,1);for(let i=0;i<E.DIP;i++)E.step(g,0);assert.equal(g.ball.color,0);
g.ball.color=1;g.grid[30]='.';assert.equal(E.isStuck(g),true);
console.log('Dip enters paint, repaints at depth, returns to boundary, preserves rebound, clones safely, and restores blue.');
