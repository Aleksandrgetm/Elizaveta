import {mountSections} from './components.js';
import {initWelcome,initReveals,initMediaDialog} from './interactions.js';
mountSections(document.querySelector('#sections'));
initMediaDialog();
document.querySelector('#replay-intro').addEventListener('click',()=>initWelcome({force:true}));
await initWelcome();
initReveals();
