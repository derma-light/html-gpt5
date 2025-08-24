# Sicherheitspolitik (SECURITY.md)

Dieses Dokument beschreibt, wie Sicherheitslücken für dieses Projekt verantwortungsvoll gemeldet und behandelt werden.

## Unterstützte Versionen

| Version | Status | Sicherheitspatches |
|---------|--------|--------------------|
| 1.0.x   | Stable | Ja (aktive Linie)  |
| < 1.0.0 | EOL    | Nein               |

Aktualisiere diese Tabelle bei neuen Minor-Releases (1.1.x, 1.2.x usw.).

## Scope (Sicherheitsrelevant)

In Scope:
- Ausnutzbare XSS / Injection durch öffentliche API
- Prototype Pollution / globale Side Effects
- Umgehung dokumentierter Sicherheitsmaßnahmen (z. B. Integrity / interne Guards)
- Manipulierte ausgelieferte Artefakte (Supply Chain)

Out of Scope (Beispiele):
- A11Y-Verbesserungen (Qualität, kein Security Impact)
- Performance / Optimierung
- Fehlkonfiguration durch Integratoren
- Alte Browser ohne Support
- Theoretische, nicht praktikable Timing-Angriffe

## Meldung einer Sicherheitslücke

Bitte KEIN öffentliches Issue.
1. E-Mail an: SECURITY_CONTACT_EMAIL
2. Betreff: [Security][NPM_PACKAGE_NAME] Kurzbeschreibung
3. Enthalten:
   - Beschreibung & Impact
   - Reproduktionsschritte / PoC
   - Betroffene Version(en) (npm Version, Commit Hash)
   - Umgebung / Plattform
   - Optional: Fix-Idee

Optional (PGP):
PGP Public Key / Fingerprint: PGP_FINGERPRINT_ODER_LINK

Alternative (falls E-Mail nicht möglich):
- GitHub Security Advisory Draft (privat)

## Prozess & Ziel-SLAs (unverbindlich)

| Phase | Ziel |
|-------|------|
| Empfangsbestätigung | ≤ 2 Werktage |
| Erste Einstufung | ≤ 5 Werktage |
| Fix (kritisch) | ≤ 14 Tage |
| Fix (mittel) | ≤ 30 Tage |
| Veröffentlichung Advisory | Mit Patch-Release |

## Offenlegung

- Coordinated Disclosure: Keine öffentlichen Details vor Fix & angemessener Upgrade-Frist.
- Veröffentlichung via CHANGELOG + (optional) GitHub Security Advisory.
- Nennung von Reportern nur mit ausdrücklicher Zustimmung.

## Schweregrad (Richtlinie)

| Level | Beispiele |
|-------|-----------|
| Kritisch | RCE, automatisches XSS ohne Nutzeraktion |
| Hoch | Leicht ausnutzbares XSS, Datenexfiltration |
| Mittel | Edge-Case Injection, Schutz-Bypass |
| Niedrig | Schwer ausnutzbar / spezielle Konfiguration |
| Informativ | Kein direkter Impact, Verbesserungshinweis |

## Patch-Strategie

- Backports nur für letzte Major-Version (SEMVER_MAJOR.x).
- Security Fixes als Patch Release (z. B. 1.0.1).
- Keine "stillen" Fixes – Ausnahme: sehr kurzfristige Koordination bis zur Veröffentlichung.

## Abhängigkeiten / Upstream

Falls Root Cause Upstream:
- Koordination mit Upstream Maintainer
- Verweis im Advisory

## Hinweise für Reporter (empfohlen)

Bitte bereitstellen:
- Minimaler reproduzierbarer Code / HTML
- Schritt-für-Schritt Ablauf
- Erwartet vs. Tatsächlich
- Browser / Node Version
- Screenshots / Console Output (falls relevant)

## Out-of-Scope Konkrete Beispiele

- CSP Fehlkonfiguration beim Integrator
- Nutzung unsicherer eval() Blöcke im Consumer-Code
- Alte Browserversionen ohne Support
- Rein theoretische Timing-Unterschiede ohne Exploit

## Responsible Credit

Auf Wunsch:
- Name / Alias / Link
Keine Veröffentlichung personenbezogener Daten ohne Freigabe.

## Kontakt

Primär: SECURITY_CONTACT_EMAIL  
Fallback: GitHub Security Advisory Draft (privat)

## Historie

- DATE_INIT: Initiale Version (für Release v1.0.0)

## Kanonische Quelle

Pfad: /SECURITY.md im Repository (Tag >= v1.0.0)
