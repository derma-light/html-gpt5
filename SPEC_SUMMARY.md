SPEC_SUMMARY (Version 1.1 – 2025-08-20) + Changelog: Added Card Expandable Section v1.4.
Normative Regeln (MUSS / SOLL / DARF NICHT). Informative Hintergründe stehen in README_SPEC.md.

Ziele
GEN-01 Die Website MUSS primäres Ziel Terminbuchungen unterstützen (sichtbarer CTA im Above-the-Fold).
GEN-02 Sekundärziele (Vertrauen, Aufklärung, lokale Sichtbarkeit) DÜRFEN primäres Ziel nicht überlagern.
GEN-03 Jede Seite MUSS einen klaren primären Call To Action enthalten.

Informationsarchitektur
IA-01 Hauptnavigation MUSS folgende Top-Level-Punkte enthalten: Start, Leistungen, Preise, Infos, Über uns, Kontakt.
IA-02 Es DARF nur eine primäre Navigation geben (keine doppelten Menüleisten).
IA-03 Breadcrumb ist OPTIONAL; wenn eingeführt, MUSS nav[aria-label="Brotkrumen"] genutzt werden.
IA-04 Jede Seite MUSS genau ein main-Element besitzen.

Accessibility
A11Y-01 Es MUSS einen fokussierbaren Skip-Link geben (erstes interaktives Element im DOM, href="#main").
A11Y-02 Tastaturbedienung MUSS vollständig funktionieren (Tab-Reihenfolge logisch, kein Keyboard-Trap).
A11Y-03 Kontrast Body-Text MUSS >= 4.5:1, Überschriften >= 3:1 (empfohlen 4.5:1) sein.
A11Y-04 Nur ein h1 pro Seite.
A11Y-05 Interaktive Flächen MUSSEN :focus-visible klar anzeigen (Outline nicht entfernen ohne Ersatz).
A11Y-06 Keine verschachtelten interaktiven Elemente (z. B. Link im Link).
A11Y-07 aria-* Attribute DÜRFEN nicht ohne Semantik-Rechtfertigung gesetzt werden.
A11Y-08 Mobile Menü-Toggle MUSS aria-expanded korrekt pflegen.

Performance
PERF-01 LCP Ziel: < 2.5s (mobil realistisch).
PERF-02 Initiales JS (gesamt, gzip) SOLL < 60 KB bleiben.
PERF-03 CSS Critical Path SOLL inline <= 20 KB sein (falls später extrahiert).
PERF-04 Bilder MUSSEN mit width/height (oder aspect-ratio) Layout Shift verhindern.
PERF-05 Fonts: max 2 Familien, je max 2 Schnitte (Normal, Semibold/Bold); Preload falls notwendig.
PERF-06 Unbenutztes CSS SOLL < 30% (Coverage in DevTools).

SEO
SEO-01 Einzigartiger Seitentitel (title) MUSS vorhanden sein.
SEO-02 Meta description SOLL gesetzt werden (prägnant, keine Keyword-Stuffing).
SEO-03 Heading-Hierarchie MUSS logisch linear sein (keine Sprünge >1 Level).
SEO-04 Interne Links MUSSEN beschreibende Ankertexte haben (keine „Hier klicken“).
SEO-05 Canonical Tag SOLL pro Seite gesetzt werden.
SEO-06 URLs SOLLEN sprechend, kleingeschrieben, mit Bindestrichen sein.

Content
CNT-01 Keine übertriebenen Heilsversprechen; Ton: professionell, sachlich.
CNT-02 Primärer CTA Text SOLL handlungsorientiert sein („Termin vereinbaren“).
CNT-03 Leistungen-Beschreibungen MUSSEN klar, patientenverständlich und frei von Fachjargon-Überlast sein.

Design Tokens
TOK-01 Farben MUSSEN über CSS Custom Properties definiert werden (z. B. --color-bg, --color-text-high).
TOK-02 Spacing Tokens (z. B. --space-1 ... --space-8) MUSSEN konsistent verwendet werden (keine freien px außerhalb Utilities).
TOK-03 Radius Tokens (z. B. --radius-sm, --radius-md, --radius-lg) SOLLEN statt Rohwerten genutzt werden.
TOK-04 Transition-Dauer MUSS zentral als --transition-base vorliegen.
TOK-05 Dark Mode (optional) MUSS via data-theme="dark" schaltbar sein (keine separate Stylesheet-Duplizierung).

