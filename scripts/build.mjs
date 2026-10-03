import {mkdirSync,copyFileSync} from 'node:fs';
mkdirSync('dist/vendor',{recursive:true});
for(const file of ['gsap.min.js','ScrollTrigger.min.js'])copyFileSync(`node_modules/gsap/dist/${file}`,`dist/vendor/${file}`);
await import('./check.mjs');
