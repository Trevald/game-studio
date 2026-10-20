import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const h=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const E=new Function(h.slice(h.indexOf('// ======================= constants'),h.indexOf('// ======================= storage'))+';return {LEVELS,newGame,step};')();
for(const [id,roof] of [['S1','#'],['S3','g']]){
 const g=E.newGame(E.LEVELS.findIndex(l=>l.id===id));g.ball.x=2.5;g.ball.y=6.5;g.ball.vy=-9;g.ball.color=1;
 assert.equal(g.grid[5*14+2],roof);
 let steps=0;while(!g.dip&&steps<60){E.step(g,0);steps++;}
 assert.ok(g.dip>0);assert.ok(steps<=20);assert.equal(g.dipState.color,0);
 assert.equal(g.grid[5*14+2],roof==='#'?'#':'.');
 console.log(`${id}: roof returns ball into blue well in ${(steps/60).toFixed(2)}s; ${roof==='#'?'roof persists':'temporary bumper consumed'}.`);
}