Code-Konventionen
CODE-01 HTML MUSS semantische Elemente bevorzugen (section, article nur mit sinnvoller Überschrift).
CODE-02 Klassenbenennung: block__element--modifier (BEM-light) ODER klar definierte Pattern – keine Vermischung.
CODE-03 Keine Inline-Styles außer technischen Ausnahmen (Critical inline CSS ausgenommen).
CODE-04 JS MUSS ohne Framework funktionieren (Vanilla, progressive enhancement).
CODE-05 Keine globalen JS Variablen (IIFE oder Modul-Scope).
CODE-06 Dateinamen kleingeschrieben, Trennung mit Bindestrich (z. B. site-header.css).

Git / Workflow
GIT-01 Branch Naming: feat/, fix/, chore/, docs/.
GIT-02 Commits im Imperativ (feat(cards): add base component).
GIT-03 PR MUSS Checkliste (QA) beinhalten (siehe QA-Sektion).
GIT-04 Kein Commit von ungenutzten Assets.

Komponenten (Mindestumfang Phase)
COMP-01 Header + Navigation MUSS Responsivität UND Skip-Link unterstützen.
COMP-02 Card-Komponente MUSS Basis + Link-Variante + Icon- und Media-Option ermöglichen.
COMP-03 Footer SOLL Kontakt/CTA enthalten.
COMP-04 Buttons (Primär, Sekundär) SOLLEN konsistent tokenisiert sein.
COMP-05 Formulare (Kontakt) MUSSEN label-gebunden und mit accessible Name versehen sein.
COMP-06 Keine doppelten CTAs innerhalb einer einzelnen Card-Variante (Ausnahme: klar unterscheidbare Aktionen).

Bilder / Media
IMG-01 Alle inhaltlichen Bilder MUSSEN sinnvolle alt-Texte haben.
IMG-02 Dekorative Bilder DÜRFEN alt="" haben.
IMG-03 Lazy Loading MUSS für unterhalb des Folds liegende Bilder eingesetzt werden (loading="lazy").
IMG-04 SVG Icons inline (currentColor) SOLLEN bevorzugt werden.
IMG-05 Aspect-Ratio MUSS für Card-Bilder gesetzt sein (z. B. 16/9).

QA / Testing
QA-01 Lighthouse Performance >= 85 (mobil).
QA-02 Lighthouse Accessibility >= 95.
QA-03 Keine offenen axe-Core Errors (Violations = 0).
QA-04 Console MUSS frei von Errors sein.
QA-05 Responsive Test bei 320px / 768px / 1024px / ≥1440px MUSS bestehen.
QA-06 Valid HTML (W3C Validator keine kritischen Errors).
QA-07 FOUC (Flash of Unstyled Content) SOLL minimiert sein (< 0.2s).

Roadmap (informativ)
Phase 1: Header, Startseite, Basis-Cards, Kontakt-CTA
Phase 2: Leistungsseiten, FAQ
Phase 3: Preise, Ratgeber/Blog
Phase 4: Dark Mode + Erweiterte Komponenten

[Komponenten Erweiterung]
COMP-07 Media-Variante (.card--media) MUSS ein figure.card__media vor dem Card-Body enthalten.
COMP-08 Media-Bild MUSS width und height Attribute besitzen oder via CSS aspect-ratio definieren; alt-Text gemäß IMG-01/02.
COMP-09 Icon-Variante (.card--icon) MUSS ein Wrapper-Element .card__icon mit inline-SVG enthalten; dekoratives Icon aria-hidden="true".
COMP-10 Varianten .card--media und .card--icon DÜRFEN nicht gleichzeitig auf derselben Card genutzt werden.

[Design Tokens Ergänzung]
TOK-06 Es SOLL mindestens eine zusätzliche Oberflächenfarbe (--color-surface-alt) existieren.
TOK-07 Icon-Größen MUSSEN über Tokens (--size-icon-sm, --size-icon-md) definiert werden.

[Bilder / Media Ergänzung]
IMG-06 Bilder innerhalb von Cards unterhalb des sichtbaren Bereichs SOLLEN loading="lazy" verwenden.

[Accessibility Ergänzung]
A11Y-09 Interne redundante Links (Bild + CTA zur selben Ziel-URL) DÜRFEN nicht entstehen – Bild wird nicht separat verlinkt, wenn CTA vorhanden.

[SEO Ergänzung]
SEO-07 figcaption DARF nur genutzt werden, wenn zusätzlicher, semantisch relevanter Mehrwert gegenüber alt-Text entsteht.

===== BEGIN DELTA (Card Expandable Spezifikation v1.4) =====
[Card – Varianten & Expandable Spezifikation v1.4]

