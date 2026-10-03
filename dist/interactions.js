import {videos,gallery,photos} from './content.js';
import {photo} from './components.js';
const motion = matchMedia('(prefers-reduced-motion: reduce)');
export function initWelcome(){
  let seen=false;try{seen=sessionStorage.getItem('liza-welcome')==='seen'}catch{}
  if(seen||motion.matches||location.hash) return;
  const intro=document.createElement('dialog');intro.className='welcome';intro.setAttribute('aria-label','Добро пожаловать в портфолио Лизы');
  intro.innerHTML=`<div class="welcome-scene"><span class="micro welcome-overline">ДЛЯ ВАС — НЕМНОГО МОЕГО МИРА</span><img class="welcome-envelope" src="/assets/envelope.webp" alt="" width="1100" height="734"><div class="welcome-letter"><span class="micro">ПРИЯТНО ПОЗНАКОМИТЬСЯ</span><span class="welcome-name">Лиза</span><span class="micro">UGC CREATOR<br>LIFESTYLE · BEAUTY · FASHION</span><span class="handwritten">с теплом и вдохновением</span></div></div><button class="welcome-skip">Перейти к портфолио</button>`;
  document.body.append(intro);intro.showModal();document.body.classList.add('modal-open');
  let timer;const finish=()=>{clearTimeout(timer);try{sessionStorage.setItem('liza-welcome','seen')}catch{}intro.close();intro.remove();document.body.classList.remove('modal-open');motion.removeEventListener('change',finish)};
  intro.querySelector('button').addEventListener('click',finish);intro.addEventListener('cancel',e=>{e.preventDefault();finish()});motion.addEventListener('change',finish);timer=setTimeout(finish,3300);
}
export function initReveals(){
  if(motion.matches||!('IntersectionObserver'in window)) return;
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:0.06});
  document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('will-reveal');observer.observe(el)});
  const revealAll=()=>{if(motion.matches){observer.disconnect();document.querySelectorAll('.will-reveal').forEach(el=>el.classList.add('is-visible'))}};motion.addEventListener('change',revealAll);
  const record=document.querySelector('.record');let ticking=false;
  const rotate=()=>{ticking=false;if(motion.matches){record.style.transform='';return}const rect=record.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight)record.style.transform=`rotate(${(innerHeight/2-rect.top)*.025}deg)`};
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(rotate)}},{passive:true});motion.addEventListener('change',rotate);
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
  const open=(type,i,button)=>{kind=type;index=i;trigger=button;render();dialog.showModal();document.body.classList.add('modal-open');document.querySelector('#close-dialog').focus()};
  document.querySelectorAll('[data-video]').forEach(b=>b.addEventListener('click',()=>open('video',Number(b.dataset.video),b)));
  document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>open('photo',Number(b.dataset.photo),b)));
  const step=n=>{const length=kind==='video'?videos.length:gallery.length;index=(index+n+length)%length;render()};
  document.querySelector('#previous-media').addEventListener('click',()=>step(-1));document.querySelector('#next-media').addEventListener('click',()=>step(1));document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{clean();document.body.classList.remove('modal-open');trigger?.focus()});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
  dialog.addEventListener('keydown',e=>{if(e.target.tagName==='VIDEO')return;if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}});
}
