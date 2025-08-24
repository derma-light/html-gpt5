/**
 * Card Expandable Component - Modular Version
 * Progressive enhancement for collapsible card content
 * Compliant with SPEC v1.1 Card Expandable v1.4
 */

(function() {
  'use strict';

  // Motion tokens - cached for performance
  let motionDurationCache = null;
  let motionDurationMsCache = null;
  
  const getMotionDuration = () => {
    if (motionDurationCache === null) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const root = document.documentElement;
      
      if (prefersReducedMotion) {
        motionDurationCache = getComputedStyle(root).getPropertyValue('--motion-duration-collapse-reduced') || '0ms';
      } else {
        motionDurationCache = getComputedStyle(root).getPropertyValue('--motion-duration-collapse') || '200ms';
      }
    }
    return motionDurationCache;
  };

  // Convert CSS duration to milliseconds - cached
  const getDurationMs = () => {
    if (motionDurationMsCache === null) {
      const duration = getMotionDuration();
      motionDurationMsCache = parseInt(duration) || 200;
    }
    return motionDurationMsCache;
  };

  // Track expandable cards
  const expandableCards = new Map();
  
  // Print state management
let originalPrintStates = new Map();
let userInteractedDuringPrint = false;

// Debug configuration (can be overridden globally)
window.CardExpandableDebug = window.CardExpandableDebug || {
  logging: false, // Set to true for development
  printEvents: false // Set to true to log print events
};

// Centralized logger function
const DEBUG = window.CardExpandableDebug.logging;
function log(...args) { 
  if (DEBUG) console.debug('[card-expandable]', ...args); 
}

function logPrint(...args) { 
  if (window.CardExpandableDebug.printEvents) console.debug('[card-expandable]', ...args); 
}

  /**
   * Initialize expandable cards
   * @param {Document|Element} root - Root element to search within (default: document)
   * @param {Object} options - Configuration options
   * @param {boolean} options.enableExclusiveGroups - Enable accordion behavior (default: false)
   */
  function init(root = document, options = {}) {
    const { enableExclusiveGroups = false } = options;
    
    // Store accordion setting globally
    window.CardExpandableConfig = { enableExclusiveGroups };
    // Prevent multiple initialization of the same cards (idempotent)
    const cards = (root === document ? document : root).querySelectorAll('.card--expandable[data-expandable]');
    
    cards.forEach((card, index) => {
      // Skip if already initialized
      if (expandableCards.has(card)) return;
      
      const toggle = card.querySelector('.card__toggle');
      const panel = card.querySelector('.card__content');
      
      if (!toggle || !panel) return;

      // Generate unique IDs if missing (CARD-29)
      const toggleId = toggle.id || `card-toggle-${Date.now()}-${index}`;
      const panelId = panel.id || `card-panel-${Date.now()}-${index}`;
      
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
      
      // Track user interactions during print
      toggle.addEventListener('click', () => { userInteractedDuringPrint = true; });
      toggle.addEventListener('keydown', () => { userInteractedDuringPrint = true; });
    });

    // Initialize accordion group navigation
    initAccordionGroups(root);
  }

  /**
   * Toggle card expand/collapse
   * @param {string|Element} card - Card selector, ID, or element
   * @returns {Promise} Resolves when transition completes
   */
  function toggle(card) {
    const cardElement = resolveCard(card);
    if (!cardElement) return Promise.resolve();

    const cardData = expandableCards.get(cardElement);
    if (!cardData) return Promise.resolve();

    if (cardData.isOpen) {
      return collapse(cardElement);
    } else {
      return expand(cardElement);
    }
  }

  /**
   * Expand card with animation
   * @param {string|Element} card - Card selector, ID, or element
   * @returns {Promise} Resolves when expand transition completes
   */
  function expand(card) {
    const cardElement = resolveCard(card);
    if (!cardElement) return Promise.resolve();

    const cardData = expandableCards.get(cardElement);
    if (!cardData || cardData.isOpen) return Promise.resolve();

    const { toggle, panel } = cardData;

    // Check if accordion behavior is enabled
    const accordionEnabled = window.CardExpandableConfig?.enableExclusiveGroups;
    const accordionGroup = cardElement.closest('[data-accordion-group]');
    
    // Close other cards in same accordion group if enabled
    if (accordionEnabled && accordionGroup) {
      const otherCards = Array.from(accordionGroup.querySelectorAll('.card--expandable[data-expandable]'))
        .filter(otherCard => otherCard !== cardElement && expandableCards.get(otherCard)?.isOpen);
      
      if (otherCards.length > 0) {
        log('Akkordeon: Schließe andere Cards in Gruppe:', otherCards.length);
        
        // Close other cards first (don't wait for their completion)
        otherCards.forEach(otherCard => {
          const otherCardData = expandableCards.get(otherCard);
          if (otherCardData && otherCardData.isOpen) {
            // Close without animation for accordion behavior
            const { toggle: otherToggle, panel: otherPanel } = otherCardData;
            
            // Force close immediately (events are dispatched by forceCloseImmediate)
            forceCloseImmediate(otherCard, otherToggle, otherPanel, otherCardData, false);
          }
        });
      }
    }

    // Dispatch expand start event
    dispatchEvent('card:expand-start', { card: cardElement, panel, toggle });

    // Measure content height once
    const targetHeight = panel.scrollHeight;
    
    // Set initial state
    panel.style.height = '0px';
    panel.style.visibility = 'visible';
    panel.style.pointerEvents = 'auto';
    
    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(() => {
      // Force reflow only once
      panel.offsetHeight;
      
      // Animate to target height
      panel.style.height = `${targetHeight}px`;
    });
    
    // Update ARIA and classes
    toggle.setAttribute('aria-expanded', 'true');
    cardElement.classList.add('is-open');
    panel.removeAttribute('aria-hidden');
    
    // Update dynamic labels
    updateDynamicLabels(toggle, true);
    
    // Set card as open
    cardData.isOpen = true;

    // Return promise that resolves when animation completes
    return new Promise((resolve) => {
      setTimeout(() => {
        panel.style.height = 'auto';
        dispatchEvent('card:expand-end', { card: cardElement, panel, toggle });
        resolve();
      }, getDurationMs());
    });
  }

  /**
   * Collapse card with animation
   * @param {string|Element} card - Card selector, ID, or element
   * @param {boolean} animate - Whether to animate the collapse
   * @returns {Promise} Resolves when collapse transition completes
   */
  function collapse(card, animate = true) {
    const cardElement = resolveCard(card);
    if (!cardElement) return Promise.resolve();

    const cardData = expandableCards.get(cardElement);
    if (!cardData || !cardData.isOpen) return Promise.resolve();

    const { toggle, panel } = cardData;

    // Dispatch collapse start event
    dispatchEvent('card:collapse-start', { card: cardElement, panel, toggle });

    return new Promise((resolve) => {
      if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              // Measure current height once
      const currentHeight = panel.scrollHeight;
      
      // Set explicit height for animation
      panel.style.height = `${currentHeight}px`;
      
      // Use requestAnimationFrame for smooth animation
      requestAnimationFrame(() => {
        // Force reflow only once
        panel.offsetHeight;
        
        // Animate to 0
        panel.style.height = '0px';
      });
        
        // Update ARIA and classes after animation
        setTimeout(() => {
          panel.style.visibility = 'hidden';
          panel.style.pointerEvents = 'none';
          panel.setAttribute('aria-hidden', 'true');
          toggle.setAttribute('aria-expanded', 'false');
          cardElement.classList.remove('is-open');
          
          // Update dynamic labels
          updateDynamicLabels(toggle, false);
          
          // Set card as closed
          cardData.isOpen = false;
          
          dispatchEvent('card:collapse-end', { card: cardElement, panel, toggle });
          resolve();
        }, getDurationMs());
      } else {
        // Immediate collapse (no animation)
        forceCloseImmediate(cardElement, toggle, panel, cardData);
        
        dispatchEvent('card:collapse-end', { card: cardElement, panel, toggle });
        resolve();
      }
    });
  }

  /**
   * Resolve card reference (string, ID, or element)
   * @param {string|Element} card - Card reference
   * @returns {Element|null} Card element or null if not found
   */
  function resolveCard(card) {
    if (!card) return null;
    
    if (typeof card === 'string') {
      // Handle ID selector (with or without #) - most efficient
      if (card.startsWith('#')) {
        return document.getElementById(card.slice(1));
      }
      // Handle ID without # (CARD-22: ID ohne '#' akzeptieren)
      if (/^[a-zA-Z][\w-]*$/.test(card)) {
        return document.getElementById(card);
      }
      // Handle class selector - least efficient, use sparingly
      return document.querySelector(card);
    }
    
    // Handle DOM element
    if (card instanceof Element) {
      return card;
    }
    
    return null;
  }

  /**
   * Force close card immediately without animation
   * @param {Element} card - Card element
   * @param {Element} toggle - Toggle button element
   * @param {Element} panel - Panel element
   * @param {Object} cardData - Card data object
   * @param {boolean} skipEvents - Skip event dispatching (for internal use)
   */
  function forceCloseImmediate(card, toggle, panel, cardData, skipEvents = false) {
    // Dispatch collapse start event (unless skipped)
    if (!skipEvents) {
      dispatchEvent('card:collapse-start', { 
        card, 
        panel, 
        toggle,
        immediate: true // Flag for immediate collapse
      });
    }
    
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
    
    // Focus management: Move focus to toggle if it was inside panel
    // Use microtask to ensure DOM updates are complete
    Promise.resolve().then(() => {
      if (document.activeElement && panel.contains(document.activeElement)) {
        toggle.focus();
      }
    });
    
    // Dispatch collapse end event (unless skipped)
    if (!skipEvents) {
      dispatchEvent('card:collapse-end', { 
        card, 
        panel, 
        toggle,
        immediate: true // Flag for immediate collapse
      });
    }
  }

  /**
   * Update dynamic labels if present
   * @param {Element} toggle - Toggle button element
   * @param {boolean} isOpen - Whether card is open
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
   * @param {KeyboardEvent} event - Keydown event
   * @param {Element} card - Card element
   */
  function handleKeydown(event, card) {
    const { key } = event;
    
    // Enter and Space toggle the card
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      toggle(card);
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
   * @param {Document|Element} root - Root element
   */
  function initAccordionGroups(root) {
    const groups = (root === document ? document : root).querySelectorAll('[data-accordion-group]');
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
   * @param {string} type - Event type
   * @param {Object} detail - Event detail
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
   * Handle print events
   */
  function handlePrint() {
    logPrint('beforeprint: Speichere ursprüngliche Zustände und öffne alle Panels');
    
    // Reset interaction flag
    userInteractedDuringPrint = false;
    
    // Store original states and open all panels
    expandableCards.forEach((cardData, card) => {
      const { panel, isOpen } = cardData;
      
      // Store original state
      originalPrintStates.set(card, {
        isOpen,
        height: panel.style.height,
        visibility: panel.style.visibility,
        pointerEvents: panel.style.pointerEvents,
        ariaHidden: panel.getAttribute('aria-hidden')
      });
      
      // Open panel if closed
      if (!isOpen) {
        panel.style.height = 'auto';
        panel.style.visibility = 'visible';
        panel.style.pointerEvents = 'auto';
        panel.removeAttribute('aria-hidden');
      }
    });
  }

  /**
   * Restore original states after print
   */
  function handleAfterPrint() {
    logPrint('afterprint: Benutzer interagiert:', userInteractedDuringPrint);
    
    // Don't restore if user interacted during print
    if (userInteractedDuringPrint) {
      logPrint('afterprint: Benutzer hat interagiert - Zustände bleiben unverändert');
      return;
    }
    
    logPrint('afterprint: Stelle ursprüngliche Zustände wieder her');
    
    try {
      // Restore original states
      expandableCards.forEach((cardData, card) => {
        const originalState = originalPrintStates.get(card);
        if (!originalState) return;
        
        const { panel } = cardData;
        const { isOpen, height, visibility, pointerEvents, ariaHidden } = originalState;
        
        // Only restore if state actually changed
        if (cardData.isOpen !== isOpen) {
          if (isOpen) {
            // Card was originally open - expand it
            expand(card);
          } else {
            // Card was originally closed - collapse it
            collapse(card, false); // No animation for print restore
          }
        } else {
          // Restore style properties directly
          panel.style.height = height;
          panel.style.visibility = visibility;
          panel.style.pointerEvents = pointerEvents;
          if (ariaHidden) {
            panel.setAttribute('aria-hidden', ariaHidden);
          } else {
            panel.removeAttribute('aria-hidden');
          }
        }
      });
    } finally {
      // Always clear stored states, even if restore fails
      // Prevents race conditions and memory leaks
      originalPrintStates.clear();
    }
  }

  // Public API - exactly as specified in CARD-19
  window.CardExpandable = {
    init,
    expand,
    collapse,
    toggle,
    // Configuration
    config: window.CardExpandableConfig || { enableExclusiveGroups: false }
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Set JS class for progressive enhancement
      document.documentElement.classList.replace('no-js', 'js');
      init(); // Default: accordion disabled
    });
  } else {
    // Set JS class for progressive enhancement
    document.documentElement.classList.replace('no-js', 'js');
    init(); // Default: accordion disabled
  }

  // Add print event listeners
  window.addEventListener('beforeprint', handlePrint);
  window.addEventListener('afterprint', handleAfterPrint);

})();
