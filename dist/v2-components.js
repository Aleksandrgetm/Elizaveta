import {photos,niches,videos,services,gallery} from './content.js';

export const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function photo(key,sizes='(min-width: 900px) 30vw, 80vw',className='') {
  const p=photos[key];
  if(!p) return `<img class="${className}" src="${esc(key)}" alt="" loading="lazy" decoding="async" width="900" height="1200">`;
  return `<img class="${className}" src="/assets/photos/liza-${p.id}-960.webp" srcset="/assets/photos/liza-${p.id}-480.webp 480w, /assets/photos/liza-${p.id}-960.webp 960w, /assets/photos/liza-${p.id}-1440.webp 1440w" sizes="${sizes}" width="900" height="1200" alt="${esc(p.alt)}" loading="lazy" decoding="async">`;
}
const asset=(file,className='',width=400,height=400)=>`<img class="${className}" src="/assets/${file}.webp" width="${width}" height="${height}" loading="lazy" decoding="async" alt="" aria-hidden="true">`;
const marker=(number,name,end='LIFESTYLE CREATOR & UGC')=>`<div class="section-marker"><span>${number} / ${name}</span><span>${end}</span></div>`;

function About(){return `<section class="about" id="about" data-chapter="about" aria-labelledby="about-title">
  <div class="page-width">${marker('01','ЗНАКОМСТВО','A FEW WORDS ABOUT ME')}
    <div class="about-spread">
      <div class="about-visual"><span class="about-label" aria-hidden="true">about<br><i>me</i></span>
        <figure class="about-photo">${photo('summer','(min-width: 900px) 34vw, 75vw')}<figcaption><span>ELIZAVETA</span><span>01 — EVERYDAY MUSE</span></figcaption></figure>
        ${asset('editorial/ribbon-key','about-key',360,560)}<span class="about-note handwritten">это я, без сценария</span>
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

function Film(){return `<div class="film-scene" aria-label="Кадры из жизни Лизы"><div class="film-track">${['beauty','street','cafe','mirror','flowers','summer','portrait','fashion'].map((key,i)=>`<figure class="film-frame">${photo(key,'(min-width: 900px) 220px, 140px')}<figcaption><span>LIZA / PERSONAL ARCHIVE</span><span>${String(i+1).padStart(2,'0')} ▸</span></figcaption></figure>`).join('')}</div><p class="film-caption handwritten">жизнь между кадрами</p></div>`;}

function Contents(){
 const prop=(name,file,depth)=>`<span class="desk-object desk-${name}" data-depth="${depth}">${asset(file)}</span>`;
 return `<section class="contents" id="contents" data-chapter="niches" aria-labelledby="contents-title"><div class="page-width">${marker('02','СОДЕРЖАНИЕ','PRESS PLAY ON MY WORLD')}
  <div class="desk-stage"><div class="desk-heading"><p class="micro">ВЫБЕРИТЕ СВОЮ ДОРОЖКУ</p><h2 id="contents-title">On the<br><em>record.</em></h2></div>
    <div class="vinyl-disc" data-cursor="EXPLORE">${asset('vinyl','vinyl-image',1100,1100)}
      <span class="vinyl-center" aria-hidden="true">SIDE A<br><i>L.</i><small>33⅓ RPM</small></span>
      <nav class="vinyl-navigation" aria-label="Содержание портфолио">${[['about','Обо мне'],['contact','Контакты'],['niches','Направления'],['work','Работы'],['services','Что я создаю']].map(([id,label],i)=>`<a href="#${id}" class="vinyl-link vinyl-link-${i}"><span class="vinyl-index">0${i+1}</span><span class="vinyl-link-label">${label}</span></a>`).join('')}</nav>
    </div>
    ${prop('phone','decor/objects/retro-phone',-1)}${prop('earphones','decor/objects/wired-earphones',.6)}${prop('cassette','decor/objects/pink-cassette',.8)}${prop('bow','decor/objects/pink-bow',-.2)}${prop('stars','decor/stars/star-handdrawn',.15)}
    <p class="desk-note handwritten">всё, что я люблю,<br>на одной пластинке</p><p class="desk-bottom micro">BEAUTY · FASHION · EVERYDAY LIFE <span>FLIP TO EXPLORE ↓</span></p>
  </div></div></section>`;
}

function World(){
 const paths=['M485 315 C420 290 335 155 250 150','M520 300 C625 240 675 140 770 165','M490 365 C380 405 265 360 210 425','M550 365 C665 405 725 395 800 470','M510 390 C490 485 465 520 480 610'];
 return `<section class="world" id="niches" data-chapter="niches" aria-labelledby="world-title"><div class="page-width">${marker('03','НАПРАВЛЕНИЯ','FIVE WAYS TO TELL A STORY')}<div class="world-heading"><h2 id="world-title">МОИ <em>НАПРАВЛЕНИЯ</em></h2><p class="handwritten">близко мне. интересно вам.</p></div>
  <div class="world-map"><svg class="world-connections" viewBox="0 0 1000 750" preserveAspectRatio="none" aria-hidden="true">${niches.map((n,i)=>`<path class="world-path" data-category="${n.name.toLowerCase()}" d="${paths[i]}" pathLength="1"/>`).join('')}</svg>
    <figure class="world-portrait"><img class="world-face" src="/assets/editorial/flower-portrait.webp" alt="Лиза в чёрном платье с большим букетом цветов" width="750" height="1000" loading="lazy">${asset('lace-frame','world-frame',900,1200)}<figcaption class="handwritten">в центре — я</figcaption></figure>
    ${niches.map((n,i)=>`<button type="button" class="world-bubble bubble-${n.name.toLowerCase()}" data-category="${n.name.toLowerCase()}" aria-pressed="false"><span class="bubble-image"><img src="/assets/editorial/${n.name.toLowerCase()}.webp" alt="${esc(n.imageAlt)}" width="480" height="640" loading="lazy"></span><span class="bubble-copy"><span class="bubble-index">0${i+1}</span><strong>${n.name}</strong><span>${esc(n.description)}</span></span></button>`).join('')}
    ${asset('editorial/rose-petals','world-petals',600,600)}
  </div><p class="world-footnote micro">ПЯТЬ НАПРАВЛЕНИЙ. ОДИН ЛИЧНЫЙ ВЗГЛЯД.</p></div></section>`;
}

function Work(){return `<section class="work" id="work" data-chapter="work" aria-labelledby="work-title"><div class="work-pin">
  <div class="page-width">${marker('04','РАБОТЫ','SELECTED STORIES / 01—12')}
    <div class="work-heading"><h2 id="work-title"><span>SELECTED</span><em>UGC</em><small>РАБОТЫ</small></h2><div class="work-intro"><p>Маленькие истории,<br>которые хочется<br><i>досмотреть.</i></p>${videos.some(v=>!v.src)?'<span class="work-draft">Пока здесь — фотопревью.<br>Видео скоро появятся.</span>':''}</div></div>
  </div>
  <div class="work-rail" tabindex="0" aria-label="Работы — листайте горизонтально"><div class="work-track">${videos.map((v,i)=>`<article class="work-card" data-work-card="${i}"><button class="work-poster" data-video="${i}" data-cursor="PLAY" aria-label="${esc(v.title)} — ${v.src?'смотреть видео':'открыть превью'}">${photo(v.poster,'(min-width: 1100px) 310px, 72vw')}<span class="work-card-top"><span>${v.id} / 12</span><span>${v.src?'UGC FILM':'PHOTO PREVIEW'}</span></span><span class="work-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5 19 12 8 19Z"/></svg></span>${!v.src?'<span class="work-soon">ВИДЕО СКОРО</span>':''}</button><div class="work-card-caption"><h3>${esc(v.title)}</h3><span>${esc(v.category)}</span></div></article>`).join('')}</div></div>
  <div class="work-controls page-width"><span class="work-counter"><span class="work-current">01</span><span> / 12</span></span><div class="work-progress" aria-hidden="true"><span class="work-progress-fill"></span></div><span class="work-scroll-label micro">SCROLL TO DISCOVER</span><div class="work-arrows"><button data-work-step="-1" aria-label="Предыдущая работа">←</button><button data-work-step="1" aria-label="Следующая работа">→</button></div></div>
 </div><div class="work-index page-width" aria-label="Индекс всех работ">${videos.map((v,i)=>`<button data-video="${i}" aria-label="${esc(v.title)} — открыть превью">${photo(v.poster,'(min-width: 700px) 120px, 28vw')}<span>${v.id}</span></button>`).join('')}</div></section>`;}

function Create(){const words=['UGC','GRWM','LET’S TALK','VOICEOVER','REVIEW','UNBOXING','LIFESTYLE','NATIVE','PHOTO'];return `<section class="create" id="services" data-chapter="services" aria-labelledby="create-title"><div class="page-width">${marker('05','ЧТО Я СОЗДАЮ','YOUR IDEA. MY POINT OF VIEW.')}
 <div class="create-heading"><h2 id="create-title">Ваш бренд.<br><em>Моя подача.</em></h2><p>От первого «смотрите, что нашла»<br>до истории, которую сохраняют.</p></div>
 <div class="formats-stage"><figure class="format-photo">${photo('mirror','(min-width: 900px) 27vw, 66vw')}<figcaption><span class="recording-dot"></span>REC <span>MADE TO FEEL REAL</span></figcaption></figure><div class="format-list">${services.map((name,i)=>`<div class="format-row" data-format="${i}"><span class="format-number">${String(i+1).padStart(2,'0')}</span><span class="format-word">${words[i]}</span><span class="format-description">${esc(name)}</span></div>`).join('')}</div></div>
 <div class="create-bottom"><span class="handwritten">не просто контент. чувство.</span><a href="#contact" class="text-link">ОБСУДИМ ВАШУ ИДЕЮ <span>↗</span></a></div>
 </div></section>`;}

function Moments(){const treatments=['paper','borderless','polaroid','film','tape','borderless'];const notes=['маленькие радости','цветы без повода','в своём ритме','любимые места','сегодня так','детали настроения'];return `<section class="moments" id="moments" data-chapter="moments" aria-labelledby="moments-title"><div class="page-width">${marker('06','МОМЕНТЫ','THE BEAUTY OF ORDINARY DAYS')}
 <div class="moments-heading"><h2 id="moments-title">Моменты,<br><span>из которых складывается</span><br><em>моя история</em></h2><p class="handwritten">сохранить в избранное ${asset('decor/hearts/heart-doodles','moments-hearts',400,300)}</p></div>
 <div class="moments-board">${gallery.map((key,i)=>`<button class="moment moment-${i} treatment-${treatments[i]}" data-photo="${i}" aria-label="Открыть фото: ${esc(photos[key].alt)}"><span class="moment-paper">${photo(key,'(min-width: 900px) 300px, 58vw')}<span class="moment-caption handwritten">${notes[i]}</span>${treatments[i]==='tape'?asset('decor/stickers/paper-tape','photo-tape',500,180):''}</span></button>`).join('')}
 ${asset('editorial/ribbon-key','moments-key',360,560)}${asset('editorial/rose-petals','moments-petals',600,600)}${asset('decor/stars/star-trio','moments-stars',400,300)}<span class="moments-note handwritten">самое красивое —<br>настоящее.</span></div>
 </div></section>`;}

function Connect(){return `<section class="connect" id="contact" data-chapter="contact" aria-labelledby="contact-title"><div class="page-width">${marker('07','НА СВЯЗИ','A NEW STORY STARTS HERE')}
 <div class="letter-scene"><div class="letter-envelope" aria-hidden="true"><span>ДЛЯ ВАШЕГО БРЕНДА.<br>С ТЕПЛОМ, ЛИЗА</span></div><article class="letter-sheet"><div class="letter-meta"><span>TO: YOUR BRAND<br>FROM: ELIZAVETA</span><span>LET’S MAKE<br>SOMETHING BEAUTIFUL ↗</span></div>
 <h2 id="contact-title">Давайте создадим<br><em>что-то классное.</em></h2><div class="letter-copy"><p>Готова к сотрудничеству с брендами в нишах бьюти, фешн и лайфстайл.</p><p>Если вам близка моя эстетика и формат контента — буду рада обсудить сотрудничество.</p></div>
 <div class="contact-links"><a data-cursor="OPEN" href="https://instagram.com/waniloow" target="_blank" rel="noopener noreferrer"><span>Instagram</span><strong>@waniloow</strong><span aria-hidden="true">↗</span></a><a data-cursor="OPEN" href="mailto:lbritakina@gmail.com"><span>Gmail</span><strong>lbritakina@gmail.com</strong><span aria-hidden="true">↗</span></a><a data-cursor="OPEN" href="https://t.me/waniloow" target="_blank" rel="noopener noreferrer"><span>Telegram</span><strong>@waniloow</strong><span aria-hidden="true">↗</span></a></div>
 <div class="letter-signature"><span class="handwritten">начнём с вашего сообщения.</span>${asset('elizaveta-signature','letter-name',2161,728)}</div></article>${asset('editorial/wax-seal','letter-seal',400,400)}${asset('editorial/rose-petals','letter-petals',600,600)}</div>
 <footer class="footer"><a class="footer-logo" href="#home">Л.</a><span>LIFESTYLE CREATOR & UGC<br><small>С ЛЮБОВЬЮ К МАЛЕНЬКИМ ДЕТАЛЯМ</small></span><a href="#home" class="back-top">В НАЧАЛО ↑</a>${asset('editorial/fawn','footer-fawn',350,500)}</footer>
 </div></section>`;}

export function mountSections(target){target.innerHTML=[About(),Film(),Contents(),World(),Work(),Create(),Moments(),Connect()].join('');}
