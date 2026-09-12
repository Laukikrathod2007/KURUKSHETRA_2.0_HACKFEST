const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('Contains <canvas id="gl">: ', html.includes('<canvas id="gl"'));
console.log('Contains "AI agents for every risk decision.": ', html.includes('AI agents for'));
console.log('Contains "Trusted by institutions building next-gen finance": ', html.includes('Trusted by institutions building next-gen finance'));
console.log('Contains "The unified platform that sees the full picture.": ', html.includes('The unified platform that sees the full picture.'));
console.log('Contains "30B+": ', html.includes('30B+'));
console.log('Contains "50%": ', html.includes('50%'));
console.log('Contains script modules: ', html.includes('/_astro/main.BWQdUeit.js'));
