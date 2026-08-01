const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'D:/harga plakat akrilik small medium large + Box.xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  
  console.log('Sheet names:', workbook.SheetNames);
  
  // Read first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log('\nFirst 10 rows:');
  data.slice(0, 10).forEach((row, i) => {
    console.log(`Row ${i}:`, row);
  });
  
  // Save full data to JSON file
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  fs.writeFileSync('C:/Users/agungchn/AppData/Local/Temp/opencode/harga-plakat.json', JSON.stringify(jsonData, null, 2));
  console.log('\nFull data saved to: C:/Users/agungchn/AppData/Local/Temp/opencode/harga-plakat.json');
  
} catch (err) {
  console.error('Error reading Excel file:', err.message);
}
