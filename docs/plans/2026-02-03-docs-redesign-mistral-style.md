# Kopexa Docs Redesign - Mistral-Style

**Datum:** 2026-02-03
**Branch:** `feature/docs-redesign-2025`
**Status:** Genehmigt

## Zusammenfassung

Redesign der Kopexa-Dokumentation mit Mistral-inspiriertem Design bei Beibehaltung der Kopexa-Markenfarben. Entfernung der Landing Page zugunsten eines direkten Docs-Einstiegs.

## Ziele

1. Modernes, cleanes Design inspiriert von docs.mistral.ai
2. Kopexa-Farbschema beibehalten (Blau-Töne)
3. Keine separate Landing Page - direkt zu Docs
4. Footer mit echten Kopexa-Links (wie kopexa.com/de)
5. Fumadocs als Framework beibehalten

## Design-Entscheidungen

### Navigation

**Top Bar:**
- Links: Kopexa Logo + "Docs"
- Mitte: Globale Suche (⌘K)
- Rechts: Language Toggle (DE/EN), Theme Toggle, "Zur App" Button
- Glasmorphism: `backdrop-blur` bei Scroll

**Sidebar:**
- Fumadocs DocsLayout Sidebar (angepasstes Styling)
- Collapsible Sections
- Hover-Animationen (200ms transitions)
- Mobile: Slide-in mit Backdrop

### Footer (basierend auf kopexa.com/de)

```
PLATTFORM          | KATALOG      | RESSOURCEN     | UNTERNEHMEN
Asset Management   | Übersicht    | Blog           | Impressum
Incident Mgmt      | ISO 27001    | Dokumentation  | Datenschutz
Lieferanten Mgmt   | TISAX        | Status         | Cookies
Richtlinien        | DSGVO        | Glossar        | Barrierefreiheit
Risk Management    | NIS2         | Lösungen       | Modern Slavery
                   | DORA         | Für Berater    | Security
                   |              |                | SLA

© 2026 Kopexa GmbH. All rights reserved.    [GitHub] [LinkedIn]
```

### Styling

**Farben:**
- Primary: Bestehendes Blau-Schema (oklch-Werte aus global.css)
- Light Mode: Weiße Hintergründe
- Dark Mode: Dunkelgrau/Schwarz

**Typografie:**
- Font: Inter (bereits vorhanden)
- Monospace: System-Font für Code

**Animationen:**
- Hover-Transitions: 200ms
- Backdrop-blur für Top Nav
- Subtile Fade-ins für Content

## Technische Umsetzung

### Zu erstellende Dateien

1. **`src/components/footer/index.tsx`** - Neuer Footer
2. **`src/components/footer/footer-schema.ts`** - Footer-Daten
3. **`src/components/footer/footer-column.tsx`** - Wiederverwendbare Spalte

### Zu ändernde Dateien

1. **`src/app/global.css`**
   - Neue CSS-Variablen für Animationen
   - Footer-Styling
   - Navbar-Glasmorphism

2. **`src/app/[lang]/(docs)/layout.tsx`**
   - LegalFooter durch neuen Footer ersetzen

3. **`src/app/[lang]/(home)/`**
   - Entfernen oder zu Redirect umbauen

4. **`src/lib/layout.shared.tsx`**
   - Nav-Konfiguration anpassen

5. **`next.config.mjs`**
   - Redirect `/` → `/de` oder `/de/platform`

6. **`src/lib/constants.ts`** (neu)
   - KOPEXA_URL, Social Links etc.

### Zu löschende Dateien/Ordner

- `src/app/[lang]/(home)/page.tsx` (falls vorhanden)
- `src/components/LegalFooter.tsx` (nach Migration)

## Implementierungsreihenfolge

### Phase 1: Basis-Setup
1. Constants-Datei erstellen
2. Footer-Schema definieren
3. Footer-Komponenten erstellen

### Phase 2: Layout-Änderungen
4. Footer in Docs-Layout einbinden
5. Home-Route zu Redirect umbauen
6. next.config.mjs Redirect hinzufügen

### Phase 3: Styling
7. global.css Animationen/Transitions
8. Navbar-Anpassungen (Glasmorphism)
9. Sidebar-Hover-States

### Phase 4: Cleanup & Test
10. Alte Komponenten entfernen
11. Build testen
12. Responsive testen

## Nicht im Scope

- Content-Änderungen
- Fumadocs-Core-Modifikationen
- i18n-Struktur-Änderungen
- API-Routes
- Dependency-Updates (separates Ticket)

## Risiken

- Fumadocs-CSS-Overrides könnten bei Updates brechen
- Footer-Links müssen mit Marketing abgestimmt sein

## Akzeptanzkriterien

- [ ] Build erfolgreich
- [ ] Keine TypeScript-Fehler
- [ ] Footer zeigt alle Kopexa-Links
- [ ] `/` redirected zu Docs
- [ ] Dark/Light Mode funktioniert
- [ ] Mobile-Responsive
- [ ] Animationen smooth (60fps)
