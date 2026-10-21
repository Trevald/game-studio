"""Dependency-free offline exact-arithmetic fixture verifier. No eval/network."""
import ast,json
from fractions import Fraction
from pathlib import Path
P=Path(__file__).resolve().parents[1]
def value(node):
 if isinstance(node,ast.Expression): return value(node.body)
 if isinstance(node,ast.Constant) and type(node.value) is int: return Fraction(node.value)
 if isinstance(node,ast.BinOp):
  a,b=value(node.left),value(node.right)
  if isinstance(node.op,ast.Add): return a+b
  if isinstance(node.op,ast.Sub): return a-b
  if isinstance(node.op,ast.Mult): return a*b
  if isinstance(node.op,ast.Div): return a/b
 raise ValueError('Unsupported expression')
def calculate(tokens,cards):
 ids=[t for t in tokens if t.startswith('n')]
 if len(ids)!=len(set(ids)) or any(t not in cards for t in ids): raise ValueError('Invalid card identity')
 text=''.join(str(cards[t]) if t in cards else t for t in tokens)
 return value(ast.parse(text,mode='eval'))
levels=json.loads((P/'data/levels.json').read_text());assert levels['schemaVersion']==1
for level in levels['levels']:
 cards={c['id']:c['value'] for c in level['numbers']};ts=[t.get('numberId',t.get('operator')) for t in level['solution']['tokens']]
 assert set(t for t in ts if t.startswith('n'))==set(cards)
 assert calculate(ts,cards)==Fraction(level['target']),level['id']
fixtures=json.loads((P/'data/ui-fixtures.json').read_text())['fixtures']
for f in fixtures:
 cards={c['id']:c['value'] for c in f['cards']};state=f['expectedState']
 try: result=calculate(f['tokens'],cards)
 except ValueError: assert state=='rejected',f['id'];continue
 except SyntaxError: assert state in ['empty','incomplete'],f['id'];continue
 except ZeroDivisionError: assert state=='invalid',f['id'];continue
 assert result==Fraction(f['expectedValue']),f['id']
 used=len(set(t for t in f['tokens'] if t.startswith('n')))
 if state=='solved': assert used==5 and result==Fraction(f['target'])
 if state=='early': assert used<5 and result==Fraction(f['target'])
 if state=='missed': assert used==5 and result!=Fraction(f['target'])
assert len(next(f for f in fixtures if f['id']=='long')['tokens'])==19
print(f'PASS: {len(levels["levels"])} exact authored solutions; {len(fixtures)} state/identity fixtures; 19-token boundary.')
