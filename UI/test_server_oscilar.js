const http = require('http');

http.get('http://localhost:4321', (res) => {
  console.log('Server Status Code:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Contains <canvas id="gl">: ', data.includes('<canvas id="gl"'));
    console.log('Contains Oscilar Hero Title: ', data.includes('AI agents for'));
    console.log('Contains Oscilar 3D Layer Stack Section: ', data.includes('The unified platform that sees the full picture.'));
    console.log('Contains 30B+ Metric: ', data.includes('30B+'));
    console.log('Contains 50% Impact Metric: ', data.includes('50%'));
  });
}).on('error', (err) => {
  console.error('Server request failed:', err.message);
});
