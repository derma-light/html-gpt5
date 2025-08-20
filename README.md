# Card Component Documentation

## Overview

The Card component provides a flexible, accessible foundation for displaying content in a structured format. It supports multiple variants and combinations for various use cases.

## Variants

### Base Card
The foundation card with title, description, and optional action link.

```html
<article class="card">
  <div class="card__content">
    <h3 class="card__title">Card Title</h3>
    <p class="card__description">Card description text.</p>
  </div>
  <footer class="card__footer">
    <a href="#action" class="card__action">Action Link</a>
  </footer>
</article>
```

### Media Card
Card with an image or media content.

```html
<article class="card card--media">
  <figure class="card__media">
    <img src="image.jpg" alt="Description" width="400" height="225" loading="lazy">
  </figure>
  <div class="card__content">
    <h3 class="card__title">Media Card Title</h3>
    <p class="card__description">Card description with media.</p>
  </div>
  <footer class="card__footer">
    <a href="#action" class="card__action">Action Link</a>
  </footer>
</article>
```

### Icon Card
Card with a decorative icon.

```html
<article class="card card--icon">
  <div class="card__icon" aria-hidden="true">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" focusable="false">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  </div>
  <div class="card__content">
    <h3 class="card__title">Icon Card Title</h3>
    <p class="card__description">Card description with icon.</p>
  </div>
  <footer class="card__footer">
    <a href="#action" class="card__action">Action Link</a>
  </footer>
</article>
```

### Accent Card
Card with visual highlighting using accent colors.

```html
<article class="card card--accent">
  <div class="card__content">
    <h3 class="card__title">Accent Card Title</h3>
    <p class="card__description">Card description with accent styling.</p>
  </div>
  <footer class="card__footer">
    <a href="#action" class="card__action">Action Link</a>
  </footer>
</article>
```

### Expandable Card
Card with collapsible content using progressive enhancement.

#### Basic Expandable Card
```html
<article class="card card--expandable" data-expandable>
  <h3 class="card__title">
    <button id="card-toggle-1" class="card__toggle" type="button"
      aria-expanded="false"
      aria-controls="card-panel-1">
      Expandable Title
      <svg class="card__chevron" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>
  </h3>
  <div id="card-panel-1" class="card__content" role="region" aria-labelledby="card-toggle-1">
    <p>Collapsible content that can be shown or hidden.</p>
  </div>
</article>
```

#### Expandable Card with Dynamic Labels
```html
<article class="card card--expandable" data-expandable>
  <h3 class="card__title">
    <button id="card-toggle-2" class="card__toggle" type="button"
      aria-expanded="false"
      aria-controls="card-panel-2"
      data-label-open="Weniger anzeigen"
      data-label-closed="Mehr anzeigen">
      <span class="card__toggle-text">Card Title</span>
      <span class="card__toggle-dyn">Mehr anzeigen</span>
      <svg class="card__chevron" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>
  </h3>
  <div id="card-panel-2" class="card__content" role="region" aria-labelledby="card-toggle-2">
    <p>Content with dynamic labels that change based on state.</p>
  </div>
</article>
```

#### Expandable Card with Accent and Icon
```html
<article class="card card--accent card--icon card--expandable" data-expandable>
  <div class="card__icon" aria-hidden="true">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" focusable="false">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  </div>
  <div class="card__body">
    <h3 class="card__title">
      <button id="card-toggle-3" class="card__toggle" type="button"
        aria-expanded="false"
        aria-controls="card-panel-3">
        <span class="card__toggle-text">Accent Icon Card</span>
        <svg class="card__chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
    </h3>
    <div id="card-panel-3" class="card__content" role="region" aria-labelledby="card-toggle-3">
      <p>Expandable content with accent styling and icon.</p>
    </div>
  </div>
</article>
```

#### Accordion Group
```html
<div data-accordion-group>
  <article class="card card--expandable" data-expandable>
    <!-- Card content -->
  </article>
  <article class="card card--expandable" data-expandable>
    <!-- Card content -->
  </article>
  <!-- More expandable cards -->
</div>
```

## Combination Rules

- `.card--media` and `.card--icon` cannot be used together
- `.card--accent` can be combined with exactly one variant: `.card--accent.card--media` OR `.card--accent.card--icon`
- `.card--expandable` can be combined with any other variant except both media and icon simultaneously

## JavaScript API

