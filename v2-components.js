import { serviceOffers } from './v2-services-content.js';
import {photos,niches,videos,services} from './content.js?v=ugc-20261005';

export const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function photo(key,sizes='(min-width: 900px) 30vw, 80vw',className='') {
  const p=photos[key];
  if(!p) return `<img class="${className}" src="${esc(key)}" alt="" loading="lazy" decoding="async" width="900" height="1200">`;
  return `<img class="${className}" src="/assets/photos/liza-${p.id}-960.webp" srcset="/assets/photos/liza-${p.id}-480.webp 480w, /assets/photos/liza-${p.id}-960.webp 960w, /assets/photos/liza-${p.id}-1440.webp 1440w" sizes="${sizes}" width="900" height="1200" alt="${esc(p.alt)}" loading="lazy" decoding="async">`;
}
const asset=(file,className='',width=400,height=400)=>`<img class="${className}" src="/assets/${file}.webp" width="${width}" height="${height}" loading="lazy" decoding="async" alt="" aria-hidden="true">`;
const marker=(number,name,end='LIFESTYLE CREATOR & UGC')=>`<div class="section-marker"><span>${number} / ${name}</span><span>${end}</span></div>`;
const socialIcon=name=>{
 const shapes={
  instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  gmail:'<path d="M3 7v12h4V10l5 4 5-4v9h4V7M3 7V5l9 7 9-7v2"/>',
  telegram:'<path d="m21 3-4 18-6-5-4 3 1-6-6-3 19-7Z"/><path d="m8 13 8-6-5 9"/>'
 };
 return `<svg class="social-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shapes[name]}</svg>`;
};

function About(){return `<section class="about" id="about" data-chapter="about" aria-labelledby="about-title">
  <div class="page-width">${marker('01','ЗНАКОМСТВО','A FEW WORDS ABOUT ME')}
    <div class="about-spread">
      <div class="about-visual">
        <figure class="about-photo"><span class="about-label" aria-hidden="true">about<br><i>me</i></span>${photo('summer','(min-width: 900px) 34vw, 75vw')}<figcaption><span>ELIZAVETA</span><span>01 — EVERYDAY MUSE</span></figcaption></figure>
        ${asset('editorial/ribbon-key','about-key',360,560)}
      </div>
      <div class="about-copy"><h2 id="about-title">Давайте<br><em>знакомиться!</em></h2>
        <p class="about-lead">Я Лиза — лайфстайл<br>и UGC-креатор.</p>
        <p>Создаю живой, эстетичный и нативный контент о красоте, стиле, повседневной жизни и маленьких вещах, которые делают её интереснее.</p>
        <p>Мне важно, чтобы реклама не выбивалась из контента, а становилась его естественной частью. Поэтому я стараюсь не просто показать продукт, а придумать историю и подачу, через которые он действительно заинтересует аудиторию.</p>
        <blockquote>Эстетика, естественность,<br><span>ощущение разговора<br class="desktop-break"> с подругой.</span></blockquote>
        <a class="text-link light-link" href="#work">ПОСМОТРЕТЬ РАБОТЫ <span>↗</span></a>
      </div>
    </div>
  </div>
</section>`;}

function Film(){return `<div class="film-scene" aria-label="Кадры из жизни Лизы"><div class="film-track">${['beauty','street','cafe','mirror','flowers','summer','portrait','fashion'].map((key,i)=>`<figure class="film-frame">${photo(key,'(min-width: 900px) 220px, 140px')}<figcaption><span>LIZA / PERSONAL ARCHIVE</span><span>${String(i+1).padStart(2,'0')} ▸</span></figcaption></figure>`).join('')}</div><p class="film-caption handwritten">немного моего вайба</p></div>`;}

