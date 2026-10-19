"""Run with Python 3: python validate.py. No external packages needed."""
import json,itertools
from pathlib import Path
D=json.loads(Path(__file__).with_name('starter-levels.json').read_text())
def calc(vals,ops):
    terms=[vals[0]]; signs=[]
    for op,v in zip(ops,vals[1:]):
        if op=='*': terms[-1]*=v
        else: signs.append(op);terms.append(v)
    out=terms[0]
    for op,v in zip(signs,terms[1:]):out=out+v if op=='+' else out-v
    return out

def equation_solution(vals,target):
    for n in (2,3):
        for ids in itertools.permutations(range(len(vals)),n):
            for ops in itertools.product(('+','-','*'),repeat=n-1):
                if calc([vals[i] for i in ids],ops)==target:return ids,ops
    return None

def partition(vals,target,cap):
    groups=[g for n in range(2,cap+1) for g in itertools.combinations(range(len(vals)),n) if sum(vals[i] for i in g)==target]
    bad=set()
    def visit(rem):
        if not rem:return []
        if rem in bad:return None
        first=min(rem)
        for g in groups:
            if first in g and set(g)<=rem:
                tail=visit(rem-frozenset(g))
                if tail is not None:return [g]+tail
        bad.add(rem);return None
    return visit(frozenset(range(len(vals))))

def match_path(vals,target,cols=5):
    def dfs(path,total):
        if total==target and len(path)>=2:return path
        if total>=target or len(path)==8:return None
        x=path[-1]
        for j in range(len(vals)):
            if j not in path and abs(j//cols-x//cols)+abs(j%cols-x%cols)==1:
                out=dfs(path+[j],total+vals[j])
                if out:return out
    for i,v in enumerate(vals):
        p=dfs([i],v)
        if p:return p

assert calc([2,3,4],['+','*'])==14
assert calc([8,3,2],['-','*'])==2
assert calc([2,8,3],['-','+'])==-3
assert partition([1,2,3,4,4,6],10,3) is not None
assert partition([1,2,3,4],10,3) is None
for l in D['match']:assert match_path(l['values'],l['target'])
for l in D['equation']:
    for r in l['rounds']:assert equation_solution(r['values'],r['target'])
for l in D['clear']:assert partition(l['values'],l['target'],l['maxGroup'])
print('PASS: 12 Match boards, 36 Equation rounds, 12 Clear boards; arithmetic precedence and stuck-state fixtures.')
