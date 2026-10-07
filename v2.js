import {mountSections} from './v2-components.js?v=services-20261007';
import {initInteractions,initMediaDialog} from './v2-interactions.js?v=ugc-20261005';
import {initMotion} from './v2-motion.js?v=services-20261007-5';

mountSections(document.querySelector('#sections'));
initMediaDialog();
initInteractions();
initMotion();
if(location.hash) document.fonts.ready.then(()=>requestAnimationFrame(()=>{
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
  document.getElementById(id)?.scrollIntoView({behavior:'instant'});
}));
