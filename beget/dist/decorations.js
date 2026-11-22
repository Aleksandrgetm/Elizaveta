// All decorative images below come from the owner's assets/decor folder.
export function Decoration(file,{className='',size=30,turn=0,motion=''}={}){
 return `<span class="decoration ${className}" aria-hidden="true" style="--d-size:${size}px;--d-turn:${turn}deg" ${motion?`data-decor-motion="${motion}"`:''}><img class="decoration-art" src="/assets/decor/${file}.webp" width="200" height="200" alt="" loading="${className.startsWith('hero')?'eager':'lazy'}"></span>`;
}
export function mountDecorations(){
 const placements=[
 ['.about-collage','../editorial/ribbon-key','about-key',100,12,'turn'],
 ['.directions-map','../editorial/fawn','directions-fawn',94,-6,'pop'],
 ['.directions-map','../editorial/rose-petals','directions-petals',90,14,'turn'],
 ['.directions-title','stars/star-handdrawn','directions-star',25,-8,''],
 ['.work-heading','stars/diamond-sparkles','work-doodle-a',37,8,''],
 ['.work-heading','objects/pink-bow','work-doodle-b',65,-7,'pop'],
 ['.content-formats','../editorial/pink-star-confetti','formats-confetti',70,10,''],
 ['.contact-letter','../editorial/wax-seal','contact-wax',72,-8,'pop'],
 ['.contact-photo','../editorial/flower-stamp','contact-flower-stamp',75,10,'']
 ];
 placements.forEach(([target,file,className,size,turn,motion])=>document.querySelector(target)?.insertAdjacentHTML('beforeend',Decoration(file,{className,size,turn,motion})));
}
