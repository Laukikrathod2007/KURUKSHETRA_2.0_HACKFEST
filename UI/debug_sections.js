const fs = require('fs');
const html = fs.readFileSync('tempo_raw.html', 'utf8');

const regex = /data-section="animation-[0-9]"/g;
let match;
while ((match = regex.exec(html)) !== null) {
  const start = match.index;
  const end = Math.min(html.length, start + 300);
  console.log(`\nSection match at ${start}:\n`, html.substring(start, end));
}
