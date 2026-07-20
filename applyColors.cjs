const fs = require('fs');
const path = require('path');

// 1. Update tailwind.config.js
const tailwindPath = path.join(__dirname, 'tailwind.config.js');
let tailwindContent = fs.readFileSync(tailwindPath, 'utf8');
tailwindContent = tailwindContent.replace(/'brand-orange':\s*'#[A-Fa-f0-9]+'/, "'brand-orange': '#fe6000'");
tailwindContent = tailwindContent.replace(/'brand-maroon':\s*'#[A-Fa-f0-9]+'/, "'brand-maroon': '#00671c'");
fs.writeFileSync(tailwindPath, tailwindContent, 'utf8');
console.log('Updated tailwind.config.js');

// 2. Replace #1C512F with #00671c in src
const styledIndbasket = '<span className="text-[#fe6000]">Ind</span><span className="text-[#00671c]">basket</span>';
const styledIndbasketHTML = '<span style="color: #fe6000;">Ind</span><span style="color: #00671c;">basket</span>';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace colors
  content = content.replace(/#1C512F/gi, '#00671c');

  // Replace Indbasket selectively
  // Only replace Indbasket when it's plain text inside tags like >Indbasket< or >Indbasket</...
  // Not when it's an email (indbasket@), alt="Indbasket", or in a template string if we aren't careful.
  
  if (filePath.endsWith('Header.jsx') || filePath.endsWith('Footer.jsx') || 
      filePath.endsWith('AboutPage.jsx') || filePath.endsWith('AdminPage.jsx') || 
      filePath.endsWith('SignupPage.jsx') || filePath.endsWith('MyOrdersPage.jsx')) {
    content = content.replace(/>\s*Indbasket\s*</g, `>${styledIndbasket}<`);
  }

  if (filePath.endsWith('AdminOrdersPage.jsx')) {
    // For invoice HTML template
    content = content.replace(/<strong style="font-size: 20px;">Indbasket<\/strong>/g, `<strong style="font-size: 20px;">${styledIndbasketHTML}</strong>`);
    content = content.replace(/<strong>Indbasket<\/strong>/g, `<strong>${styledIndbasketHTML}</strong>`);
    content = content.replace(/<div class="brand">Indbasket<\/div>/g, `<div class="brand">${styledIndbasketHTML}</div>`);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
      replaceInFile(fullPath);
    }
  }
}

traverseDir(path.join(__dirname, 'src'));
