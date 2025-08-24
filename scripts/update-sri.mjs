import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const file = 'dist/card-expandable.min.js';

// Prüfe ob die minifizierte Datei existiert
if (!existsSync(file)) {
  console.log('⚠️  Build-Datei nicht gefunden:', file);
  console.log('💡 Führe zuerst den Build aus: npm run build');
  process.exit(1);
}

const data = readFileSync(file);
const hash = 'sha384-' + createHash('sha384').update(data).digest('base64');

function replaceIn(path) {
  try {
    if (!existsSync(path)) {
      console.log('⚠️  Datei nicht gefunden:', path);
      return;
    }
    
    const txt = readFileSync(path, 'utf8');
    const updated = txt.replace(/sha384-[A-Za-z0-9+/=]+/g, hash);
    
    if (txt !== updated) {
      writeFileSync(path, updated);
      console.log('✅ SRI aktualisiert in:', path);
    } else {
      console.log('ℹ️  Keine SRI-Änderung in:', path);
    }
  } catch (error) {
    console.log('❌ Fehler beim Verarbeiten von', path, ':', error.message);
  }
}

console.log('🔍 Aktualisiere SRI Hash in Markdown-Dateien...');
console.log('📁 Build-Datei:', file);
console.log('🔐 Neuer Hash:', hash);
console.log('');

['README.md', 'CHANGELOG.md', 'README_CARD_EXPANDABLE.md'].forEach(f => {
  replaceIn(f);
});

console.log('');
console.log('🎯 Aktueller SRI Hash:', hash);
console.log('💡 Nach dem Update: git diff prüfen und ggf. committen');
