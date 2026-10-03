// All decorative images below come from the owner's assets/decor folder.
export function Decoration(file,{className='',size=30,turn=0,motion=''}={}){
 return `<span class="decoration ${className}" aria-hidden="true" style="--d-size:${size}px;--d-turn:${turn}deg" ${motion?`data-decor-motion="${motion}"`:''}><img class="decoration-art" src="/assets/decor/${file}.webp" width="200" height="200" alt="" loading="${className.startsWith('hero')?'eager':'lazy'}"></span>`;
}
export function mountDecorations(){
 const placements=[
 ['.hero-title-wrap','stars/star-handdrawn','hero-doodle-a',31,-13,'turn'],
 ['.hero-title-wrap','stars/star-trio','hero-doodle-b',36,9,''],
 ['.directions-map','stars/star-trio','niche-doodle-a',40,-10,'pop'],
 ['.directions-map','stars/star-handdrawn','niche-doodle-b',27,12,''],
 ['.directions-title','stars/diamond-sparkles','niche-doodle-c desktop-doodle',45,-6,''],
 ['.work-heading','stars/diamond-sparkles','work-doodle-a',37,8,''],
 ['.work-heading','objects/pink-bow','work-doodle-b',65,-7,'pop'],
 ['.contact-letter','stickers/lip-print','contact-doodle-a',50,-8,'pop'],
 ['.contact-photo','stars/star-handdrawn','contact-doodle-b',31,14,'']
 ];
 placements.forEach(([target,file,className,size,turn,motion])=>document.querySelector(target)?.insertAdjacentHTML('beforeend',Decoration(file,{className,size,turn,motion})));
}
