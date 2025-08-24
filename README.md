# Card Expandable (v1.0.0 – Stable)

Accessible, lightweight, race-safe expandable card / disclosure component with full keyboard & reduced-motion support.

Badges:
![npm version](https://img.shields.io/npm/v/card-expandable.svg)
![license](https://img.shields.io/npm/l/card-expandable.svg)

Status: Stable. API eingefroren ab 1.0.0 (SemVer). 0.9.0 war Pre-Release Soak.

## Installation

```bash
npm install card-expandable
```

## CDN / Direkt-Einbindung

Unpkg / jsDelivr Beispiel:

```html
<script src="https://unpkg.com/card-expandable@1.0.0/dist/card-expandable.min.js"
        integrity="sha384-W4mMfp2dgB4CsVrsEo+/Q1zfh7kYFlPIwbUqQ245StD3SkZ7X5TFqHilHaAo4WL9"
        crossorigin="anonymous"></script>
```

(Falls der Hash nach Neu-Build abweicht: README aktualisieren.)

## Features
- Promise-basierte API: expand(), collapse(), toggle()
- Dynamische Labels via data-label-open / data-label-closed
- Accordion Mode (enableExclusiveGroups)
- Print-Zustand Restore
- Reduced Motion Handling
- Stabiler Fokusfluss (WCAG 2.4.3) & sichtbarer Fokus (2.4.7)
- Race-safe Toggling / Timeout Guards
- Konsistentes Event System (inkl. immediate Varianten)

## Design Tokens
Export als JSON im README (siehe Tabelle) für Design-System-Tools.

## Quick Start

```html
<article class="card card--expandable" data-expandable>
  <h3 class="card__title">
    <button class="card__toggle" aria-expanded="false" aria-controls="card-panel">
      <span class="card__toggle-label">Card Title</span>
      <svg class="card__chevron" aria-hidden="true" focusable="false">
        <!-- chevron icon -->
      </svg>
    </button>
  </h3>
  <div class="card__content" role="region" aria-labelledby="card-toggle" aria-hidden="true">
    <!-- Collapsible content -->
  </div>
</article>
```

```javascript
import { CardExpandable } from 'card-expandable';

// Initialize
CardExpandable.init();

// Toggle card
const card = document.querySelector('[data-card]');
await CardExpandable.expand(card);
```

## Versionierung & Policy
SemVer aktiv. 1.0.0 = Freeze; Patch Fixes; Minor additive; Major Breaking.

## Sicherheit
Keine externen Laufzeit-Abhängigkeiten. Prüfe Integrity & Pin deine Version für maximale Reproduzierbarkeit.

## Browser Support
- Modern: Chrome 88+, Firefox 85+, Safari 14+
- Fallback: Progressive Enhancement für ältere Browser
- Mobile: Vollständige Touch-Unterstützung

## Accessibility
- WCAG 2.4.3 (Focus Order)
- WCAG 2.4.7 (Focus Visible)
- ARIA States & Properties
- Keyboard Navigation
- Screen Reader Support
- Reduced Motion

## Performance
- Bundle: JS ~4.2 KB gzip, CSS ~1.8 KB gzip
- requestAnimationFrame Optimierungen
- Minimierte Reflows
- Stabile Memory-Performance (50+ Iterationen)

## Testing
- CI Smoke Tests mit Puppeteer + axe-core
- Lighthouse Performance + Accessibility
- Progressive Enhancement Tests
- Print Event Simulation

## Support
Bitte Issues mit reproduzierbarem Beispiel (CodeSandbox / Minimal HTML) anlegen.

## Changelog
Siehe CHANGELOG.md für detaillierte Historie.

## SRI Verifikation
```bash
openssl dgst -sha384 -binary dist/card-expandable.min.js | openssl base64 -A
```
Vor den Base64-String "sha384-" setzen. Muss mit README/CHANGELOG übereinstimmen.

## Lizenz
MIT