function Contents(){
 const prop=(name,file,depth)=>`<span class="desk-object desk-${name}" data-depth="${depth}">${asset(file)}</span>`;
 return `<section class="contents" id="contents" data-chapter="niches" aria-labelledby="contents-title"><div class="page-width">${marker('02','СОДЕРЖАНИЕ','PRESS PLAY ON MY WORLD')}
  <div class="desk-stage"><div class="desk-heading"><p class="micro">ВЫБЕРИТЕ СВОЮ ДОРОЖКУ</p><h2 id="contents-title">Навигация</h2></div>
    <div class="vinyl-disc" data-cursor="EXPLORE">${asset('vinyl','vinyl-image',1100,1100)}
      <span class="vinyl-center" aria-hidden="true">SIDE A<br><i>L.</i><small>33⅓ RPM</small></span>
      <nav class="vinyl-navigation" aria-label="Содержание портфолио">${[['about','Обо мне'],['contact','Контакты'],['niches','Направления'],['work','Работы'],['services','Что я создаю']].map(([id,label],i)=>`<a href="#${id}" class="vinyl-link vinyl-link-${i}"><span class="vinyl-index">0${i+1}</span><span class="vinyl-link-label">${label}</span></a>`).join('')}</nav>
    </div>
    ${prop('camera','decor/objects/silver-camera',-.65)}${prop('earphones','decor/objects/wired-earphones',.6)}${prop('cassette','decor/objects/pink-cassette',.8)}${prop('bow','decor/objects/pink-bow',-.2)}${prop('stars','decor/stars/star-handdrawn',.15)}
    <p class="desk-bottom micro">BEAUTY · FASHION · EVERYDAY LIFE <span>FLIP TO EXPLORE ↓</span></p>
  </div></div></section>`;
}

function World(){
 return `<section class="world" id="niches" data-chapter="niches" aria-labelledby="world-title"><div class="world-pin"><div class="page-width world-shell">${marker('03','НАПРАВЛЕНИЯ','FIVE WAYS TO TELL A STORY')}
  <header class="world-heading"><h2 id="world-title">МОИ <em>НАПРАВЛЕНИЯ</em></h2><p class="handwritten">близко мне и интересно вам!</p></header>
  <div class="world-stage">
    <figure class="world-portrait"><img class="world-face" src="/assets/editorial/flower-portrait.webp" alt="Лиза в чёрном платье с большим букетом цветов" width="750" height="1000" loading="lazy">${asset('lace-frame','world-frame',900,1200)}</figure>
    <nav class="world-nav" role="tablist" aria-label="Мои направления">${niches.map((n,i)=>`<button type="button" class="world-tab${i===0?' is-active':''}" id="world-tab-${i}" role="tab" data-world-index="${i}" data-category="${n.name.toLowerCase()}" aria-controls="world-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?'0':'-1'}"><span>0${i+1}</span>${esc(n.name)}</button>`).join('')}</nav>
    <div class="world-slides" aria-label="Истории направлений">${niches.map((n,i)=>`<article class="world-state world-state-${n.name.toLowerCase()}${i===0?' is-active':''}" id="world-panel-${i}" role="tabpanel" data-world-index="${i}" data-category="${n.name.toLowerCase()}" aria-labelledby="world-tab-${i}" tabindex="0"><figure class="world-category-image"><img src="/assets/editorial/${n.name.toLowerCase()}.webp" alt="${esc(n.imageAlt)}" width="${n.name==='TRAVEL'?360:480}" height="640" loading="lazy" decoding="async"></figure><div class="world-state-copy"><span class="world-index">0${i+1}</span><h3>${esc(n.name)}</h3><p>${esc(n.description)}</p></div></article>`).join('')}</div>
    ${asset('editorial/rose-petals','world-petals',600,600)}
  </div>
 </div></div></section>`;
}

const workPoster = v => `<img src="${esc(v.poster)}" alt="Кадр из видео: ${esc(v.title)}" width="540" height="960" loading="lazy" decoding="async">`;
function Work(){const total=String(videos.length).padStart(2,'0');return `<section class="work" id="work" data-chapter="work" aria-labelledby="work-title"><div class="work-pin">
  <div class="page-width">${marker('04','РАБОТЫ',`SELECTED STORIES / 01—${total}`)}
    <div class="work-heading"><h2 id="work-title"><span>SELECTED</span><em>UGC</em><small>РАБОТЫ</small></h2><div class="work-intro"><p>Контент,<br>который я<br><i>создаю</i></p></div></div>
  </div>
  <div class="work-rail" tabindex="0" aria-label="Работы — листайте горизонтально"><div class="work-track">${videos.map((v,i)=>`<article class="work-card" data-work-card="${i}"><button type="button" class="work-poster" data-video="${i}" data-cursor="PLAY" aria-label="Открыть видео: ${esc(v.title)}">${workPoster(v)}<span class="work-card-top" aria-hidden="true"><span>${v.id} / ${total}</span><span>UGC FILM</span></span><span class="work-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5 19 12 8 19Z"/></svg></span></button><div class="work-card-caption"><h3>${esc(v.title)}</h3><span>${esc(v.category)}</span></div></article>`).join('')}</div></div>
  <div class="work-controls page-width"><span class="work-counter"><span class="work-current">01</span><span> / ${total}</span></span><div class="work-progress" aria-hidden="true"><span class="work-progress-fill" style="width:${100/videos.length}%"></span></div><span class="work-scroll-label micro">SCROLL TO DISCOVER</span><div class="work-arrows"><button data-work-step="-1" aria-label="Предыдущая работа">←</button><button data-work-step="1" aria-label="Следующая работа">→</button></div></div>
 </div><div class="work-index page-width" aria-label="Индекс всех работ">${videos.map((v,i)=>`<button type="button" data-video="${i}" aria-label="Открыть видео: ${esc(v.title)}"><span class="work-index-image">${workPoster(v)}<span class="work-index-number" aria-hidden="true">${v.id}</span></span><span class="work-index-title">${esc(v.title)}</span></button>`).join('')}</div></section>`;}

