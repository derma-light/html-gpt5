# Card Expandable Quick Reference (v1.0.0)

**Hinweis:** Vollständige Dokumentation siehe [README.md](./README.md)

## Übersicht

Modulare, WCAG AA-konforme Card-Expandable Komponente mit progressive Enhancement und No-JS Fallback.

**Status:** Produktionsreif, API eingefroren (SemVer aktiv)

## Dateien

- `css/card-expandable.css` - Styles für expandable Cards
- `js/card-expandable.js` - JavaScript-Funktionalität
- `demo-cards.html` - Demo mit allen Varianten

## Features

- **Modularisierung**: Separate CSS/JS-Dateien
- **Progressive Enhancement**: No-JS Fallback
- **Token-Konformität**: CSS Custom Properties
- **WCAG AA**: Vollständige Accessibility
- **Reduced Motion**: `prefers-reduced-motion: reduce`
- **Print Support**: Alle Panels beim Druck geöffnet

## Verwendung

### HTML Markup

```html
<article class="card card--expandable" data-expandable>
  <h3 class="card__title">
    <button class="card__toggle" aria-expanded="false" aria-controls="card-panel">
      <span class="card__toggle-label">Titel</span>
      <svg class="card__chevron" aria-hidden="true" focusable="false">
        <!-- chevron icon -->
      </svg>
    </button>
  </h3>
  <div class="card__content" role="region" aria-labelledby="card-toggle" aria-hidden="true">
    <!-- Collapsible Inhalt -->
  </div>
</article>
```

### CDN Einbindung

```html
<script src="https://unpkg.com/card-expandable@1.0.0/dist/card-expandable.min.js"
        integrity="sha384-W4mMfp2dgB4CsVrsEo+/Q1zfh7kYFlPIwbUqQ245StD3SkZ7X5TFqHilHaAo4WL9"
        crossorigin="anonymous"></script>
```

### Design Tokens

```json
{
  "motion": {
    "duration": {
      "collapse": "200ms",
      "collapse-reduced": "0ms"
    }
  },
  "spacing": {
    "space-2": "0.5rem",
    "space-3": "0.75rem", 
    "space-4": "1rem"
  }
}
```

**Vollständige Tokens siehe [README.md](./README.md)**

### JavaScript API

```javascript
// Initialisierung
window.CardExpandable.init();

// Mit Akkordeon-Verhalten
window.CardExpandable.init({ enableExclusiveGroups: true });

// Promise-basierte Methoden
await window.CardExpandable.expand('#card-1');
await window.CardExpandable.collapse('.card');
await window.CardExpandable.toggle('card-1');

// Events
document.addEventListener('card:expand-start', (e) => {
  console.log('Card wird geöffnet:', e.detail.card);
});
```

**Vollständige API-Dokumentation siehe [README.md](./README.md)**

## Quick Reference

### Events
- `card:expand-start` / `card:expand-end`
- `card:collapse-start` / `card:collapse-end`
- **Akkordeon**: Andere Cards schließen → eigene Card öffnen

### Accessibility
- **WCAG 2.4.3**: Focus Order (Fokus wandert bei Panel-Collapse)
- **WCAG 2.4.7**: Focus Visible
- **ARIA**: `aria-expanded`, `aria-hidden`, `role="region"`

### Performance
- **Bundle**: JS ~4.2 KB gzip, CSS ~1.8 KB gzip
- **Optimierungen**: rAF, minimierte Reflows, Token-Caching

### Testing
- **CI**: Puppeteer + axe-core + Lighthouse
- **Demo**: `demo-cards.html` mit Event-Logging
- **Debug**: `window.CardExpandableDebug` für Entwicklung

**Vollständige Dokumentation siehe [README.md](./README.md)**

