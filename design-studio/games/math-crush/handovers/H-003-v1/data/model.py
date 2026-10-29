"""Independent design oracle, not production or runtime-tested code."""
import copy, math

def draw(s):
 x=s['rng'];x^=(x<<13)&0xffffffff;x^=x>>17;x^=(x<<5)&0xffffffff;s['rng']=x&0xffffffff;return 1+s['rng']%9
def start(L):return dict(board=L['values'][:],sp={int(k):v for k,v in L['specials'].items()},jelly=set(L['jelly']),rng=L['seed'],moves=L['moves'],made=0,score=0,status='playing')
def target(L,s):return L['targets'][min(s['made'],len(L['targets'])-1)]
def adjacent(a,b):return abs(a//5-b//5)+abs(a%5-b%5)==1
def paths(L,s,limit=800):
 out=[];t=target(L,s);mul=L['operation']=='multiply'
 def walk(p,v):
  if len(out)>=limit:return
  if len(p)>=2 and v==t:out.append(p[:])
  if len(p)==8 or v>t or (not mul and v==t):return
  for j in range(25):
   if s['board'][j] is not None and j not in p and adjacent(p[-1],j):
    nv=v*s['board'][j] if mul else v+s['board'][j]
    if nv<=t and (not mul or t%nv==0):walk(p+[j],nv)
 for i,v in enumerate(s['board']):
  if v is not None:walk([i],v)
 return out

def rect(s,r0,r1,c0,c1):return {r*5+c for r in range(max(0,r0),min(5,r1+1)) for c in range(max(0,c0),min(5,c1+1)) if s['board'][r*5+c] is not None}
def area(s,i,kind):
 r,c=divmod(i,5);return rect(s,r,r,0,4) if kind=='stripe' else rect(s,r-1,r+1,c-1,c+1)
def resolve(L,s,ch):
 done=set();removed=set(ch);combo=None;chosen=[i for i in ch if i in s['sp']]
 for typ in [('wrapped','wrapped'),('stripe','wrapped'),('stripe','stripe')]:
  pair=next(((a,b) for k,a in enumerate(chosen) for b in chosen[k+1:] if sorted([s['sp'][a],s['sp'][b]])==sorted(typ)),None)
  if not pair:continue
  a,b=pair;done.update(pair);combo='+'.join(typ)
  if typ==('stripe','stripe'):
   for i in pair:
    r,c=divmod(i,5);removed|=rect(s,r,r,0,4)|rect(s,0,4,c,c)
  elif typ==('stripe','wrapped'):
   w=a if s['sp'][a]=='wrapped' else b;r=w//5;removed|=rect(s,r-1,r+1,0,4)
  else:
   r,c=divmod(b,5);removed|=rect(s,r-2,r+2,c-2,c+2)
  break
 while True:
  todo=sorted(i for i in removed if i in s['sp'] and i not in done)
  if not todo:break
  i=todo[0];done.add(i);removed|=area(s,i,s['sp'][i])
 n=len(ch);mult=1 if n==2 else 1.5 if n==3 else 2 if n==4 else 3
 points=math.floor((100+25*(n-2))*mult)+25*len(removed-set(ch));reward=None
 if n>=4 and L['rewardMode']!='none':reward='wrapped' if L['rewardMode']=='both' and n>=5 else 'stripe'
 return removed,points,reward,combo

def settle(L,s):
 active=set(L['active'])
 for c in range(5):
  r=0
  while r<5:
   if r*5+c not in active:r+=1;continue
   seg=[]
   while r<5 and r*5+c in active:seg.append(r*5+c);r+=1
   survivors=[(s['board'][i],s['sp'].get(i)) for i in seg if s['board'][i] is not None]
   full=[(draw(s),None) for _ in range(len(seg)-len(survivors))]+survivors
   for i,(v,sp) in zip(seg,full):
    s['board'][i]=v;s['sp'].pop(i,None)
    if sp:s['sp'][i]=sp
 if paths(L,s,1):return False
 for i in sorted(active):s['board'][i]=draw(s)
 s['sp']={};t=target(L,s);pair=next(((a,b) for a in sorted(active) for b in sorted(active) if a<b and adjacent(a,b)),None);assert pair
 if L['operation']=='add':a=max(1,t-9);b=t-a
 else:a,b=next(((a,b) for a in range(2,10) for b in range(a,10) if a*b==t))
 s['board'][pair[0]]=a;s['board'][pair[1]]=b;return True

def move(L,s,ch):
 assert 2<=len(ch)<=8 and len(set(ch))==len(ch)
 assert all(i in L['active'] for i in ch) and all(adjacent(a,b) for a,b in zip(ch,ch[1:]))
 val=math.prod(s['board'][i] for i in ch) if L['operation']=='multiply' else sum(s['board'][i] for i in ch);assert val==target(L,s)
 out=copy.deepcopy(s);rem,pts,reward,combo=resolve(L,s,ch);out['moves']-=1;out['made']+=1;out['score']+=pts;out['jelly']-=rem
 win=not out['jelly'] if L['objective']=='jelly' else out['made']>=L['quota']
 event=dict(targetBefore=target(L,s),removed=sorted(rem),points=pts,reward=reward,combo=combo,jellyCleared=len(s['jelly'])-len(out['jelly']))
 if win:out['status']='won';out['score']+=50*out['moves'];event['refreshed']=False;return out,event
 if out['moves']==0:out['status']='lost';event['refreshed']=False;return out,event
 for i in rem:out['board'][i]=None;out['sp'].pop(i,None)
 if reward:out['board'][ch[-1]]=s['board'][ch[-1]];out['sp'][ch[-1]]=reward
 event['refreshed']=settle(L,out);return out,event

def serial(s):return {**s,'jelly':sorted(s['jelly']),'sp':{str(k):v for k,v in sorted(s['sp'].items())}}