function Create(){const words=['UGC','GRWM','LET’S TALK','VOICEOVER','REVIEW','UNBOXING','LIFESTYLE','NATIVE','PHOTO'];return `<section class="create" id="services" data-chapter="services" aria-labelledby="create-title"><div class="page-width">${marker('05','ЧТО Я СОЗДАЮ','YOUR IDEA. MY POINT OF VIEW.')}
 <div class="create-heading"><h2 id="create-title"><span>Ваш бренд +</span> <span>Моя подача = <em>"ВАУ!"</em></span></h2></div>
 <div class="formats-stage"><figure class="format-photo"><span class="create-paperclip" aria-hidden="true"><img src="/assets/editorial/IMG_1481.JPG" width="736" height="736" loading="lazy" alt=""></span><span class="create-candle" aria-hidden="true"><img src="/assets/editorial/IMG_1488.JPG" width="750" height="750" loading="lazy" alt=""></span>${photo('mirror','(min-width: 900px) 27vw, 66vw')}<figcaption><span class="recording-dot"></span>REC <span>MADE TO FEEL REAL</span></figcaption></figure><div class="format-list">${services.map((name,i)=>`<div class="format-row" data-format="${i}"><span class="format-number">${String(i+1).padStart(2,'0')}</span><span class="format-word">${words[i]}</span><span class="format-description">${esc(name)}</span></div>`).join('')}</div></div>
 <div class="create-bottom"><a href="#contact" class="text-link">ОБСУДИМ ВАШУ ИДЕЮ <span>↗</span></a></div>
 </div></section>`;}

