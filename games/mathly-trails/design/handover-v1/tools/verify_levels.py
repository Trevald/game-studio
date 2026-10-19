"""Run from any directory with Python 3; no third-party dependencies."""
import ast,json,re
from fractions import Fraction
from collections import Counter
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def value(node):
 if isinstance(node,ast.Expression):return value(node.body)
 if isinstance(node,ast.Constant) and type(node.value) is int:return Fraction(node.value)
 if isinstance(node,ast.BinOp):
  a,b=value(node.left),value(node.right)
  if isinstance(node.op,ast.Add):return a+b
  if isinstance(node.op,ast.Sub):return a-b
  if isinstance(node.op,ast.Mult):return a*b
  if isinstance(node.op,ast.Div):return a/b
 raise ValueError('Unsupported expression node: '+type(node).__name__)
report=[]
for level in json.loads((ROOT/'data/levels.json').read_text())['levels']:
 nums=level['numbers'];mapping={n['id']:n['value'] for n in nums};sol=level['solution'];tokens=sol['tokens']
 assert len(nums)==5 and len(mapping)==5
 ids=[t['numberId'] for t in tokens if 'numberId' in t]
 assert Counter(ids)==Counter(mapping.keys()),level['id']
 assert all(t.get('operator') in level['operators'] for t in tokens if 'operator' in t)
 rebuilt=''.join(str(mapping[t['numberId']]) if 'numberId' in t else t['operator'] for t in tokens)
 assert rebuilt==sol['expression']
 assert Counter(map(int,re.findall(r'\d+',rebuilt)))==Counter(mapping.values())
 actual=value(ast.parse(rebuilt,mode='eval'));expected=Fraction(level['target'])
 assert actual==expected,(level['id'],actual,expected)
 report.append({'id':level['id'],'expression':rebuilt,'exactResult':str(actual),'fiveUniqueCards':True,'passed':True})
assert value(ast.parse('5+(4*3)-3/2',mode='eval'))==Fraction(31,2)
assert value(ast.parse('(4+3)*3+3+2',mode='eval'))==26
assert value(ast.parse('8/4/2',mode='eval'))==1
assert value(ast.parse('1/3+1/3+1/3',mode='eval'))==1
try:value(ast.parse('5/(3-3)',mode='eval'));raise AssertionError('Division by zero accepted')
except ZeroDivisionError:pass
(ROOT/'data/verification.json').write_text(json.dumps({'passed':True,'levels':report,'regressions':['15.5 example','26 source board','left associative division','exact thirds','zero denominator']},indent=2)+'\n')
print(f'PASS: {len(report)} levels; all five IDs used once; exact targets; five arithmetic regressions.')
