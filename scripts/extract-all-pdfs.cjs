const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const dir = 'C:\\Users\\mada_\\Downloads\\drugs';
const outDir = 'C:\\Users\\mada_\\AppData\\Local\\Temp\\opencode\\pdf-extract';
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));

async function extractFile(fileName) {
  const filePath = path.join(dir, fileName);
  try {
    const buf = fs.readFileSync(filePath);
    const d = await pdf(buf);
    const text = d.text;
    const hasContent = text.replace(/\s/g, '').length > 50;
    
    if (hasContent) {
      const outName = fileName.replace(/\.pdf$/i, '.txt').replace(/[^\w\u0600-\u06FF.-]/g, '_');
      const outPath = path.join(outDir, outName);
      fs.writeFileSync(outPath, text, 'utf8');
      return { name: fileName, outName, pages: d.numpages, chars: text.length, status: 'extracted' };
    } else {
      return { name: fileName, pages: d.numpages, chars: 0, status: 'scanned/no-text' };
    }
  } catch(e) {
    return { name: fileName, pages: 0, chars: 0, status: 'error: ' + e.message.substring(0, 80) };
  }
}

async function main() {
  console.log(`Scanning ${files.length} PDFs...`);
  const results = [];
  for (const f of files) {
    const r = await extractFile(f);
    results.push(r);
    const icon = r.status === 'extracted' ? '✅' : '❌';
    console.log(`${icon} ${r.name} | ${r.pages || 0}p | ${r.chars || 0} chars | ${r.status}`);
  }
  
  const extracted = results.filter(r => r.status === 'extracted');
  const failed = results.filter(r => r.status !== 'extracted');
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Extracted: ${extracted.length} PDFs`);
  console.log(`Failed/Scanned: ${failed.length} PDFs`);
  console.log(`Output: ${outDir}`);
  
  // Save manifest
  fs.writeFileSync(path.join(outDir, '_manifest.json'), JSON.stringify(results, null, 2));
}

main();