CARD-01 Varianten (Additiv via Modifier-Klassen):
default (.card)
accent (.card--accent)
icon (.card--icon)
media (.card--media)
expandable (.card--expandable)
CARD-02 Verbot: .card--icon und .card--media DÜRFEN nicht gleichzeitig vorkommen.
CARD-03 Kombinationen: expandable DARF mit accent ODER icon ODER media kombiniert werden; icon+media bleibt einziges Verbot.
CARD-04 Eine Card MUSS höchstens eine primäre Navigations-/Handlungs-CTA besitzen; der Expand/Collapse-Button zählt NICHT als zweiter CTA.

[Expandable Markup Minimal]

<article class="card card--expandable" data-expandable> <h3 class="card__title"> <button id="card-toggle-1" class="card__toggle" aria-expanded="false" aria-controls="card-panel-1"> <span class="card__toggle-label">Titel</span> <svg class="card__chevron" aria-hidden="true" focusable="false"><!-- icon --></svg> </button> </h3> <div id="card-panel-1" class="card__content" role="region" aria-labelledby="card-toggle-1" aria-hidden="true"> <!-- Collapsible Inhalt --> </div> </article>
[Zustand / Verhalten]
CARD-05 Quelle der Wahrheit: aria-expanded am Button (true|false).
CARD-06 Panel MUSS aria-hidden spiegeln: aria-expanded=false → aria-hidden=true; bei true → aria-hidden=false.
CARD-07 Offen-Zustand DARF Klasse .is-open (auf Root oder Panel) setzen (Empfehlung: auf Root .card--expandable.is-open).
CARD-08 Panel DARF NICHT display:none verwenden (Transitions sonst unmöglich / Screenreader-Probleme). Höhe-Animation über height / max-height oder content-visibility.
CARD-09 Chevron-Rotation: Rotation (z. B. transform: rotate(180deg)) MUSS an is-open geknüpft sein.

[Motion Tokens]
CARD-10 Folgende Tokens MUSS es geben (root scope):
--motion-duration-collapse: 200ms
--motion-duration-collapse-reduced: 0ms
--motion-ease-standard: cubic-bezier(0.4,0,0.2,1)
CARD-11 Transitions für Expand/Collapse SOLLEN ausschließlich diese Tokens verwenden.
CARD-12 Reduced Motion: @media (prefers-reduced-motion: reduce) MUSS die Dauer auf var(--motion-duration-collapse-reduced) setzen ODER transition entfernen.

[A11Y Spezifisch]
CARD-13 Panel MUSS role="region" + aria-labelledby=<toggle.id> haben.
CARD-14 Toggle MUSS tastaturfokussierbar (button) sein; keine div role=button.
CARD-15 Focus-Stil darf nicht entfernt werden; :focus-visible MUSS sichtbar sein.
CARD-16 Kein nested interactive: Kein Link im Button; Button enthält nur Inline Content (Text/Icon).
CARD-17 Dynamische Labels (optional):
data-label-open / data-label-closed DÜRFEN genutzt werden; dann MUSS ein <span class="card__toggle-dyn"> existieren, das per JS aktualisiert wird.
CARD-18 Screenreader: Inhalt wird nicht dupliziert angekündigt – keine redundante aria-live Region nötig.

[JS API]
CARD-19 window.CardExpandable MUSS folgende Methoden bereitstellen:
init(root=document): Initialisiert alle [data-expandable]
expand(id|el)
collapse(id|el)
toggle(id|el)
CARD-20 Events (CustomEvent auf Card-Root):
card:expand-start, card:expand-end
card:collapse-start, card:collapse-end
CARD-21 Methoden DARFEN Promise zurückgeben (optional) – Spezifikation erzwingt es nicht.
CARD-22 Fehlerfälle (ungültiger Selector) SOLLEN stille No-Op liefern (kein Throw im Produktivcode).

[Druck / Print]
CARD-23 @media print: Alle Panels MUSSEN sichtbar sein (height:auto; overflow:visible; aria-hidden=false erzwingen via JS Pre-Print optional).

[CSS Mindestregeln]
CARD-24 .card__content MUSS eine Transition auf height oder max-height definieren (height bevorzugt wenn vorher genau berechenbar).
CARD-25 Bei geschlossenem Zustand: overflow:hidden MUSS gesetzt sein, damit Inhalt abgeschnitten wird.
CARD-26 Keine harte Pixel-Angabe für Dauer in Komponenten-CSS – nur Tokens (siehe CARD-10).

[Fehlervermeidung / Anti-Patterns]
CARD-27 Kein dauerhafter Inline-Style zur Animation (style.height=...) im offenen Zustand – JS darf temporär messen, danach Klassen/Tokens nutzen.
CARD-28 Kein aria-expanded auf Panel; nur auf Toggle.
CARD-29 Keine doppelte ID card-toggle-*; IDs MÜSSEN eindeutig sein.

===== END DELTA =====