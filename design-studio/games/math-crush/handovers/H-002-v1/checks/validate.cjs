const fs=require('node:fs');const path=require('node:path');const {M}=require('./baseline-engine.cjs');const levels=require('../data/levels.json').levels;
const results=[];
for(const [li,L] of levels.entries()){
 let start=M.start(li);for(const s of L.initialSpecials)start.cells[s.cell].sp=s.type;
 if(!M.validChain(start,L.witness)||M.sum(start,L.witness)!==L.target)throw Error('bad opening witness '+L.id);
 let beam=[{g:start,route:[]}],best=null;
 for(let step=0;step<L.quota;step++){
  let next=[];for(const b of beam)for(const chain of M.allChains(b.g,4000)){
   const {g,ev}=M.release(b.g,chain);if(ev?.type!=='clear')continue;const n={g,route:[...b.route,chain]};
   if(g.status==='won'){if(!best||M.core(g)>M.core(best.g))best=n;}else if(g.status==='playing')next.push(n);
  }
  next.sort((a,b)=>M.core(b.g)-M.core(a.g));const seen=new Set();beam=[];
  for(const n of next){const k=n.g.cells.map(c=>c.v+':'+c.sp).join(',');if(seen.has(k))continue;seen.add(k);beam.push(n);if(beam.length===24)break;}
 }
 if(!best||M.core(best.g)<L.starThresholds[1])throw Error('no baseline 3-star witness '+L.id);
 results.push({id:L.id,score:M.core(best.g),thresholds:L.starThresholds,route:best.route});
}
fs.writeFileSync(path.join(__dirname,'../data/baseline-witnesses.json'),JSON.stringify({note:'Witnesses from bundled baseline engine with packet values and initial specials. No new combos, Rush or tools. Not exhaustive maxima. Rerun in implemented engine.',results},null,2)+'\n');console.log('12 opening witnesses and 12 full no-tool/no-speed baseline three-star routes passed.');
