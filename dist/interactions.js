import {videos,gallery,photos} from './content.js';
import {photo} from './components.js';
const motion=matchMedia('(prefers-reduced-motion: reduce)');
export function initWelcome({force=false}={}){
 let seen=false;try{seen=sessionStorage.getItem('liza-letter-v2')==='seen'}catch{}
 if(!force&&(seen||motion.matches||location.hash))return Promise.resolve();
 return new Promise(resolve=>{
  const previous=document.activeElement;
  const intro=document.createElement('dialog');intro.className='welcome';intro.setAttribute('aria-label','Письмо от Лизы');
  intro.innerHTML=`<span class="welcome-overline micro">НЕБОЛЬШОЕ ПИСЬМО, ЧТОБЫ ПОЗНАКОМИТЬСЯ</span><div class="envelope-scene"><div class="envelope-back"></div><div class="welcome-letter"><span class="micro">ПРИВЕТ, ЭТО Я</span><span class="welcome-name">Лиза</span><span class="micro">UGC CREATOR<br>LIFESTYLE / BEAUTY / FASHION</span><span class="handwritten">очень рада знакомству</span></div><div class="envelope-flap"></div><div class="envelope-front"></div><span class="envelope-address">Для вас.<br>С теплом, Лиза</span></div><button class="welcome-skip">Перейти к портфолио</button>`;
  document.body.append(intro);intro.showModal();document.body.classList.add('modal-open');let timeline,timer,finished=false;
  const finish=()=>{if(finished)return;finished=true;clearTimeout(timer);timeline?.kill();try{sessionStorage.setItem('liza-letter-v2','seen')}catch{}intro.close();intro.remove();document.body.classList.remove('modal-open');motion.removeEventListener('change',finish);if(force)previous?.focus();resolve()};
  intro.querySelector('button').addEventListener('click',finish);intro.addEventListener('cancel',e=>{e.preventDefault();finish()});motion.addEventListener('change',finish);
  const g=window.gsap;
  if(motion.matches||!g){intro.classList.add('welcome-reduced');timer=setTimeout(finish,2200);return}
  const q=s=>intro.querySelector(s);
  timeline=g.timeline({onComplete:finish,defaults:{ease:'power3.inOut'}});
  timeline.from(q('.envelope-scene'),{y:75,rotation:-12,autoAlpha:0,duration:.55})
   .to(q('.envelope-address'),{autoAlpha:0,duration:.18},.5)
   .to(q('.envelope-flap'),{rotationX:180,duration:.65,transformOrigin:'50% 0%'},.5)
   .set(q('.envelope-flap'),{zIndex:1},.82)
   .fromTo(q('.welcome-letter'),{y:40,scale:.92,autoAlpha:0},{y:-155,scale:1,autoAlpha:1,duration:1,ease:'power3.out'},.95)
   .from(q('.welcome-letter .handwritten'),{clipPath:'inset(0 100% 0 0)',duration:.65,ease:'power1.inOut'},1.8)
   .to(q('.welcome-letter'),{y:-175,rotation:-6,scale:1.06,duration:.5},2.35)
   .to(q('.envelope-scene'),{y:35,scale:1.12,duration:.55},2.85)
   .to(intro,{autoAlpha:0,duration:.55},2.85);
  timer=setTimeout(finish,3900); // Failsafe even if an animation is interrupted.
 });
}
export function initReveals(){
 const g=window.gsap,ST=window.ScrollTrigger;
 if(!g||!ST)return;
 g.registerPlugin(ST);
 const mm=g.matchMedia();
 mm.add({desktop:'(min-width: 1000px)',mobile:'(max-width: 999px)',reduce:'(prefers-reduced-motion: reduce)'},ctx=>{
  if(ctx.conditions.reduce)return;
  const desktop=ctx.conditions.desktop,light=navigator.connection?.saveData||navigator.hardwareConcurrency<=4;
  const amplitude=desktop&&!light?28:12;
  const once=(trigger)=>({trigger,start:'top 92%',once:true});
  const hero=g.timeline({defaults:{ease:'power3.out'}});
  hero.from('.hero h1',{clipPath:'inset(0 0 100% 0)',y:30,duration:1.05})
    .from('.hero-main',{y:45,rotation:2,autoAlpha:0,duration:1.1},.1)
    .from('.hero-film',{x:35,y:35,rotation:18,autoAlpha:0,duration:1},.25)
    .from('.hero-ticket',{y:30,autoAlpha:0,duration:.75},.4)
    .from('.hero-caption,.hero-sign',{autoAlpha:0,duration:.6,stagger:.15},.65);
  g.to('.hero-camera',{y:-amplitude,rotation:-7,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.7}});
  g.from('.about-portrait',{y:50,rotation:12,duration:1.2,ease:'power3.out',scrollTrigger:once('.about-grid')});
  g.from('.about-paper',{x:-25,y:35,autoAlpha:0,duration:1,scrollTrigger:once('.about-paper')});
  g.from('.about-quote strong',{clipPath:'inset(0 100% 0 0)',duration:1,ease:'power2.out',scrollTrigger:once('.about-quote')});
  g.to('.bridge-film',{x:desktop?70:24,ease:'none',scrollTrigger:{trigger:'.about',start:'center center',end:'bottom top',scrub:.8}});
  g.from('.record-lift',{scale:.86,x:35,autoAlpha:0,duration:1.25,ease:'power3.out',scrollTrigger:once('.record-object')});
  g.fromTo('.record-spin',{rotation:-35},{rotation:115,ease:'none',scrollTrigger:{id:'vinyl-scroll',trigger:'.contents',start:'top bottom',end:'bottom top',scrub:.65}});
  g.to('.record-object',{y:-amplitude,ease:'none',scrollTrigger:{trigger:'.contents',start:'top bottom',end:'bottom top',scrub:.8}});
  g.from('.tracklist a',{x:-25,autoAlpha:0,stagger:.09,duration:.65,scrollTrigger:once('.tracklist')});
  g.from('.niche-portrait',{y:25,autoAlpha:0,duration:1,ease:'power3.out',scrollTrigger:once('.directions-map')});
  g.utils.toArray('.niche-orbit').forEach(orbit=>g.from(orbit,{y:18,autoAlpha:0,duration:.7,scrollTrigger:once(orbit)}));
  const cards=g.utils.toArray('.video-card'),columns=desktop?4:3;
  for(let i=0;i<cards.length;i+=columns)g.from(cards.slice(i,i+columns),{y:32,autoAlpha:0,stagger:.1,duration:.75,ease:'power3.out',scrollTrigger:once(cards[i])});
  g.from('.services-center',{y:40,rotation:-4,scale:.93,duration:1,scrollTrigger:once('.services-board')});
  g.utils.toArray('.service-note').forEach((note,i)=>g.from(note,{x:i%2?20:-20,y:20,autoAlpha:0,duration:.8,scrollTrigger:once(note)}));
  g.utils.toArray('.gallery-item').forEach((item,i)=>{
   g.from(item,{autoAlpha:0,y:35,duration:.9,scrollTrigger:once(item)});
   if(!light)g.to(item.querySelector('.gallery-mount'),{y:i%2?-amplitude:amplitude,ease:'none',scrollTrigger:{trigger:item,start:'top bottom',end:'bottom top',scrub:1}});
  });
  g.from('.contact-letter',{y:50,rotation:1,autoAlpha:0,duration:1.1,ease:'power3.out',scrollTrigger:once('.contact-letter')});
  const lift=document.querySelector('.record-lift');
  const enter=()=>g.to(lift,{scale:1.025,duration:.35,overwrite:'auto'}),leave=()=>g.to(lift,{scale:1,duration:.45,overwrite:'auto'});
  const nav=document.querySelector('.tracklist');nav.addEventListener('pointerenter',enter);nav.addEventListener('pointerleave',leave);nav.addEventListener('focusin',enter);nav.addEventListener('focusout',leave);
  return()=>{nav.removeEventListener('pointerenter',enter);nav.removeEventListener('pointerleave',leave);nav.removeEventListener('focusin',enter);nav.removeEventListener('focusout',leave);g.killTweensOf(lift)};
 });
 document.fonts.ready.then(()=>ST.refresh());
 window.addEventListener('load',()=>ST.refresh(),{once:true});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)ST.refresh()});
}
export function initMediaDialog(){
  const dialog=document.querySelector('#media-dialog'),media=document.querySelector('#dialog-media');let kind='video',index=0,trigger;
  const clean=()=>{const v=media.querySelector('video');if(v){v.pause();v.removeAttribute('src');v.load()}media.replaceChildren()};
  const render=()=>{
    clean();const isVideo=kind==='video';const items=isVideo?videos:gallery;const item=items[index];
    document.querySelector('#dialog-counter').textContent=`${String(index+1).padStart(2,'0')} / ${items.length}`;
    document.querySelector('#dialog-meta').textContent=isVideo?item.category:'PHOTO DIARY';
    document.querySelector('#dialog-title').textContent=isVideo?item.title:photos[item].alt;
    document.querySelector('#dialog-description').textContent=isVideo?(item.src?item.description:'Это превью будущей работы. Видео скоро появится в портфолио.'):'';
    if(isVideo&&item.src){
      const v=document.createElement('video');v.controls=true;v.playsInline=true;v.preload='none';v.poster=photos[item.poster]?`/assets/photos/liza-${photos[item.poster].id}-960.webp`:item.poster;v.src=item.src;
      v.addEventListener('error',()=>{document.querySelector('#dialog-description').textContent='Не удалось загрузить видео. Попробуйте открыть его позже.'},{once:true});media.append(v);v.play().catch(()=>{});
    }else{media.innerHTML=photo(isVideo?item.poster:item,'(min-width: 700px) 500px, 90vw');if(isVideo){const badge=document.createElement('span');badge.className='preview-label';badge.textContent='ПРЕВЬЮ · ВИДЕО СКОРО';media.append(badge)}}
  };
  const open=(type,i,button)=>{kind=type;index=i;trigger=button;render();dialog.showModal();document.body.classList.add('modal-open');document.querySelector('#close-dialog').focus();if(!motion.matches){const a=button.getBoundingClientRect(),b=dialog.getBoundingClientRect();dialog.animate([{transform:`translate(${a.left+a.width/2-b.left-b.width/2}px,${a.top+a.height/2-b.top-b.height/2}px) scale(${Math.max(.2,a.width/b.width)})`,opacity:.3},{transform:'none',opacity:1}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'})}};
  document.querySelectorAll('[data-video]').forEach(b=>b.addEventListener('click',()=>open('video',Number(b.dataset.video),b)));
  document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>open('photo',Number(b.dataset.photo),b)));
  const step=n=>{const length=kind==='video'?videos.length:gallery.length;index=(index+n+length)%length;render()};
  document.querySelector('#previous-media').addEventListener('click',()=>step(-1));document.querySelector('#next-media').addEventListener('click',()=>step(1));document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{clean();document.body.classList.remove('modal-open');trigger?.focus()});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
  dialog.addEventListener('keydown',e=>{if(e.target.tagName==='VIDEO')return;if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}});
}
