/**
 * Event-Test Utility für Card Expandable Komponente
 * Loggt alle card:* Events mit detaillierten Metriken
 */

(function() {
  'use strict';

  // Performance-Messung
  const startTime = performance.now();
  
  // Event-Tracker
  const eventLog = [];
  
  // Event-Typen die wir überwachen
  const eventTypes = [
    'card:expand-start',
    'card:expand-end', 
    'card:collapse-start',
    'card:collapse-end'
  ];

  /**
   * Formatiert relative Zeit seit Start
   */
  function getRelativeTime() {
    const elapsed = performance.now() - startTime;
    return `${elapsed.toFixed(2)}ms`;
  }

  /**
   * Loggt Event mit detaillierten Informationen
   */
  function logEvent(event) {
    const { card, panel, toggle } = event.detail;
    const cardId = card.id || 'unknown';
    const toggleId = toggle.id || 'unknown';
    const ariaExpanded = toggle.getAttribute('aria-expanded');
    const ariaHidden = panel.getAttribute('aria-hidden');
    
    const logEntry = {
      time: getRelativeTime(),
      event: event.type,
      cardId,
      toggleId,
      ariaExpanded,
      ariaHidden,
      timestamp: new Date().toISOString()
    };
    
    eventLog.push(logEntry);
    
    // Console-Output
    console.group(`🎯 ${event.type} (${logEntry.time})`);
    console.log('Card ID:', cardId);
    console.log('Toggle ID:', toggleId);
    console.log('aria-expanded:', ariaExpanded);
    console.log('aria-hidden:', ariaHidden);
    console.log('Panel sichtbar:', panel.style.visibility !== 'hidden');
    console.groupEnd();
    
    // Event-Counter
    updateEventCounter();
  }

  /**
   * Aktualisiert Event-Counter in der UI
   */
  function updateEventCounter() {
    const counter = document.getElementById('event-counter');
    if (counter) {
      const counts = eventTypes.reduce((acc, type) => {
        acc[type] = eventLog.filter(e => e.event === type).length;
        return acc;
      }, {});
      
      counter.innerHTML = `
        <strong>Event-Counter:</strong><br>
        expand-start: ${counts['card:expand-start']}<br>
        expand-end: ${counts['card:expand-end']}<br>
        collapse-start: ${counts['card:collapse-start']}<br>
        collapse-end: ${counts['card:collapse-end']}<br>
        <strong>Gesamt: ${eventLog.length}</strong>
      `;
    }
  }

  /**
   * Exportiert Event-Log für Analyse
   */
  function exportEventLog() {
    console.group('📊 Event-Log Export');
    console.table(eventLog);
    console.log('JSON Export:', JSON.stringify(eventLog, null, 2));
    console.groupEnd();
    
    // Download als JSON
    const blob = new Blob([JSON.stringify(eventLog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `card-events-${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Führt Demo-Sequenz aus
   */
  function runDemoSequence() {
    console.log('🚀 Starte Demo-Sequenz: 1x Expand + 1x Collapse');
    
    const firstCard = document.querySelector('.card--expandable');
    if (!firstCard) {
      console.error('Keine expandable Card gefunden');
      return;
    }
    
    const toggle = firstCard.querySelector('.card__toggle');
    if (!toggle) {
      console.error('Toggle-Button nicht gefunden');
      return;
    }
    
    // Sequenz: Expand → Warten → Collapse
    setTimeout(() => {
      console.log('📤 Expandiere Card...');
      window.CardExpandable.expand(firstCard);
      
      setTimeout(() => {
        console.log('📥 Collapse Card...');
        window.CardExpandable.collapse(firstCard);
      }, 1000); // 1s warten
    }, 500); // 0.5s warten
  }

  /**
   * Initialisiert Event-Test-Utility
   */
  function init() {
    // Event-Listener für alle card:* Events
    eventTypes.forEach(eventType => {
      document.addEventListener(eventType, logEvent);
    });
    
    // UI-Elemente hinzufügen
    addTestUI();
    
    console.log('🎯 Event-Test Utility geladen');
    console.log('Verfügbare Funktionen:');
    console.log('- runDemoSequence(): Führt Demo aus');
    console.log('- exportEventLog(): Exportiert Event-Log');
    console.log('- window.EventTest: Globale API');
    
    // Globale API verfügbar machen
    window.EventTest = {
      runDemoSequence,
      exportEventLog,
      getEventLog: () => eventLog,
      getEventCounts: () => {
        return eventTypes.reduce((acc, type) => {
          acc[type] = eventLog.filter(e => e.event === type).length;
          return acc;
        }, {});
      }
    };
  }

  /**
   * Fügt Test-UI zur Demo hinzu
   */
  function addTestUI() {
    const testSection = document.createElement('section');
    testSection.className = 'demo-section';
    testSection.innerHTML = `
      <h2 class="demo-title">Event-Test Utility</h2>
      <div class="test-info">
        <div id="event-counter">
          <strong>Event-Counter:</strong><br>
          expand-start: 0<br>
          expand-end: 0<br>
          collapse-start: 0<br>
          collapse-end: 0<br>
          <strong>Gesamt: 0</strong>
        </div>
        <div style="margin-top: var(--space-3);">
          <button onclick="window.EventTest.runDemoSequence()" class="btn btn--primary">
            🚀 Demo-Sequenz starten
          </button>
          <button onclick="window.EventTest.exportEventLog()" class="btn btn--secondary" style="margin-left: var(--space-2);">
            📊 Event-Log exportieren
          </button>
        </div>
        <div style="margin-top: var(--space-3); font-size: var(--fs-small);">
          <strong>Anleitung:</strong> Klicken Sie auf "Demo-Sequenz starten" und beobachten Sie die Konsole. 
          Die Sequenz führt 1x Expand + 1x Collapse aus und loggt alle Events mit Metriken.
        </div>
      </div>
    `;
    
    // Nach dem ersten test-info Element einfügen
    const firstTestInfo = document.querySelector('.test-info');
    if (firstTestInfo && firstTestInfo.parentNode) {
      firstTestInfo.parentNode.insertBefore(testSection, firstTestInfo.nextSibling);
    }
  }

  // Auto-Initialisierung
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
