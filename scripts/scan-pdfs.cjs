const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const dir = 'C:\\Users\\mada_\\Downloads\\drugs';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));

async function scanFile(fileName) {
  const filePath = path.join(dir, fileName);
  try {
    const buf = fs.readFileSync(filePath);
    const d = await pdf(buf);
    const hasText = d.text.replace(/\s/g, '').length > 50;
    return { name: fileName, pages: d.numpages, textLen: d.text.length, hasText, preview: hasText ? d.text.substring(0, 300).replace(/\s+/g, ' ').trim() : '(no text)' };
  } catch(e) {
    return { name: fileName, pages: 0, textLen: 0, hasText: false, preview: '(error: ' + e.message.substring(0, 50) + ')' };
  }
}

async function main() {
  const results = [];
  for (const f of files) {
    const r = await scanFile(f);
    results.push(r);
  }
  
  const extractable = results.filter(r => r.hasText);
  const scanned = results.filter(r => !r.hasText);
  
  console.log(`\n=== EXTRACTABLE (${extractable.length} PDFs) ===`);
  extractable.forEach(r => console.log(`  ${r.name} | ${r.pages}p | ${r.textLen} chars | ${r.preview.substring(0, 120)}`));
  
  console.log(`\n=== SCANNED/IMAGE (${scanned.length} PDFs) ===`);
  scanned.forEach(r => console.log(`  ${r.name} | ${r.preview}`));
}

main();
