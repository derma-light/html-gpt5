#!/usr/bin/env node

/**
 * CI Smoke Test für Card-Expandable Komponente
 * 
 * Verwendung:
 * npm install puppeteer axe-core
 * node test-ci.js
 */

const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

// Optional: Lighthouse für Performance + Accessibility Budget
let lighthouse = null;
try {
  lighthouse = require('lighthouse');
} catch (e) {
  console.log('ℹ️ Lighthouse nicht verfügbar - Performance-Tests übersprungen');
}

async function runCITests() {
  console.log('🚀 Starte CI Smoke Tests für Card-Expandable...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Test 1: HTML laden und prüfen
    console.log('📄 Test 1: HTML laden...');
    await page.goto('file://' + __dirname + '/demo-cards.html');
    await page.waitForSelector('.card--expandable');
    
    // Test 1.5: Reduced Motion emulieren
    console.log('🎭 Test 1.5: Reduced Motion emulieren...');
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' }
    ]);
    
    // Test 2: Accessibility Scan
    console.log('♿ Test 2: Accessibility Scan...');
    const results = await new AxePuppeteer(page).analyze();
    
    console.log(`   - Violations: ${results.violations.length}`);
    console.log(`   - Passes: ${results.passes.length}`);
    console.log(`   - Incomplete: ${results.incomplete.length}`);
    
    if (results.violations.length > 0) {
      console.log('❌ Accessibility Violations gefunden:');
      results.violations.forEach(v => {
        console.log(`   - ${v.impact}: ${v.description}`);
      });
    } else {
      console.log('✅ Keine Accessibility Violations');
    }
    
    // Test 3: JavaScript Funktionalität
    console.log('⚡ Test 3: JavaScript Funktionalität...');
    
    // Prüfe ob CardExpandable API verfügbar
    const apiAvailable = await page.evaluate(() => {
      return typeof window.CardExpandable !== 'undefined';
    });
    
    if (apiAvailable) {
      console.log('✅ CardExpandable API verfügbar');
    } else {
      console.log('❌ CardExpandable API nicht verfügbar');
    }
    
    // Test 4: Toggle-Funktionalität
    console.log('🔄 Test 4: Toggle-Funktionalität...');
    
    const toggleResult = await page.evaluate(() => {
      const card = document.querySelector('.card--expandable');
      const toggle = card.querySelector('.card__toggle');
      const panel = card.querySelector('.card__content');
      
      // Initial state
      const initialExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const initialHidden = panel.getAttribute('aria-hidden') === 'true';
      
      // Toggle
      toggle.click();
      
      // Wait for animation with timeout guard
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Toggle timeout after 5s'));
        }, 5000);
        
        setTimeout(() => {
          clearTimeout(timeout);
          const afterExpanded = toggle.getAttribute('aria-expanded') === 'true';
          const afterHidden = panel.getAttribute('aria-hidden') === 'true';
          
          resolve({
            initial: { expanded: initialExpanded, hidden: initialHidden },
            after: { expanded: afterExpanded, hidden: afterHidden },
            success: initialExpanded !== afterExpanded && initialHidden !== afterHidden
          });
        }, 250); // Warte auf Animation
      });
    });
    
    if (toggleResult.success) {
      console.log('✅ Toggle-Funktionalität funktioniert');
    } else {
      console.log('❌ Toggle-Funktionalität fehlgeschlagen');
    }
    
    // Test 5: Bundle-Größen prüfen
    console.log('📦 Test 5: Bundle-Größen...');
    
    const jsSize = await page.evaluate(() => {
      const script = document.querySelector('script[src*="card-expandable.js"]');
      if (script) {
        return fetch(script.src).then(r => r.text()).then(t => t.length);
      }
      return 0;
    });
    
    const cssSize = await page.evaluate(() => {
      const link = document.querySelector('link[href*="card-expandable.css"]');
      if (link) {
        return fetch(link.href).then(r => r.text()).then(t => t.length);
      }
      return 0;
    });
    
    console.log(`   - JS: ${(jsSize / 1024).toFixed(1)} KB`);
    console.log(`   - CSS: ${(cssSize / 1024).toFixed(1)} KB`);
    
    // Test 6: Print-Events simulieren
    console.log('🖨️ Test 6: Print-Events...');
    
    const printResult = await page.evaluate(() => {
      return new Promise(resolve => {
        const logs = [];
        const originalLog = console.log;
        
        console.log = (...args) => {
          logs.push(args.join(' '));
        };
        
        // Simuliere beforeprint
        window.dispatchEvent(new Event('beforeprint'));
        
        setTimeout(() => {
          // Simuliere afterprint
          window.dispatchEvent(new Event('afterprint'));
          
          setTimeout(() => {
            console.log = originalLog;
            resolve(logs.filter(log => log.includes('[card-expandable]')));
          }, 100);
        }, 100);
      });
    });
    
    if (printResult.length >= 2) {
      console.log('✅ Print-Events funktionieren');
    } else {
      console.log('❌ Print-Events fehlgeschlagen');
    }
    
    // Test 7: Lighthouse Light-Run (optional)
    if (lighthouse) {
      console.log('🚀 Test 7: Lighthouse Performance + Accessibility...');
      try {
        const { lhr } = await lighthouse(page.url(), {
          port: (new URL(browser.wsEndpoint())).port,
          output: 'json',
          onlyCategories: ['performance', 'accessibility']
        });
        
        console.log(`   - Performance Score: ${Math.round(lhr.categories.performance.score * 100)}`);
        console.log(`   - Accessibility Score: ${Math.round(lhr.categories.accessibility.score * 100)}`);
        
        // Budget-Checks
        const perfBudget = lhr.categories.performance.score >= 0.8; // ≥80%
        const a11yBudget = lhr.categories.accessibility.score >= 0.95; // ≥95%
        
        if (perfBudget && a11yBudget) {
          console.log('✅ Lighthouse Budgets erreicht');
        } else {
          console.log('⚠️ Lighthouse Budgets nicht erreicht');
        }
      } catch (lighthouseError) {
        console.log('⚠️ Lighthouse-Test fehlgeschlagen:', lighthouseError.message);
      }
    }
    
    // Zusammenfassung
    console.log('\n📊 CI Test Zusammenfassung:');
    console.log(`   - Accessibility: ${results.violations.length === 0 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   - JavaScript API: ${apiAvailable ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   - Toggle: ${toggleResult.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   - Print Events: ${printResult.length >= 2 ? '✅ PASS' : '❌ FAIL'}`);
    
    const allPassed = results.violations.length === 0 && apiAvailable && toggleResult.success && printResult.length >= 2;
    
    if (allPassed) {
      console.log('\n🎉 Alle CI Tests bestanden!');
      process.exit(0);
    } else {
      console.log('\n💥 Einige CI Tests fehlgeschlagen!');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ CI Test Fehler:', error);
    
    // Artefakt-Upload bei Fehlern
    try {
      console.log('📸 Erstelle Screenshot für Debugging...');
      const screenshot = await page.screenshot({ 
        fullPage: true, 
        path: 'ci-error-screenshot.png' 
      });
      
      console.log('📄 Erstelle HTML Snapshot...');
      const htmlContent = await page.content();
      require('fs').writeFileSync('ci-error-snapshot.html', htmlContent);
      
      console.log('💾 Artefakte gespeichert: ci-error-screenshot.png, ci-error-snapshot.html');
    } catch (artefactError) {
      console.error('⚠️ Artefakt-Erstellung fehlgeschlagen:', artefactError.message);
    }
    
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Führe Tests aus
if (require.main === module) {
  runCITests().catch(console.error);
}

module.exports = { runCITests };