### Auto-initialization
The expandable cards are automatically initialized when the DOM is ready. Add the `data-expandable` attribute to enable functionality.

### Public Methods
```javascript
// Expand a specific card
window.CardExpandable.expand(cardElement);

// Collapse a specific card
window.CardExpandable.collapse(cardElement);

// Toggle a specific card
window.CardExpandable.toggle(cardElement);

// Re-initialize all expandable cards
window.CardExpandable.init();
```

### Custom Events
The component dispatches custom events for integration:

```javascript
document.addEventListener('card:expand-start', (e) => {
  console.log('Card expanding:', e.detail);
});

document.addEventListener('card:expand-end', (e) => {
  console.log('Card expanded:', e.detail);
});

document.addEventListener('card:collapse-start', (e) => {
  console.log('Card collapsing:', e.detail);
});

document.addEventListener('card:collapse-end', (e) => {
  console.log('Card collapsed:', e.detail);
});
```

Event detail includes: `{ card, panel, toggle }`

## Accessibility Features

### Keyboard Navigation
- **Enter/Space**: Toggle expandable cards
- **Arrow Keys**: Navigate between cards in accordion groups
- **Home/End**: Jump to first/last card in group

### ARIA Support
- `aria-expanded` on toggle buttons
- `aria-controls` linking toggle to panel
- `aria-labelledby` linking panel to toggle
- `role="region"` on content panels
- `aria-hidden` on collapsed panels

### Screen Reader Support
- Proper heading structure maintained
- Dynamic labels update for state changes
- Focus management prevents focus in hidden content

## Progressive Enhancement

Without JavaScript:
- Content remains visible
- Buttons have `aria-expanded="false"` but no collapsing behavior
- All content remains accessible and indexable

## Reduced Motion Support

The component respects `prefers-reduced-motion: reduce`:
- Height animations are disabled
- Chevron rotation is disabled
- Immediate state changes without transitions

## Print Styles

In print media:
- All expandable panels are automatically opened
- Chevron icons show "open" state
- Content is fully visible and accessible

## Usage Examples

### FAQ Section
```html
<section class="cards">
  <div class="container">
    <h2>Häufige Fragen</h2>
    <div class="cards__grid">
      <article class="card card--expandable" data-expandable>
        <h3 class="card__title">
          <button class="card__toggle" type="button" aria-expanded="false">
            Ist die Behandlung schmerzhaft?
            <svg class="card__chevron" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </h3>
        <div class="card__content" role="region">
          <p>Die Behandlung wird meist als leichtes Ziepen empfunden...</p>
        </div>
      </article>
    </div>
  </div>
</section>
```

### Service Cards with Expandable Details
```html
<section class="cards">
  <div class="container">
    <h2>Unsere Leistungen</h2>
    <div class="cards__grid">
      <article class="card card--accent card--expandable" data-expandable>
        <h3 class="card__title">
          <button class="card__toggle" type="button" aria-expanded="false"
            data-label-open="Details ausblenden"
            data-label-closed="Details anzeigen">
            <span class="card__toggle-text">Laser-Haarentfernung</span>
            <span class="card__toggle-dyn">Details anzeigen</span>
            <svg class="card__chevron" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </h3>
        <div class="card__content" role="region">
          <p>Detaillierte Informationen zur Laser-Behandlung...</p>
          <ul>
            <li>Dauer: 15-30 Minuten</li>
            <li>Sitzungen: 6-10 empfohlen</li>
            <li>Nachbehandlung: Kühlung</li>
          </ul>
        </div>
      </article>
    </div>
  </div>
</section>
```

## Testing Checklist

### Keyboard Testing
- [ ] Tab reaches toggle buttons
- [ ] Enter/Space toggles cards
- [ ] Arrow keys navigate in groups
- [ ] Home/End work in groups

### Screen Reader Testing
- [ ] NVDA/JAWS/VoiceOver announce expanded state
- [ ] Dynamic labels update correctly
- [ ] Focus doesn't land in hidden content

### Visual Testing
- [ ] Reduced motion disables animations
- [ ] Print shows all content expanded
- [ ] Accent/Icon combinations work correctly
- [ ] Focus indicators are visible

### Performance Testing
- [ ] No layout thrashing during animations
- [ ] Smooth height transitions
- [ ] No memory leaks with multiple cards

## Browser Support

- Modern browsers with ES6+ support
- Progressive enhancement for older browsers
- Graceful degradation without JavaScript
