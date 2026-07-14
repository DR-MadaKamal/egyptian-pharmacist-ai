const https = require('https');
const fs = require('fs');

const url = 'https://raw.githubusercontent.com/karem505/egyptian-drug-database/main/data/egyptian-drugs.json';
const outPath = 'C:\\Users\\mada_\\AppData\\Local\\Temp\\opencode\\egyptian-drugs.json';

console.log('Downloading Egyptian Drug Database...');
https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error('Failed:', res.statusCode);
    return;
  }
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync(outPath, data);
    console.log(`Downloaded: ${(data.length / 1024 / 1024).toFixed(1)}MB`);
    
    const drugs = JSON.parse(data);
    console.log(`Total records: ${drugs.length}`);
    console.log(`Sample:`, JSON.stringify(drugs[0], null, 2));
    
    // Analyze structure
    const fields = Object.keys(drugs[0]);
    console.log(`\nFields: ${fields.join(', ')}`);
    
    // Count by drug_class
    const classes = {};
    drugs.forEach(d => {
      const cls = d.drug_class || 'Unknown';
      classes[cls] = (classes[cls] || 0) + 1;
    });
    const topClasses = Object.entries(classes).sort((a, b) => b[1] - a[1]).slice(0, 30);
    console.log(`\nTop 30 drug classes:`);
    topClasses.forEach(([cls, count]) => console.log(`  ${count} - ${cls}`));
    
    // Count by route
    const routes = {};
    drugs.forEach(d => {
      const r = d.route || 'Unknown';
      routes[r] = (routes[r] || 0) + 1;
    });
    console.log(`\nRoutes:`);
    Object.entries(routes).sort((a, b) => b[1] - a[1]).forEach(([r, c]) => console.log(`  ${c} - ${r}`));
    
    // Count by manufacturer
    const makers = {};
    drugs.forEach(d => {
      const m = d.manufacturer || 'Unknown';
      makers[m] = (makers[m] || 0) + 1;
    });
    const topMakers = Object.entries(makers).sort((a, b) => b[1] - a[1]).slice(0, 20);
    console.log(`\nTop 20 manufacturers:`);
    topMakers.forEach(([m, c]) => console.log(`  ${c} - ${m}`));
    
    // Check for scientific_name coverage
    const withScientific = drugs.filter(d => d.scientific_name && d.scientific_name.trim()).length;
    console.log(`\nWith scientific name: ${withScientific}/${drugs.length} (${(withScientific/drugs.length*100).toFixed(1)}%)`);
    
    // Check for price coverage
    const withPrice = drugs.filter(d => d.price_egp !== null && d.price_egp !== undefined).length;
    console.log(`With price: ${withPrice}/${drugs.length} (${(withPrice/drugs.length*100).toFixed(1)}%)`);
    
    // Sample Arabic names
    console.log(`\nSample Arabic names:`);
    drugs.slice(0, 20).forEach(d => console.log(`  ${d.commercial_name_ar} = ${d.commercial_name_en}`));
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
});
