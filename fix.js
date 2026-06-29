const fs = require('fs');
const scan = require('./scan_result.json');
const FILE = '/home/subhash/projects/Luxudies/src/app/product/[slug]/page.tsx';
let lines = fs.readFileSync(FILE, 'utf-8').split('\n');

// We must apply replacements from bottom to top, right to left so we don't mess up indices
const findings = scan.findings
  .filter(f => f.subcategory.includes('jsx-not-internationalized'))
  .sort((a, b) => {
    if (a.location.range.textRange.startLine !== b.location.range.textRange.startLine) {
      return b.location.range.textRange.startLine - a.location.range.textRange.startLine;
    }
    return b.location.range.textRange.startColumn - a.location.range.textRange.startColumn;
  });

findings.forEach(f => {
  const startL = f.location.range.textRange.startLine - 1;
  const startC = f.location.range.textRange.startColumn - 1;
  const endL = f.location.range.textRange.endLine - 1;
  const endC = f.location.range.textRange.endColumn - 1;

  if (startL === endL) {
    let line = lines[startL];
    let originalText = line.substring(startC, endC);
    
    // e.g. 'Loading product...'
    // We replace it with '{t(`' + originalText + '`)}'
    let replacement = "{t(`" + originalText + "`)}";
    lines[startL] = line.substring(0, startC) + replacement + line.substring(endC);
  } else {
    // Multi-line replacement
    let firstLine = lines[startL];
    let lastLine = lines[endL];
    
    lines[startL] = firstLine.substring(0, startC) + "{t(`" + firstLine.substring(startC);
    lines[endL] = lastLine.substring(0, endC) + "`)}" + lastLine.substring(endC);
  }
});

// Also need to inject 'const t = (s: string) => s;' at the top of the component.
const componentLineIdx = lines.findIndex(l => l.includes('export default function'));
if (componentLineIdx !== -1) {
  lines.splice(componentLineIdx + 1, 0, '  const t = (s: string) => s;');
}

fs.writeFileSync(FILE, lines.join('\n'));
console.log('Fixed file generated');
