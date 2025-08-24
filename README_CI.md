# CI Tests für Card-Expandable Komponente

Dieses Verzeichnis enthält automatisierte Tests für die Card-Expandable Komponente, die in CI/CD-Pipelines ausgeführt werden können.

## Installation

```bash
npm install
```

## Verwendung

### Lokaler Test
```bash
npm test
```

### CI/CD Pipeline
```bash
npm run test:ci
```

## Tests

Die CI-Tests prüfen:

1. **HTML laden** - Demo-Seite erfolgreich laden
2. **Accessibility Scan** - axe-core Compliance-Check
3. **JavaScript API** - CardExpandable global verfügbar
4. **Toggle-Funktionalität** - Expand/Collapse funktioniert
5. **Bundle-Größen** - JS/CSS Dateien laden
6. **Print-Events** - beforeprint/afterprint Simulation

## Anforderungen

- Node.js >= 16.0.0
- Puppeteer (Headless Chrome)
- axe-core (Accessibility Testing)

## CI Integration

### GitHub Actions
```yaml
- name: Run Card-Expandable Tests
  run: |
    cd card-expandable
    npm install
    npm run test:ci
```

### GitLab CI
```yaml
test_card_expandable:
  script:
    - cd card-expandable
    - npm install
    - npm run test:ci
```

## Exit Codes

- **0**: Alle Tests bestanden
- **1**: Mindestens ein Test fehlgeschlagen

## Troubleshooting

### Puppeteer Installation
Falls Puppeteer Probleme macht:
```bash
npm install puppeteer --unsafe-perm=true
```

### Headless Mode
Für Debugging kann Headless deaktiviert werden:
```javascript
const browser = await puppeteer.launch({
  headless: false, // Für Debugging
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```
