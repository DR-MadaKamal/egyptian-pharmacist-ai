const fs = require('fs');
const pdf = require('pdf-parse');

const filePath = process.argv[2];
const chars = parseInt(process.argv[3]) || 3000;

const buf = fs.readFileSync(filePath);
pdf(buf).then(d => {
  console.log('Pages:', d.numpages);
  console.log('Text length:', d.text.length);
  console.log('---');
  console.log(d.text.substring(0, chars));
}).catch(e => console.error('Error:', e.message));
