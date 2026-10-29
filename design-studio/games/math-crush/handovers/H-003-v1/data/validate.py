"""Read-only packet validation. Run from any working directory with Python3."""
import json, math
from pathlib import Path
from model import start,move,paths,serial,adjacent,settle,target,resolve
P=Path(__file__).resolve().parent
levels=json.loads((P/'levels.json').read_text())['levels']
witnesses=json.loads((P/'witnesses.json').read_text())['witnesses']
assert len(levels)==len(witnesses)==12
assert [x['id'] for x in levels]==list(range(1,13))
for L,W in zip(levels,witnesses):
 assert W['level']==L['id']
 assert L['seed']>0 and L['seed']<=0xffffffff
 assert L['operation'] in ('add','multiply') and L['objective'] in ('chains','jelly')
 assert L['active']==sorted(set(L['active'])) and len(L['values'])==25
 assert all((v is None and i not in L['active']) or (isinstance(v,int) and 1<=v<=9 and i in L['active']) for i,v in enumerate(L['values']))
 assert set(L['jelly'])<=set(L['active']) and len(set(L['jelly']))==len(L['jelly'])
 assert all(int(i) in L['active'] and sp in ('stripe','wrapped') for i,sp in L['specials'].items())
 assert 0<L['starThresholds'][0]<L['starThresholds'][1]
 assert (L['objective']=='jelly' and L['quota']==0 and L['jelly']) or (L['objective']=='chains' and L['quota']>0 and not L['jelly'])
 assert len(L['targets'])==1 or len(L['targets'])==L['quota']
 for t in L['targets']:
  assert any(a+b==t if L['operation']=='add' else a*b==t for a in range(1 if L['operation']=='add' else 2,10) for b in range(1 if L['operation']=='add' else 2,10))
 s=start(L);move(L,s,L['openingWitness'])
 for ch,expected in zip(W['route'],W['events']):
  before=serial(s);s,ev=move(L,s,ch)
  assert dict(ev,after=serial(s))==expected,(L['id'],ch,'snapshot drift')
  assert all(s['board'][i] is None for i in range(25) if i not in L['active'])
  if s['status']=='playing':assert paths(L,s,1)
 assert len(W['route'])==len(W['events'])
 assert s['status']=='won' and s['score']==W['score'] and s['score']>=L['starThresholds'][1]
 print(f"PASS L{L['id']:02}: {L['operation']} / {L['shape']} / {L['objective']}; {len(W['route'])} moves, {s['score']} points, 3-star threshold {L['starThresholds'][1]}")
# Across-hole selections must reject even if arithmetic would happen to match.
L=levels[3];s=start(L)
for ch in [[11,13],[11,12],[0,6],[0,1,0]]:
 try:move(L,s,ch)
 except (AssertionError,TypeError):pass
 else:raise AssertionError(('illegal path accepted',ch))
# Stable segment fill: ring column2's upper/lower segments never mix.
s=start(L);s['board'][2]=None;s['board'][22]=None
old7=s['board'][7];old17=s['board'][17];settle(L,s)
assert s['board'][7]==old7 and s['board'][22]==old17 and s['board'][12] is None
# Wrapped/stripe overlap counts each terrain patch once.
L=levels[4];s=start(L);s['sp']={6:'stripe',8:'wrapped'}
removed,_,_,_=resolve(L,s,[6,8]);assert len(s['jelly']-removed)==len(s['jelly'])-len(s['jelly']&removed)
# Multiplication supports extending an exact product by1, unlike addition pruning.
L=levels[10];s=start(L);s['board'][0:3]=[3,4,1]
assert [0,1,2] in paths(L,s,1000)
# Replaying from the same state consumes the same RNG and makes identical transitions.
L=levels[7];s=start(L);ch=witnesses[7]['route'][0]
a,ae=move(L,s,ch);b,be=move(L,s,ch);assert serial(a)==serial(b) and ae==be and target(L,a)==12
print('PASS boundary geometry, segmented gravity, union jelly, product-with-one, target advance and deterministic replay.')
print('LIMIT: independent design oracle only; production engine, gestures, saves and visual motion still require implementation QA.')
