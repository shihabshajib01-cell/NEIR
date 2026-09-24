import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targets = [path.join(root, 'src')];
const singleFiles = [path.join(root, 'index.source.html')];

const replacements = new Map([
  ['#F4F7FA', '#F7F8FC'],
  ['#FAFCFE', '#F7F8FC'],
  ['#F8FAFC', '#F7F8FC'],
  ['#172B4D', '#202338'],
  ['#52677A', '#626981'],
  ['#748597', '#7A8197'],
  ['#9AAEC0', '#A0A6B8'],
  ['#D8E0E8', '#E2E5F0'],
  ['#EAEFF5', '#EEF0FA'],
  ['#C1CBD6', '#C9CEE0'],
  ['#102A43', '#202338'],
  ['#173F5F', '#4B5694'],
  ['#214F73', '#7C8BD6'],
  ['#147D83', '#4B5694'],
  ['#14804A', '#4B5694'],
  ['#10683D', '#343D73'],
  ['#0D5230', '#2D345F'],
  ['#F59E0B', '#EF8F22'],
  ['#B45309', '#B96B18'],
  ['#D97706', '#EF8F22'],
  ['#DC2626', '#C62828'],
  ['#B91C1C', '#A91F22'],
  ['#991B1B', '#8F1D20'],
]);

const validExt = new Set(['.js', '.jsx', '.css']);

function transform(content) {
  let next = content;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }

  next = next
    .replace(
      'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
    );

  return next;
}

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const before = fs.readFileSync(filePath, 'utf8');
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    process.stdout.write(\`updated \${path.relative(root, filePath)}\n\`);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (validExt.has(path.extname(entry.name))) updateFile(full);
  }
}

for (const dir of targets) {
  if (fs.existsSync(dir)) walk(dir);
}
for (const file of singleFiles) updateFile(file);
