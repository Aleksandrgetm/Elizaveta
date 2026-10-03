"""Prepare supplied decorative images; originals remain in assets/decor."""
from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
from collections import deque
import json
root=Path(__file__).resolve().parents[1]
items=[('бантик.jpg','objects/pink-bow',420,'checker'),('губы.jpg','stickers/lip-print',300,'checker'),('диск.jpg','vinyl/pink-vinyl',1078,'disc'),('звездочка.jpg','stars/star-handdrawn',220,'ink'),('звездочки.jpg','stars/star-trio',280,'ink'),('зеркало.jpg','objects/ornate-mirror',400,'white'),('камера.jpg','objects/silver-camera',500,'white'),('касета.jpg','objects/pink-cassette',564,'white'),('кисточка.jpg','objects/makeup-brush',350,'checker'),('наушники.jpg','objects/wired-earphones',680,'white'),('ромбики.jpg','stars/diamond-sparkles',240,'ink'),('сердечки.jpg','hearts/heart-doodles',220,'ink'),('телефон 1.jpg','objects/retro-phone',680,'white'),('тэйп.jpg','stickers/paper-tape',400,'checker')]
report=[]
for src,name,size,mode in items:
 im=Image.open(root/'assets/decor'/src).convert('RGBA');w,h=im.size;rgb=im.convert('RGB');pix=rgb.load();mask=Image.new('L',(w,h),255)
 if mode=='disc':
  mask=Image.new('L',(w,h));ImageDraw.Draw(mask).ellipse((8,5,w-9,h-6),fill=255);mask=mask.filter(ImageFilter.GaussianBlur(.5))
 elif mode=='ink':
  mask=rgb.convert('L').point(lambda x: min(255,max(0,int((200-x)*255/140))))
  im=Image.new('RGBA',(w,h),(40,29,24,255))
 else:
  # Remove only near-white background connected to the image boundary.
  p=mask.load();q=deque()
  def add(x,y):
   r,g,b=pix[x,y]
   if p[x,y] and min(r,g,b)>(175 if mode=='checker' else 242 if 'наушники' in src else 222) and max(r,g,b)-min(r,g,b)<(14 if mode=='checker' else 23):p[x,y]=0;q.append((x,y))
  for x in range(w):add(x,0);add(x,h-1)
  for y in range(h):add(0,y);add(w-1,y)
  if 'наушники' in src:
   for x,y in [(240,205),(210,264),(275,313),(285,345),(250,450),(390,415),(410,450),(425,517),(550,330),(122,455),(122,373),(158,355),(235,518),(387,510),(427,365)]:add(x,y)
  while q:
   x,y=q.popleft()
   if x:add(x-1,y)
   if x+1<w:add(x+1,y)
   if y:add(x,y-1)
   if y+1<h:add(x,y+1)
 if 'наушники' in src:
  m=mask.load()
  for y in range(225,h):
   for x in range(w):
    r,g,b=pix[x,y]
    if min(r,g,b)>242 and max(r,g,b)-min(r,g,b)<10:m[x,y]=0
 if 'губы' in src:
  m=mask.load()
  for y in range(h):
   for x in range(w):
    r,g,b=pix[x,y]
    if min(r,g,b)>175 and max(r,g,b)-min(r,g,b)<15:m[x,y]=0
 im.putalpha(mask);box=mask.getbbox();im=im.crop(box);im.thumbnail((size,size),Image.Resampling.LANCZOS)
 dest=root/'dist/assets/decor'/(name+'.webp');dest.parent.mkdir(parents=True,exist_ok=True);im.save(dest,quality=94,method=6)
 report.append({'source':src,'file':name+'.webp','width':im.width,'height':im.height,'bytes':dest.stat().st_size})
(root/'dist/assets/decor/manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
canvas=Image.new('RGB',(1250,780),'#bd9c99');d=ImageDraw.Draw(canvas)
for i,row in enumerate(report):
 im=Image.open(root/'dist/assets/decor'/row['file']);im.thumbnail((230,220));x=i%5*250;y=i//5*260;canvas.paste(im,(x,y),im);d.text((x,y+225),row['file'].split('/')[-1],fill='black')
canvas.save('/private/tmp/decor-prepared.jpg')
print(json.dumps(report,ensure_ascii=False))
