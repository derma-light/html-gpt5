# Derma Light Hamburg – Master Spezifikation (Navigation, IA, Struktur, Technik)
Version: 1.0.0  
Status: Freigegeben Basis / Erweiterbar  
Letzte Aktualisierung: (bitte Datum einsetzen)

---
## 0. Zweck dieses Dokuments
Zentraler, stabiler Referenzrahmen für:
- Informationsarchitektur (IA) & Navigation
- Komponentenstruktur (Header, Footer, Breadcrumb, Anker-Navigation)
- Technische & SEO-Anforderungen
- Accessibility (A11y) Mindeststandards
- Performance-Richtlinien & Vorgehen
- Interne Prompt- und Umsetzungs-Workflows (für Cursor / gpt-5)
Dieses Dokument ist „Single Source of Truth“. Änderungen laufen über Changelog (Abschnitt 15).

---
## 1. Marken & Positionierung (Kurzprofil)
Name: Derma Light Hamburg  
Fokus: Dauerhafte Haarentfernung (Laser & IPL), hauttypgerechte Beratung  
Tonalität: Vertrauenswürdig, klar, sachlich-beruhigend – kein Over-Hype  
USP-Stichworte:
- Individuelle Haut- & Haartypanalyse
- Moderne Laser / IPL-Technologie (geringe Hautbelastung)
- Termine nach Vereinbarung (Flexibilität)
- Transparente Preislogik (wird ergänzt)
Trusted Elements (geplant): Vorher-Nachher (zulässig, falls rechtlich & medizinisch unkritisch), Kundenstimmen (verifizierbar)

---
## 2. Primäre Ziele (Web & UX)
1. Schnelle Terminbuchung (Conversion-Hauptziel)
2. Aufklärung (Unterschied Laser vs. IPL, Sicherheitsaspekte)
3. Vertrauen (Ergebnisse, Bewertungen, Technologie)
4. SEO-Sichtbarkeit (lokal „Hamburg Laser Haarentfernung“, informationaler Long-Tail)
5. Mobile Performance (Core Web Vitals)

