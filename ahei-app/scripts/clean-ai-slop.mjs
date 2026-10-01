import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('src');

function getAllFiles(dir, exts = ['.tsx', '.ts', '.css']) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(item.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getAllFiles(srcDir);
let changedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Replace AI Slop Colors
  // #6933F7 / #6933f7 (electric purple) -> #164A3A (Primary Deep Forest Green)
  content = content.replace(/#6933F7/gi, '#164A3A');
  
  // #4352FF / #4352ff (electric indigo) -> #164A3A
  content = content.replace(/#4352FF/gi, '#164A3A');

  // #DE1B7C / #de1b7c (hot neon magenta) -> #B28A45 (Academic Gold)
  content = content.replace(/#DE1B7C/gi, '#B28A45');

  // #eff6ff (light neon blue wash) -> #F7F6F2 (warm ivory wash)
  content = content.replace(/#eff6ff/gi, '#F7F6F2');

  // #bfdbfe / #dbeafe (light blue borders) -> #D9D7D0 (warm broadsheet hairline)
  content = content.replace(/#bfdbfe/gi, '#D9D7D0');
  content = content.replace(/#dbeafe/gi, '#D9D7D0');

  // 2. Eradicate bubbly AI-slop geometry
  // rounded-3xl -> rounded-none
  content = content.replace(/\brounded-3xl\b/g, 'rounded-none');
  
  // rounded-2xl -> rounded-none (cards & containers)
  content = content.replace(/\brounded-2xl\b/g, 'rounded-none');

  // rounded-xl -> rounded-xs (4px button/input radius per DESIGN.md)
  content = content.replace(/\brounded-xl\b/g, 'rounded-xs');

  // 3. Remove floating blurry dropshadows
  content = content.replace(/\bshadow-2xl\b/g, 'shadow-none');
  content = content.replace(/\bshadow-xl\b/g, 'shadow-none');
  content = content.replace(/\bshadow-lg\b/g, 'shadow-none');
  content = content.replace(/\bshadow-md\b/g, 'shadow-none');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
    console.log(`Cleaned AI slop in: ${path.relative(process.cwd(), file)}`);
  }
}

console.log(`Total files cleaned: ${changedCount}`);
