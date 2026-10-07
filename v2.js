import {mountSections} from './v2-components.js?v=services-20261007';
import {initInteractions,initMediaDialog,lockPage} from './v2-interactions.js?v=mobile-nav-20261007-4';
import {initMotion} from './v2-motion.js?v=services-20261007-5';
import {initMobileNavigation} from './v2-navigation.js?v=mobile-nav-20261007-4';

mountSections(document.querySelector('#sections'));
initMediaDialog();
initInteractions();
initMotion();
initMobileNavigation(() => lockPage('mobile-menu-open'));
if(location.hash) document.fonts.ready.then(()=>requestAnimationFrame(()=>{
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
  document.getElementById(id)?.scrollIntoView({behavior:'instant'});
}));
