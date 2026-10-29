"""Check local assets, HTML references and SVG/XML without modifying packet."""
from pathlib import Path
from html.parser import HTMLParser
import hashlib,json,xml.etree.ElementTree as ET
P=Path(__file__).resolve().parent
m=json.loads((P/'ASSETS.json').read_text());runtime=0
for a in m['files']:
 f=P/a['source'];assert f.is_file(),f
 assert f.stat().st_size==a['bytes'] and hashlib.sha256(f.read_bytes()).hexdigest()==a['sha256'],f
 if a['role']=='runtime':
  runtime+=a['bytes'];assert a['destination'].startswith('games/math-crush/assets/')
 if f.suffix=='.svg':ET.parse(f)
assert runtime==m['runtimeBytes'] and runtime<2_000_000
atlas=json.loads((P/'assets/match-atlas.json').read_text());assert (P/'assets'/atlas['image']).exists()
for r in atlas['regions'].values():assert r['x']>=0 and r['y']>=0 and r['x']+r['w']<=atlas['width'] and r['y']+r['h']<=atlas['height']
class References(HTMLParser):
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k in ('src','href') and v and not v.startswith('#'):
    assert not v.startswith(('http:','https:','data:')),v
    assert (P/v).is_file(),v
References().feed((P/'index.html').read_text())
assert len(json.loads((P/'ART-PROMPTS.json').read_text())['prompts'])==3
print(f'PASS: {len(m["files"])} asset records, {runtime:,} runtime bytes, SVG XML, atlas bounds, HTML image paths, three generation prompts.')
