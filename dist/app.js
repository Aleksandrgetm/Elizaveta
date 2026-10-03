import {mountDecorations} from './decorations.js';
import {mountSections} from './components.js';
import {initWelcome,initReveals,initMediaDialog} from './interactions.js';
mountSections(document.querySelector('#sections'));
mountDecorations();
initMediaDialog();
document.querySelector('#replay-intro').addEventListener('click',()=>initWelcome({force:true}));
await initWelcome();
initReveals();
// Sections mount after HTML parsing; restore native deep-link positioning once ready.
if(location.hash){
  document.fonts.ready.then(()=>requestAnimationFrame(()=>{
    let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
    document.getElementById(id)?.scrollIntoView({behavior:'instant'});
  }));
}
