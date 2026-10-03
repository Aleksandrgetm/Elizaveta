// Page sections and interactive controllers are kept separate from editable content.
import { mountSections } from './components.js';
import { initWelcome, initReveals, initMediaDialog } from './interactions.js';
mountSections(document.querySelector('#sections'));
initWelcome();
initReveals();
initMediaDialog();