KPIs (Später definieren):
- Conversion Rate Termin-CTA
- Scroll Depth Startseite (Sektion #ablauf / #preise)
- SERP Rankings (Laser Haarentfernung Hamburg etc.)
- LCP < 2.0s (mobil), CLS < 0.05, INP < 200ms

---
## 3. Informationsarchitektur (IA)
Ebene 1 (Hauptnavigation):
- Start (/)
- Leistungen (/leistungen/)
- Preise (/preise/)
- Infos (Gruppe; enthält FAQ, Technologie, Ergebnisse, Bewertungen, Ratgeber)
- Über uns (/ueber-uns/)
- Kontakt (/kontakt/)
- Termin (CTA) (/termin/)

Unter Leistungen:
- /leistungen/laser-haarentfernung/
- /leistungen/laser-haarentfernung/damen/
- /leistungen/laser-haarentfernung/herren/
- /leistungen/ipl-haarentfernung/
- /leistungen/hautberatung/

Unter „Infos“:
- /faq/
- /technologie/
- /ergebnisse/
- /bewertungen/
- Ratgeber (Blog /ratgeber/)
    - /ratgeber/haarzyklen/
    - /ratgeber/laser-vs-ipl/

Startseiten-In-Page-Anker (nur auf /): #vorteile #ablauf #preise #faq #kontakt

Breadcrumb-Hierarchie Beispiel (Laser Haarentfernung Damen):
Start > Leistungen > Laser Haarentfernung > Für Damen

---
## 4. URL / Slugs – Richtlinien
- Kleinbuchstaben, Bindestriche
- Keine Stoppwörter, außer Lesbarkeit nötig
- Keine Datumskomponenten in Evergreen-Artikeln
- Ratgeber-Artikel thematisch fokussiert (1 Keyword-Cluster/Seite)

---
## 5. Navigation & Interaktionsverhalten
Desktop:
- Hover + Klick (Klick fallback) für Level 2
- Fokus sichtbar bei Tastatur
Mobile:
- Off-Canvas rechts (transformX)
- Submenüs per Button (.sub-toggle) öffnen/schließen
- aria-expanded auf Buttons dynamisch setzen

Tastatur (Mindest-Interaktionen):
- TAB: lineare Reihenfolge
- ENTER/SPACE auf .sub-toggle: toggelt Menü
- ESC (optional v1.1): schließt aktives Sub

---
## 6. Komponenten (Definition & Zuständigkeit)
1. Header (header.html / header.css / nav.js)
   - Enthält Logo, Hauptnavigation, CTA Termin, Utility-Bar (Telefon / Mail)
2. Home Anchor Nav (nur Index; scroll-links)
3. Breadcrumb (breadcrumb.js)
   - Input: Array [{href?, label}]
   - Output: <nav aria-label="Brotkrumen"><ol>…</ol></nav>
4. Footer (footer.html)
   - Kontakte, Rechtliches, Social
5. JSON-LD Injektion (schema.js)
6. Vorteile-Sektion (#vorteile) – Content-Modul (später)
7. FAQ Block + Schema (später)
8. Preistabelle (später)
9. Service Feature Cards (später)
10. Review Carousel / Static List (später)

---
## 7. Design Tokens (Basis)
Farben (erweiterbar):
- --color-bg: #ffffff
- --color-text: #222222
- --color-muted: #6a6a6a
- --color-accent: #e7357a
- --color-accent-hover: #d02d6c
- --color-border: #e5e5e8
- --color-footer-bg: #111111
- Kontrast Check: Text auf Accent ≥ 4.5:1 (prüfen bei finalem Ton)

Typografie:
- Font Base: system-ui,-apple-system,Segoe UI,Roboto,sans-serif
- Base Font Size: 16px
- Scale (Clamp optional später)
  - h1: 2.0–2.4rem
  - h2: 1.6–1.9rem
  - h3: 1.3–1.5rem
  - Body: 1rem
  - Small: 0.85rem

Spacing:
- 4px Grid (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64)
Radius:
- 4px (Buttons)
Schatten (sparsam):
- nav-panel: 0 4px 18px -6px rgba(0,0,0,0.15)

Breakpoints:
- mobile-first
- --bp-nav: 960px
- Optionale weitere: 600px, 1280px (später)

Motion:
- Transition Standard: 0.25s ease
- prefers-reduced-motion: reduce → disable Übergänge

---
## 8. Accessibility (Mindestanforderungen v1)
- Semantische Landmarken: <header>, <nav>, <main>, <footer>
- aria-label auf Navigation und Breadcrumb
- Buttons statt Links für Menü-Toggler
- Fokus sichtbares Outline (nicht entfernen)
- Kontrast-Verhältnis Minimum:
  - Text vs Hintergrund: ≥ 4.5:1
  - Großer Text (≥ 24px oder 18.66px bold): ≥ 3:1
- Alt-Texte: Logo alt="Derma Light Hamburg Logo"
- Skip-Link (geplant v1.1): <a href="#main" class="skip-link">Zum Inhalt springen</a>
- Keine rein farbliche Bedeutungsübermittlung

Erweiterungen v1.1:
- ESC schließt aktives Menü
- ARIA-Rolle menubar vermeiden (einfach halten)
- Fokus-Falle im Off-Canvas (wenn offen)

---
## 9. SEO & Content Regeln
Headings:
- Genau ein h1 je Seite (Keyword + Marke optional)
- h2 für Hauptsektionen, h3 für Unterabschnitte

Interne Links:
- Header nicht überladen (>14 Links ok)
- Footer Deep Links (Leistungen, Preise etc.)
- Kontextuelle Links im Fließtext (1 pro ~120–150 Wörter sinnvoll)
Meta (später):
- Title: Hauptkeyword vorne (max 60 Zeichen)
- Description: Nutzenfirst (~150 Zeichen)
Schema.org:
- LocalBusiness + Service (bereits definiert)
- FAQPage (wenn Inhalte sichtbar identisch)
- BreadcrumbList (dynamisch)
- Review/AggregateRating erst nach echten Daten

Canonicals:
- Keine Duplicate Slugs
- Trailing Slash konsistent (beibehalten: /slug/)

404/Redirect:
- Saubere 301 bei Strukturänderungen

---
## 10. Performance Richtlinien (Zielwerte)
- Critical CSS (Above the Fold): ≤ 10 kB gzip inline
- Gesamt CSS vor Launch: < 70 kB (später Purge)
- JS Navigation + Schema + Breadcrumb: zusammen < 8 kB minified
- Bilder: WebP bevorzugt, hero ≤ 120 KB, Kompression ~80%
- Preload: logo.svg (wenn Render-block) optional
- Lazy Loading: Bilder unterhalb Fold loading="lazy"
- Fonts: Systemstack (kein externes Blocking-Font)
- HTTP Requests Initial ≤ 20

Messung:
- Lighthouse (Mobile): Performance > 90
- WebPageTest (3G Fast Emulation) LCP ≤ 2s
- CLS < 0.05, INP < 200ms

---
## 11. Sicherheits- & Qualitätsaspekte
- Externe Links: rel="noopener" ( + noreferrer bei Bedarf)
- Social Links: rel="me noopener"
- Keine Inline-Event-Handler (onclick etc.)
- CSP (später): default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline';

---
## 12. Dateistruktur (Basis)
/index.html  
/leistungen/ (Index + Detailseiten)  
/ratgeber/ (Artikel)  
/css/
  - base.css
  - header.css
  - footer.css
  - components/ (optional modulare Splits)
/js/
  - nav.js
  - breadcrumb.js
  - schema.js
  - utils/ (future: focus-trap.js)
/schema/
  - localbusiness.json
  - (future) faq.json
/img/
  - logo.svg
  - hero-social.(webp/svg)
README_SPECS.md (dieses Dokument)  

Build / Deploy (optional später):
- Statischer Export, optional Build Script für Minify

---
## 13. Prompt / Arbeits-Workflow (Cursor)
Grundform jedes Arbeits-Prompts:
1. Kontext: „Wir befinden uns in Schritt X von Task-Fahrplan.“
2. Aktueller Code (nur relevante Ausschnitte)
3. Ziel / Output-Format
4. Constraints (Keine neuen Frameworks / Dateistruktur beibehalten)
5. Qualitätskriterien (z. B. Lint-frei, < 4 kB JS)

Beispiel Kurzprompt:
```
Aufgabe: Ergänze ESC-Handling im nav.js, sodass Off-Canvas schließt. Kein anderes Verhalten ändern.
Aktueller Code nav.js (Ausschnitt): …
Output: kompletter aktualisierter nav.js
Constraints: Kein Framework, keine globale Variable hinzufügen, Dateiname unverändert.
```

---
## 14. Copy Guidelines (Kurz)
- Klar, kein Jargon ohne Erklärung (z. B. „Anagenphase (Wachstumsphase)“)
- Vermeidung von Superlativen ohne Beleg
- Nutzenorientiert: „Schonend & effizient – abgestimmt auf deinen Hauttyp“
- CTA Varianten testen (A/B):
  - „Termin vereinbaren“
  - „Kostenlose Beratung sichern“
  - „Jetzt Startpaket anfragen“

Microcopy Beispiele:
- Formular-Hinweis: „Wir melden uns i. d. R. innerhalb eines Werktages.“
- Preise: „Individuelle Kombinationen nach Beratung – transparente Paketpreise.“

---
## 15. Changelog (führen bei Änderungen)
- 1.0.0: Initiale Freigabe (Navigation, IA, Tokens, Performance-Richtlinien)
- (Geplante 1.1.0): ESC Handling, Skip-Link, Fokus-Falle, Vorteile-Section Inhalt
- (Geplante 1.2.0): FAQ + Schema, Preistabelle v1, Review-Block

---
## 16. Offene Punkte (Backlog)
- Vorteile-Section Text (Conversion & SEO)
- Preis-Zonen definieren (min / max / Beispiele)
- Review-Verifizierung (Quelle & Format)
- FAQ Sammlung (10 Kernfragen)
- Focus-Trap Off-Canvas
- Lazy Module für Ratgeber-Bilder
- Consent / Datenschutz-Banner (falls Tracking)

---
## 17. Erweiterungsplan (Roadmap Kurz)
Phase 1 (Live Minimal): Header, Footer, Start, 2 Leistungsseiten, Preise placeholder
Phase 2: FAQ + Vorteile + Preistabelle final
Phase 3: Ratgeber Cluster (2–4 Artikel), Schema-Fortschritt
Phase 4: Reviews, Performance Feintuning, A/B Test CTAs
Phase 5: Internationalisierung (falls Bedarf)

---
## 18. Do & Don’t (Schnellreferenz)
DO:
- Mobile First
- Konsistente Slugs
- Tokens nutzen statt Rohwerte
- Schrittweise Implementierung + Review

DON’T:
- Neue Menüpunkte ohne IA-Update
- Inline große Styles/JS (außer kritisches CSS)
- Platzhalter-Ratings ohne echte Daten
- Unnötige Libraries (kein jQuery etc.)

---
## 19. Qualitäts-Checkliste Pre-GoLive
Struktur:
- [ ] Alle Hauptseiten verlinkt
- [ ] Breadcrumb korrekt auf Unterseiten
- [ ] Anchors nur Startseite
SEO:
- [ ] Title + Meta Description individuell
- [ ] h1 eindeutig
- [ ] Schema validiert (Rich Results Test)
Performance:
- [ ] LCP < 2s (Mobil Test)
- [ ] CSS kritischer Pfad < 10 kB
- [ ] JS Nav < 4 kB
A11y:
- [ ] Tastatur-Navigation vollständig
- [ ] Fokus sichtbar
- [ ] Kontraste geprüft
Inhalte:
- [ ] Kein Blindtext
- [ ] Kontaktinfo korrekt & konsistent
Rechtskonform:
- [ ] Impressum + Datenschutz verlinkt
- [ ] Keine irreführenden Heilaussagen

---
## 20. Nächste Schritte Vorschlag
1. Commit dieses Dokuments (README_SPECS.md)
2. Implement Header + nav.js (Basis bereits vorhanden)
3. Vorteile-Content anfordern (Option B)
4. FAQ Sammlung (Option C)
5. Preis-Struktur (Option D)

Ende der Spezifikation.