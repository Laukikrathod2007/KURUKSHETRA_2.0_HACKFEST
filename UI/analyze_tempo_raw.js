const fs = require('fs');

const raw = fs.readFileSync('tempo_raw.html', 'utf8');

// Find all data-section elements
const sectionRegex = /data-section="([^"]+)"/g;
let m;
const sections = [];
while ((m = sectionRegex.exec(raw)) !== null) {
  sections.push({ name: m[1], index: m.index });
}

console.log('Sections in tempo_raw.html:');
sections.forEach(s => console.log(`- ${s.name} at index ${s.index}`));

// Look at what each section contains
for (let i = 0; i < sections.length; i++) {
  const current = sections[i];
  const next = sections[i+1];
  const slice = raw.substring(current.index, next ? next.index : raw.length);
  
  const h1 = slice.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h2 = slice.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const h3s = slice.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi);
  const paragraphs = slice.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  
  console.log(`\n=================== Section: ${current.name} ===================`);
  if (h1) console.log('H1:', h1[1].replace(/<[^>]+>/g, '').trim());
  if (h2) console.log('H2:', h2[1].replace(/<[^>]+>/g, '').trim());
  if (h3s) console.log('H3s:', h3s.map(h => h.replace(/<[^>]+>/g, '').trim()));
  if (paragraphs) console.log('Paragraphs count:', paragraphs.length);
  if (paragraphs && paragraphs[0]) console.log('P1:', paragraphs[0].replace(/<[^>]+>/g, '').trim().substring(0, 120) + '...');
}
