/**
 * Expandable Card Component
 * Progressive enhancement for collapsible card content
 */
(function() {
  'use strict';

  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionDuration = prefersReducedMotion ? 
    getComputedStyle(document.documentElement).getPropertyValue('--motion-duration-collapse-reduced') || '0ms' :
    getComputedStyle(document.documentElement).getPropertyValue('--motion-duration-collapse') || '200ms';

  // Convert CSS duration to milliseconds
  const durationMs = parseInt(motionDuration) || 200;

  // Track expandable cards
  const expandableCards = new Map();

  /**
   * Initialize expandable cards
   */
  function init() {
    const cards = document.querySelectorAll('.card--expandable[data-expandable]');
    
    cards.forEach((card, index) => {
      const toggle = card.querySelector('.card__toggle');
      const panel = card.querySelector('.card__content');
      
      if (!toggle || !panel) return;

      // Generate IDs if missing
      const toggleId = toggle.id || `card-toggle-${index + 1}`;
      const panelId = panel.id || `card-panel-${index + 1}`;
      
      toggle.id = toggleId;
      panel.id = panelId;
      toggle.setAttribute('aria-controls', panelId);
      panel.setAttribute('aria-labelledby', toggleId);
      panel.setAttribute('role', 'region');

      // Store card data
      expandableCards.set(card, {
        toggle,
        panel,
        isOpen: card.hasAttribute('data-expanded') || card.classList.contains('is-open')
      });

      // Set initial state
      if (!expandableCards.get(card).isOpen) {
        collapse(card, false); // No animation on init
      }

      // Add event listeners
      toggle.addEventListener('click', () => toggleCard(card));
      toggle.addEventListener('keydown', (e) => handleKeydown(e, card));
    });

    // Initialize accordion group navigation
    initAccordionGroups();
  }

  /**
   * Toggle card expand/collapse
   */
  function toggleCard(card) {
    const cardData = expandableCards.get(card);
    if (!cardData) return;

    if (cardData.isOpen) {
      collapse(card);
    } else {
      expand(card);
    }
  }

  /**
   * Expand card with animation
   */
  function expand(card) {
    const cardData = expandableCards.get(card);
    if (!cardData || cardData.isOpen) return;

    const { toggle, panel } = cardData;

    // Dispatch expand start event
    dispatchEvent('card:expand-start', { card, panel, toggle });

    // Measure content height
    const targetHeight = panel.scrollHeight;
    
    // Set initial state
    panel.style.height = '0px';
    panel.style.visibility = 'visible';
    panel.style.pointerEvents = 'auto';
    
    // Force reflow
    panel.offsetHeight;
    
    // Animate to target height
    panel.style.height = `${targetHeight}px`;
    
    // Update ARIA and classes
    toggle.setAttribute('aria-expanded', 'true');
    card.classList.add('is-open');
    panel.removeAttribute('aria-hidden');
    
    // Update dynamic labels
    updateDynamicLabels(toggle, true);
    
    // Set card as open
    cardData.isOpen = true;

    // Clean up after animation
    setTimeout(() => {
      panel.style.height = 'auto';
      dispatchEvent('card:expand-end', { card, panel, toggle });
    }, durationMs);
  }

  /**
   * Collapse card with animation
   */
  function collapse(card, animate = true) {
    const cardData = expandableCards.get(card);
    if (!cardData || !cardData.isOpen) return;

    const { toggle, panel } = cardData;

    // Dispatch collapse start event
    dispatchEvent('card:collapse-start', { card, panel, toggle });

    if (animate && !prefersReducedMotion) {
      // Measure current height
      const currentHeight = panel.scrollHeight;
      
      // Set explicit height for animation
      panel.style.height = `${currentHeight}px`;
      
      // Force reflow
      panel.offsetHeight;
      
      // Animate to 0
      panel.style.height = '0px';
      
      // Update ARIA and classes after animation
      setTimeout(() => {
        panel.style.visibility = 'hidden';
        panel.style.pointerEvents = 'none';
        panel.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        card.classList.remove('is-open');
        
        // Update dynamic labels
        updateDynamicLabels(toggle, false);
        
        // Set card as closed
        cardData.isOpen = false;
        
        dispatchEvent('card:collapse-end', { card, panel, toggle });
      }, durationMs);
    } else {
      // Immediate collapse (no animation)
      panel.style.height = '0px';
      panel.style.visibility = 'hidden';
      panel.style.pointerEvents = 'none';
      panel.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      card.classList.remove('is-open');
      
      // Update dynamic labels
      updateDynamicLabels(toggle, false);
      
      // Set card as closed
      cardData.isOpen = false;
      
      dispatchEvent('card:collapse-end', { card, panel, toggle });
    }
  }

  /**
   * Update dynamic labels if present
   */
  function updateDynamicLabels(toggle, isOpen) {
    const dynLabel = toggle.querySelector('.card__toggle-dyn');
    if (!dynLabel) return;

    const openLabel = toggle.getAttribute('data-label-open');
    const closedLabel = toggle.getAttribute('data-label-closed');
    
    if (openLabel && closedLabel) {
      dynLabel.textContent = isOpen ? openLabel : closedLabel;
    }
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeydown(event, card) {
    const { key } = event;
    
    // Enter and Space toggle the card
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      toggleCard(card);
      return;
    }

    // Arrow key navigation in accordion groups
    const group = card.closest('[data-accordion-group]');
    if (!group) return;

    const cards = Array.from(group.querySelectorAll('.card--expandable[data-expandable]'));
    const currentIndex = cards.indexOf(card);
    
    let nextCard = null;
    
    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        nextCard = cards[(currentIndex + 1) % cards.length];
        break;
      case 'ArrowUp':
        event.preventDefault();
        nextCard = cards[currentIndex === 0 ? cards.length - 1 : currentIndex - 1];
        break;
      case 'Home':
        event.preventDefault();
        nextCard = cards[0];
        break;
      case 'End':
        event.preventDefault();
        nextCard = cards[cards.length - 1];
        break;
    }
    
    if (nextCard) {
      const nextToggle = nextCard.querySelector('.card__toggle');
      if (nextToggle) {
        nextToggle.focus();
      }
    }
  }

  /**
   * Initialize accordion group navigation
   */
  function initAccordionGroups() {
    const groups = document.querySelectorAll('[data-accordion-group]');
    groups.forEach(group => {
      // Add keyboard event listener to group
      group.addEventListener('keydown', (e) => {
        const card = e.target.closest('.card--expandable[data-expandable]');
        if (card) {
          handleKeydown(e, card);
        }
      });
    });
  }

  /**
   * Dispatch custom events
   */
  function dispatchEvent(type, detail) {
    const event = new CustomEvent(type, {
      detail,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  /**
   * Public API
   */
  window.CardExpandable = {
    expand: (card) => expand(card),
    collapse: (card) => collapse(card),
    toggle: (card) => toggleCard(card),
    init
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
