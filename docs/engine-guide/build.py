import os, glob
from PIL import Image
from chart import svg as DAYCHART
# images: rendered pngs -> jpegs the html refers to
MAP={'cover':'cover_b','near_gold':'near_gold','near_night':'near_night','near_day':'near_day','room':'room','speak':'speak',
     'rink':'rink','live':'live','obs':'obs','sit_obs':'sit_obs','door_motel':'door_motel3','door_brk':'door_brk',
     'door_rink':'door_rink','ext_noon':'ext_noon','ext_gold':'ext_gold','ext_dusk':'ext_dusk','ext_night':'ext_night',
     'car_day':'car_day','car_chase':'car_chase','car_high':'car_high','car_front':'car_front','aerial2':'aerial2'}
SHOTS=os.environ.get('SHOTS','shots/out')
os.makedirs('img',exist_ok=True)
for k,v in MAP.items():
    dst=f'img/{k}.jpg'
    src=os.path.join(SHOTS, v+'.png')
    if os.path.exists(src) and (not os.path.exists(dst) or os.path.getmtime(dst)<os.path.getmtime(src)):
        Image.open(src).convert('RGB').save(dst,quality=86,optimize=True,progressive=True)
    elif not os.path.exists(dst):
        raise SystemExit(f'missing {dst}: render {v}.png with shots/gshots.js first (see README.md)')
html="".join(open(f).read() for f in sorted(glob.glob('src/0*.html')))
html=html.replace('{{DAYCHART}}',DAYCHART).replace('href="../fonts/','href="fonts/')
open('guide.html','w').write(html)
head=open('src/00-head.html').read().replace('href="../fonts/','href="fonts/')
open('cover.html','w').write(head+open('src/cover_only.html').read()+'</body></html>')
print('html',len(html))
