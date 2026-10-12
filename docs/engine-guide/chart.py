# The day/night curves, computed with the same formulas as DayNight.tick()
import math
def ss(e0,e1,x):
    t=min(1,max(0,(x-e0)/(e1-e0))); return t*t*(3-2*t)
def state(h):
    t=((h-6)/24)%1; sh=math.sin(t*2*math.pi)
    day=ss(0.12,0.35,sh); st=ss(-0.22,0.12,sh)*(1-ss(0.15,0.35,sh))
    night=1-ss(-0.50,-0.02,sh)
    dark=1-ss(-0.14,0.24,sh)
    sun=max(0.04,day*1.12+st*0.68)+night*0.34
    hemi=max(0.15,day*0.70+st*0.46+(1-night)*0.32)
    return sun,hemi,dark,night
W,H=640,250; L,R,T,B=40,14,30,30
pw,ph=W-L-R,H-T-B; ymax=1.6
X=lambda h:L+h/24*pw; Y=lambda v:T+ph*(1-v/ymax)
series=[("Sun / moon (key light)",0,"#eb6834"),("Sky fill (hemisphere)",1,"#2a78d6"),("dark: lamps, glow, signs",2,"#1baf7a")]
out=[f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Light levels over 24 hours">']
# night shading where nightAmount > 0.5
hs=[i/20 for i in range(0,24*20+1)]
seg=[];cur=None
for h in hs:
    n=state(h)[3]>0.5
    if n and cur is None: cur=h
    if not n and cur is not None: seg.append((cur,h)); cur=None
if cur is not None: seg.append((cur,24))
for a,b in seg:
    out.append(f'<rect x="{X(a):.1f}" y="{T}" width="{X(b)-X(a):.1f}" height="{ph}" fill="#16203c" fill-opacity="0.07"/>')
for v in [0,0.4,0.8,1.2,1.6]:
    out.append(f'<line x1="{L}" y1="{Y(v):.1f}" x2="{W-R}" y2="{Y(v):.1f}" stroke="#e6dfd3" stroke-width="1"/>')
    out.append(f'<text x="{L-6}" y="{Y(v)+3:.1f}" text-anchor="end" font-size="8.5" fill="#7a7066">{v:.1f}</text>')
for h in range(0,25,3):
    out.append(f'<text x="{X(h):.1f}" y="{H-B+14}" text-anchor="middle" font-size="8.5" fill="#7a7066">{h:02d}:00</text>')
for h,lab in [(6,"sunrise"),(18,"sunset")]:
    out.append(f'<line x1="{X(h):.1f}" y1="{T}" x2="{X(h):.1f}" y2="{T+ph}" stroke="#b9ad9c" stroke-width="1"/>')
    out.append(f'<text x="{X(h)+4:.1f}" y="{T+10}" font-size="8.5" fill="#7a7066">{lab}</text>')
for name,i,col in series:
    pts=" ".join(f'{X(h):.1f},{Y(state(h)[i]):.1f}' for h in hs)
    out.append(f'<polyline points="{pts}" fill="none" stroke="{col}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>')
# legend row
lx=L
for name,i,col in series:
    out.append(f'<line x1="{lx}" y1="12" x2="{lx+16}" y2="12" stroke="{col}" stroke-width="2.4" stroke-linecap="round"/>')
    out.append(f'<text x="{lx+21}" y="15" font-size="9" fill="#1f1b17">{name}</text>')
    lx+=21+len(name)*4.9+22
# direct labels at noon and midnight where curves separate
s=state(12); out.append(f'<text x="{X(12):.1f}" y="{Y(s[0])-6:.1f}" text-anchor="middle" font-size="8.5" fill="#1f1b17">1.12</text>')
out.append(f'<text x="{X(12):.1f}" y="{Y(s[1])+12:.1f}" text-anchor="middle" font-size="8.5" fill="#1f1b17">1.02</text>')
s=state(0); out.append(f'<text x="{X(1.2):.1f}" y="{Y(s[2])-5:.1f}" text-anchor="middle" font-size="8.5" fill="#1f1b17">dark 1.0</text>')
out.append(f'<text x="{X(1.2):.1f}" y="{Y(s[0])-5:.1f}" text-anchor="middle" font-size="8.5" fill="#1f1b17">moon 0.38</text>')
out.append('</svg>')
svg="\n".join(out)
if __name__=="__main__":
    print(svg[:200]); 
    for h in [0,5,6,7,12,17,17.5,18,18.5,19,20,22]:
        print(h, ["%.2f"%v for v in state(h)])
