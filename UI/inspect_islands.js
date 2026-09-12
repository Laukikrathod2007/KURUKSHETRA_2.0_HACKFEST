const fs = require('fs');

const raw = fs.readFileSync('tempo_raw.html', 'utf8');

const islandRegex = /<astro-island[\s\S]*?props="([\s\S]*?)"[\s\S]*?>/g;
let m;
let i = 0;
while ((m = islandRegex.exec(raw)) !== null) {
  i++;
  console.log(`\n--- Astro Island ${i} ---`);
  const componentUrl = m[0].match(/component-url="([^"]+)"/);
  console.log('Component:', componentUrl ? componentUrl[1] : 'Unknown');
  const decodedProps = m[1].replace(/&quot;/g, '"');
  console.log('Props snippet:', decodedProps.substring(0, 200) + '...');
}
