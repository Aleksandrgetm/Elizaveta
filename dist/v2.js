import {mountSections} from './v2-components.js';
import {initInteractions,initMediaDialog} from './v2-interactions.js';
import {initMotion} from './v2-motion.js';

mountSections(document.querySelector('#sections'));
initMediaDialog();
initInteractions();
initMotion();
if(location.hash) document.fonts.ready.then(()=>requestAnimationFrame(()=>{
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
  document.getElementById(id)?.scrollIntoView({behavior:'instant'});
}));
