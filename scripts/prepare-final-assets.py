from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
from collections import deque
import json
root=Path(__file__).resolve().parents[1];out=root/'dist/assets/editorial';out.mkdir(exist_ok=True);report=[]
def save(im,name,size):
 im.thumbnail((size,size),Image.Resampling.LANCZOS);p=out/(name+'.webp');im.save(p,quality=92,method=6);report.append({'name':name,'size':im.size,'bytes':p.stat().st_size})
hero=ImageOps.exif_transpose(Image.open(next((root/'assets/hero').glob('*.jpg')))).convert('RGB')
for w in [640,960,1280]:save(hero.copy(),'restaurant-'+str(w),w)
photos={'7510-w':'flower-portrait','7511-w':'beauty','7512-y':'lifestyle','7513-y':'fashion','7514-w':'travel','7515-w':'wellness'}
for ending,name in photos.items():
 p=next((root/'assets/направления').glob('*'+ending+'.jpg'));im=ImageOps.exif_transpose(Image.open(p)).convert('RGB');save(im,name,1000 if name=='flower-portrait' else 640)
for n,name,size in [(1475,'fawn',320),(1476,'wax-seal',300),(1477,'ribbon-key',440),(1478,'rose-petals',400),(1480,'flower-stamp',320),(1485,'pink-star-confetti',300)]:
 im=Image.open(root/'assets/decor'/f'IMG_{n}.JPG').convert('RGBA');w,h=im.size;rgb=im.load();mask=Image.new('L',(w,h),255);a=mask.load();q=deque()
 def add(x,y):
  r,g,b,_=rgb[x,y]
  if a[x,y] and min(r,g,b)>235 and max(r,g,b)-min(r,g,b)<20:a[x,y]=0;q.append((x,y))
 for x in range(w):add(x,0);add(x,h-1)
 for y in range(h):add(0,y);add(w-1,y)
 while q:
  x,y=q.popleft()
  if x:add(x-1,y)
  if x+1<w:add(x+1,y)
  if y:add(x,y-1)
  if y+1<h:add(x,y+1)
 im.putalpha(mask);im=im.crop(mask.getbbox());save(im,name,size)
(out/'manifest.json').write_text(json.dumps(report,indent=2))
canvas=Image.new('RGB',(1200,260),'#ecc7ce')
for i,n in enumerate(['fawn','wax-seal','ribbon-key','rose-petals','flower-stamp','pink-star-confetti']):
 im=Image.open(out/(n+'.webp'));im.thumbnail((190,230));canvas.paste(im,(i*200,0),im)
canvas.save('/private/tmp/final-decor-prepared.jpg')
