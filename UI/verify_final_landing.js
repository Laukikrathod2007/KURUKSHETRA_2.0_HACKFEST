const http = require('http');

http.get('http://localhost:4321', (res) => {
  console.log('HTTP Status Code:', res.statusCode);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Contains <canvas id="gl">:', body.includes('<canvas id="gl"'));
    console.log('Contains PS09 Hero Headline:', body.includes('The autonomous AI defense layer for payment scam interception'));
    console.log('Contains Purpose-Built APP Scams:', body.includes('Purpose-built for Authorized Push Payment (APP) Scams'));
    console.log('Contains Intent NLP Parsing:', body.includes('Intent NLP Parsing'));
    console.log('Contains The Five Domains:', body.includes('The Five Domains of Autonomous Defense'));
    console.log('Contains Agentic Guardian Branding:', body.includes('Agentic Guardian'));
    console.log('Contains Stablecoins (should be 0 or in props only):', (body.match(/stablecoin/gi) || []).length);
  });
}).on('error', (err) => {
  console.error('Test error:', err.message);
});
