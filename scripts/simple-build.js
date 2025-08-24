#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

console.log('🔨 Einfacher Build ohne Rollup...');

try {
  // Input-Datei lesen
  const inputFile = 'js/card-expandable.js';
  if (!existsSync(inputFile)) {
    throw new Error(`Input-Datei nicht gefunden: ${inputFile}`);
  }
  
  const input = readFileSync(inputFile, 'utf8');
  console.log(`📖 Input-Datei gelesen: ${inputFile} (${input.length} Zeichen)`);
  
  // Einfache Minimierung (Whitespace entfernen, Kommentare behalten)
  const minified = input
    .replace(/\s+/g, ' ')           // Mehrfache Whitespaces zu einem
    .replace(/\s*{\s*/g, '{')       // Leerzeichen um Klammern entfernen
    .replace(/\s*}\s*/g, '}')       // Leerzeichen um Klammern entfernen
    .replace(/\s*;\s*/g, ';')       // Leerzeichen um Semikolons entfernen
    .replace(/\s*,\s*/g, ',')       // Leerzeichen um Kommas entfernen
    .replace(/\s*=\s*/g, '=')       // Leerzeichen um Gleichheitszeichen entfernen
    .replace(/\s*\(\s*/g, '(')      // Leerzeichen um Klammern entfernen
    .replace(/\s*\)\s*/g, ')')      // Leerzeichen um Klammern entfernen
    .trim();                         // Anfang/Ende Whitespace entfernen
  
  console.log(`✂️  Minimiert: ${minified.length} Zeichen (${Math.round((1 - minified.length / input.length) * 100)}% kleiner)`);
  
  // dist-Verzeichnis erstellen
  const outputDir = 'dist';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Verzeichnis erstellt: ${outputDir}`);
  }
  
  // Output-Datei schreiben
  const outputFile = `${outputDir}/card-expandable.min.js`;
  writeFileSync(outputFile, minified, 'utf8');
  
  console.log(`✅ Build erfolgreich!`);
  console.log(`📁 Output: ${outputFile}`);
  console.log(`📊 Größe: ${(minified.length / 1024).toFixed(1)} KB`);
  
} catch (error) {
  console.error(`❌ Build fehlgeschlagen: ${error.message}`);
  process.exit(1);
}
