# Scripts

## update-sri.mjs

Automatisches SRI Hash Update nach dem Build.

## post-publish-qa.mjs

Vollautomatische Post-Publish QA Checkliste für Release-Qualität.

### Verwendung

```bash
# Nach dem Publish ausführen
npm run qa

# Oder direkt
node scripts/post-publish-qa.mjs
```

### Was macht das Script?

1. **NPM Version Check** - Prüft ob v1.0.0 veröffentlicht wurde
2. **Frisches Testprojekt** - Erstellt temporäres Projekt und testet Installation
3. **CDN Verfügbarkeit** - Prüft ob die Datei über unpkg erreichbar ist
4. **SRI Hash Validierung** - Vergleicht Build-Hash mit README-Hash
5. **TODO Check** - Stellt sicher, dass keine offenen TODOs im Release sind
6. **Git Tag Check** - Prüft ob der v1.0.0 Tag existiert
7. **Bundle Size Check** - Validiert die Bundle-Größe (<10KB)

### Voraussetzungen

- Node.js 18+
- Veröffentlichtes Package auf NPM
- Git Repository mit Tag
- Build-Datei `dist/card-expandable.min.js`

## post-publish-qa.ps1

PowerShell-Version des QA Scripts für Windows.

### Verwendung

```bash
# Nach dem Build ausführen
npm run build
node scripts/update-sri.mjs

# Git diff prüfen
git diff

# Falls Änderungen vorhanden, committen
git add .
git commit -m "Update SRI hash for v1.0.0"
```

### Was macht das Script?

1. **Liest** die minifizierte Build-Datei `dist/card-expandable.min.js`
2. **Berechnet** den neuen SHA384 Hash
3. **Aktualisiert** alle SRI Hashes in:
   - `README.md`
   - `CHANGELOG.md` 
   - `README_CARD_EXPANDABLE.md`
4. **Zeigt** den aktuellen Hash an

### Voraussetzungen

- Node.js 18+
- Build-Datei `dist/card-expandable.min.js` muss existieren
- Markdown-Dateien müssen im Root-Verzeichnis liegen

### Fehlerbehandlung

- **Build-Datei fehlt**: Script bricht mit Hinweis ab
- **Markdown-Datei fehlt**: Wird übersprungen
- **Schreibfehler**: Werden geloggt, Script läuft weiter

### Integration in CI/CD

```bash
# In package.json scripts hinzufügen
"postbuild": "node scripts/update-sri.mjs"
```
