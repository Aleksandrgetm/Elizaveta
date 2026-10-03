// One placement map; variants live in the SVG sprite, motion is opt-in per mark.
export function Decoration(variant,{className='',size=30,turn=0,motion=''}={}){
 return `<span class="decoration ${className}" aria-hidden="true" style="--d-size:${size}px;--d-turn:${turn}deg" ${motion?`data-decor-motion="${motion}"`:''}><svg class="decoration-art" viewBox="${variant==='arrow-01'?'0 0 100 70':variant==='loop-01'?'0 0 100 64':'0 0 64 64'}" focusable="false"><use href="/assets/doodles.svg#${variant}"/></svg></span>`;
}
export function StrawberryMascot(){return '<span class="strawberry-mascot" aria-hidden="true"><img src="/assets/strawberry.webp" width="180" height="180" loading="lazy" alt=""></span>'}
export function mountDecorations(){
 const placements=[
 ['.hero-title-wrap','star-01','hero-doodle-a',29,-13,'turn'],
 ['.hero-title-wrap','heart-01','hero-doodle-b',24,9,''],
 ['.hero-scene','star-02','hero-doodle-c desktop-doodle',24,13,''],
 ['.about-quote','heart-02','about-doodle',32,-12,'pulse'],
 ['.record-object','star-01','record-doodle-a',39,-8,'turn'],
 ['.record-object','star-03','record-doodle-b',26,18,''],
 ['.record-object','star-02','record-doodle-c desktop-doodle',18,-16,''],
 ['.directions-map','heart-01','niche-doodle-a',27,-10,'pulse'],
 ['.directions-map','star-01','niche-doodle-b',25,12,''],
 ['.directions-title','loop-01','niche-doodle-c desktop-doodle',50,-6,''],
 ['.work-heading','spark-01','work-doodle-a',27,8,''],
 ['.work-heading','arrow-01','work-doodle-b',60,13,'draw'],
 ['.contact-letter','heart-02','contact-doodle-a',28,-8,'pulse'],
 ['.contact-photo','star-01','contact-doodle-b',31,14,'']
 ];
 placements.forEach(([target,variant,className,size,turn,motion])=>document.querySelector(target)?.insertAdjacentHTML('beforeend',Decoration(variant,{className,size,turn,motion})));
 document.querySelector('.orbit-lifestyle')?.insertAdjacentHTML('beforeend',StrawberryMascot());
}