function serviceVisual(offer, index) {
 const reel = (id, className='service-reel') => {
  const i=videos.findIndex(work=>work.id===id), work=videos[i];
  return `<button type="button" class="${className}" data-video="${i}" data-cursor="PLAY" aria-label="Открыть видео: ${esc(work.title)}"><img src="${esc(work.poster)}" alt="Кадр из видео: ${esc(work.title)}" width="540" height="960" loading="lazy" decoding="async"><span class="service-play" aria-hidden="true">▶</span></button>`;
 };
 const story = (id, i) => {
  const work=videos.find(work=>work.id===id);
  return `<figure class="service-story service-story-${i+1}"><img src="${esc(work.poster)}" alt="Кадр: ${esc(work.title)}" width="540" height="960" loading="lazy" decoding="async"><figcaption>STORY 0${i+1}</figcaption></figure>`;
 };
 let content='';
 if(offer.kind==='photo') content=`<div class="service-photo service-photo-1">${photo('portrait','(min-width: 1100px) 260px, 52vw')}</div><div class="service-photo service-photo-2"><img src="/assets/editorial/beauty.webp" alt="Предметная фотография косметики e.l.f." width="480" height="640" loading="lazy" decoding="async"></div><div class="service-photo service-photo-3">${photo('street','(min-width: 1100px) 210px, 44vw')}</div>`;
 else content=reel(offer.work)+(offer.stories?offer.stories.map(story).join(''):'');
 const decor=offer.kind==='video'?asset('decor/objects/silver-camera','service-decor service-camera',500,337):offer.kind==='native'?asset('editorial/rose-petals','service-decor service-petals',399,400):offer.kind==='stories'?asset('decor/stars/star-handdrawn','service-decor service-star',220,207):'';
 return `<div class="service-visual service-visual-${offer.kind}"><span class="service-watermark" aria-hidden="true">0${index+1}</span><div class="service-composition">${content}${decor}</div><p class="service-visual-label">${offer.kind==='photo'?'LIFESTYLE / PRODUCT / DETAILS':offer.kind==='stories'?'REEL + STORIES':offer.kind==='native'?'В МОЁМ ПРИВЫЧНОМ ФОРМАТЕ':'ДЛЯ ВАШЕГО БРЕНДА · 9:16'}</p></div>`;
}
function ServiceIndex(){return `<section class="service-index" id="service-index" data-chapter="services" aria-labelledby="service-index-title"><div class="service-pin"><div class="page-width service-shell">
 ${marker('06','УСЛУГИ','LET’S CREATE TOGETHER')}
 <header class="service-heading"><h2 id="service-index-title"><span>КАК МОЖЕМ</span><em>ПОРАБОТАТЬ ВМЕСТЕ</em></h2><p class="handwritten">от идеи до готового контента</p></header>
 <div class="service-layout"><div class="service-list">${serviceOffers.map((offer,i)=>`<article class="service-item" data-service="${i}"><h3><button type="button" class="service-toggle" id="service-toggle-${i}" aria-controls="service-panel-${i}" aria-expanded="true"><span class="service-number">0${i+1}</span><span class="service-name">${esc(offer.title)}</span><span class="service-toggle-mark" aria-hidden="true"></span></button></h3><div class="service-panel" id="service-panel-${i}" role="region" aria-labelledby="service-toggle-${i}"><p class="service-description">${esc(offer.description)}</p>${serviceVisual(offer,i)}<dl class="service-features">${offer.features.map(([name,text],n)=>`<div class="service-feature"><dt><span>0${n+1}</span> / ${esc(name)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl></div></article>`).join('')}</div></div>
 </div></div></section>`;}

function Connect(){return `<section class="connect" id="contact" data-chapter="contact" aria-labelledby="contact-title"><div class="page-width">${marker('07','НА СВЯЗИ','A NEW STORY STARTS HERE')}
 <div class="letter-scene"><div class="letter-envelope" aria-hidden="true"><span>ДЛЯ ВАШЕГО БРЕНДА.<br>С ТЕПЛОМ, ЛИЗА</span></div><article class="letter-sheet"><div class="letter-meta"><span>TO: YOUR BRAND<br>FROM: ELIZAVETA</span><span>LET’S MAKE<br>SOMETHING BEAUTIFUL ↗</span></div>
 <h2 id="contact-title">Давайте создадим<br><em>что-то классное.</em></h2><div class="letter-intro"><div class="letter-copy"><p>Если вам близка моя эстетика и формат контента — буду рада обсудить сотрудничество.</p></div><figure class="contact-photo">${photo('portrait','(min-width: 761px) 180px, 36vw')}</figure></div>
 <div class="contact-links"><a data-cursor="OPEN" href="https://instagram.com/waniloow" target="_blank" rel="noopener noreferrer"><span class="contact-platform">${socialIcon('instagram')}<span class="platform-name">Instagram</span></span><strong>@waniloow</strong><span aria-hidden="true">↗</span></a><a data-cursor="OPEN" href="mailto:lbritakina@gmail.com"><span class="contact-platform">${socialIcon('gmail')}<span class="platform-name">Gmail</span></span><strong>lbritakina@gmail.com</strong><span aria-hidden="true">↗</span></a><a data-cursor="OPEN" href="https://t.me/waniloow" target="_blank" rel="noopener noreferrer"><span class="contact-platform">${socialIcon('telegram')}<span class="platform-name">Telegram</span></span><strong>@waniloow</strong><span aria-hidden="true">↗</span></a></div>
 <div class="letter-signature"><span class="handwritten">начнём с вашего сообщения.</span>${asset('elizaveta-signature','letter-name',2161,728)}</div></article>${asset('editorial/wax-seal','letter-seal',400,400)}${asset('editorial/rose-petals','letter-petals',600,600)}</div>
 <footer class="footer"><a class="footer-logo" href="#home" aria-label="waniloow — на главную">waniloow</a><span>LIFESTYLE CREATOR & UGC<br><small>С ЛЮБОВЬЮ К МАЛЕНЬКИМ ДЕТАЛЯМ</small></span><a href="#home" class="back-top">В НАЧАЛО ↑</a>${asset('editorial/fawn','footer-fawn',350,500)}</footer>
 </div></section>`;}

export function mountSections(target){target.innerHTML=[About(),Film(),Contents(),World(),Work(),Create(),ServiceIndex(),Connect()].join('');}
