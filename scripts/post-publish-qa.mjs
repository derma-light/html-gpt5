#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

console.log('🔍 Post-Publish QA Checkliste für Card Expandable v1.0.0');
console.log('=' .repeat(60));
console.log('');

let allChecksPassed = true;
const results = [];

// Helper: Check ausführen und Ergebnis speichern
function runCheck(name, checkFn) {
  try {
    const result = checkFn();
    results.push({ name, status: '✅ PASS', details: result });
    console.log(`✅ ${name}: ${result}`);
  } catch (error) {
    results.push({ name, status: '❌ FAIL', details: error.message });
    console.log(`❌ ${name}: ${error.message}`);
    allChecksPassed = false;
  }
}

// 1. NPM Version Check
runCheck('NPM Version Check', () => {
  try {
    const output = execSync('npm info card-expandable version', { encoding: 'utf8' }).trim();
    if (output === '1.0.0') {
      return `Version ${output} ✓`;
    } else {
      throw new Error(`Unerwartete Version: ${output} (erwartet: 1.0.0)`);
    }
  } catch (error) {
    throw new Error(`NPM Check fehlgeschlagen: ${error.message}`);
  }
});

// 2. Frisches Testprojekt
runCheck('Frisches Testprojekt', () => {
  const testDir = '/tmp/ce-test';
  
  try {
    // Verzeichnis erstellen
    execSync(`mkdir -p "${testDir}"`, { stdio: 'ignore' });
    process.chdir(testDir);
    
    // NPM init
    execSync('npm init -y', { stdio: 'ignore' });
    
    // Package installieren
    execSync('npm install card-expandable@1.0.0', { stdio: 'ignore' });
    
    // Modul laden testen
    const output = execSync('node -e "require(\'./node_modules/card-expandable/dist/card-expandable.min.js\'); console.log(\'Loaded OK\')"', { encoding: 'utf8' }).trim();
    
    if (output.includes('Loaded OK')) {
      return 'Modul erfolgreich geladen ✓';
    } else {
      throw new Error(`Unerwartete Ausgabe: ${output}`);
    }
  } catch (error) {
    throw new Error(`Testprojekt Setup fehlgeschlagen: ${error.message}`);
  } finally {
    // Zurück zum ursprünglichen Verzeichnis
    process.chdir(process.cwd());
  }
});

// 3. CDN Verfügbarkeit
runCheck('CDN Verfügbarkeit', () => {
  try {
    const output = execSync('curl -I https://unpkg.com/card-expandable@1.0.0/dist/card-expandable.min.js', { encoding: 'utf8' });
    
    if (output.includes('200 OK')) {
      return 'CDN erreichbar ✓';
    } else {
      throw new Error(`CDN nicht erreichbar: ${output.split('\n')[0]}`);
    }
  } catch (error) {
    throw new Error(`CDN Check fehlgeschlagen: ${error.message}`);
  }
});

// 4. SRI Hash Validierung
runCheck('SRI Hash Validierung', () => {
  try {
    // Aktuellen Hash aus der Build-Datei berechnen
    if (!existsSync('dist/card-expandable.min.js')) {
      throw new Error('Build-Datei nicht gefunden');
    }
    
    const data = readFileSync('dist/card-expandable.min.js');
    const currentHash = 'sha384-' + createHash('sha384').update(data).digest('base64');
    
    // Hash in README finden
    const readme = readFileSync('README.md', 'utf8');
    const hashMatch = readme.match(/sha384-[A-Za-z0-9+/=]+/);
    
    if (!hashMatch) {
      throw new Error('Kein SRI Hash in README gefunden');
    }
    
    const readmeHash = hashMatch[0];
    
    if (currentHash === readmeHash) {
      return `SRI Hash stimmt überein ✓ (${currentHash.substring(0, 20)}...)`;
    } else {
      throw new Error(`Hash-Mismatch: Build=${currentHash.substring(0, 20)}... vs README=${readmeHash.substring(0, 20)}...`);
    }
  } catch (error) {
    throw new Error(`SRI Validierung fehlgeschlagen: ${error.message}`);
  }
});

// 5. TODO Check
runCheck('TODO Check', () => {
  try {
    const output = execSync('grep -R "TODO" src/ 2>/dev/null || true', { encoding: 'utf8' }).trim();
    
    if (!output) {
      return 'Keine offenen TODOs gefunden ✓';
    } else {
      const todoCount = output.split('\n').filter(line => line.trim()).length;
      throw new Error(`${todoCount} offene TODO(s) gefunden`);
    }
  } catch (error) {
    throw new Error(`TODO Check fehlgeschlagen: ${error.message}`);
  }
});

// 6. Git Tag Check
runCheck('Git Tag Check', () => {
  try {
    const output = execSync('git tag -l v1.0.0', { encoding: 'utf8' }).trim();
    
    if (output === 'v1.0.0') {
      return 'Git Tag v1.0.0 existiert ✓';
    } else {
      throw new Error(`Git Tag nicht gefunden: ${output}`);
    }
  } catch (error) {
    throw new Error(`Git Tag Check fehlgeschlagen: ${error.message}`);
  }
});

// 7. Bundle Size Check
runCheck('Bundle Size Check', () => {
  try {
    if (!existsSync('dist/card-expandable.min.js')) {
      throw new Error('Build-Datei nicht gefunden');
    }
    
    const stats = execSync('wc -c dist/card-expandable.min.js', { encoding: 'utf8' }).trim();
    const size = parseInt(stats.split(' ')[0]);
    const sizeKB = (size / 1024).toFixed(1);
    
    if (size < 10240) { // < 10KB
      return `Bundle Size: ${sizeKB} KB ✓`;
    } else {
      throw new Error(`Bundle zu groß: ${sizeKB} KB (Ziel: <10KB)`);
    }
  } catch (error) {
    throw new Error(`Bundle Size Check fehlgeschlagen: ${error.message}`);
  }
});

console.log('');
console.log('📊 QA Ergebnisse Zusammenfassung:');
console.log('=' .repeat(60));

results.forEach(result => {
  console.log(`${result.status} ${result.name}`);
});

console.log('');
console.log('🎯 Gesamtergebnis:', allChecksPassed ? '✅ ALLE CHECKS BESTANDEN' : '❌ EINIGE CHECKS FEHLGESCHLAGEN');

if (!allChecksPassed) {
  console.log('');
  console.log('💡 Nächste Schritte:');
  console.log('1. Fehlgeschlagene Checks analysieren');
  console.log('2. Probleme beheben');
  console.log('3. QA Script erneut ausführen');
  process.exit(1);
} else {
  console.log('');
  console.log('🎉 Release v1.0.0 ist bereit für den Produktiveinsatz!');
  console.log('🚀 Alle Qualitätsstandards erfüllt.');
}
