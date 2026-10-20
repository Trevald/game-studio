import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const h=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const E=new Function(h.slice(h.indexOf('// ======================= constants'),h.indexOf('// ======================= storage'))+';return {LEVELS,newGame,step,hit,respawn,motionFor,R};')();
function fresh(id){const g=E.newGame(E.LEVELS.findIndex(l=>l.id===id));g.grid.fill('.');g.grid[0]='a';g.ball.x=7.5;g.ball.y=4.5;return g;}
let g=fresh('S1');E.step(g,0);assert.equal(g.ball.vy,-9);
g=fresh('S1F');E.step(g,0);assert.equal(g.ball.vy,-12);assert.equal(E.motionFor(g.level).lateral,7);
g=fresh('S1A');E.step(g,0);assert.ok(Math.abs(g.ball.vy)>9);
g.ball.vy=15.99;E.step(g,0);assert.equal(g.ball.vy,16);
g.ball.y=9-E.R-.001;E.step(g,0);assert.equal(g.ball.vy,-9);
g.ball.vy=-15;g.grid[0]='#';E.hit(g,0,0,0,-1);assert.equal(g.ball.vy,-9);
g.ball.y=4.5;g.ball.x=E.R+.001;g.ball.vx=-5.5;g.ball.vy=15;E.step(g,-1);assert.equal(g.ball.vy,9);
E.respawn(g);assert.equal(g.ball.vy,-9);
console.log('Standard/fast speeds, free-flight acceleration, cap, tile/wall impact reset and respawn passed.');
