# Platform Documentation Rewrite — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Komplette Endnutzer-Doku der Kopexa-Plattform neu schreiben — deckungsgleich mit Frontend-Navi, gründlich gegen Backend-Schemas/Hooks/Worker verifiziert, in deutscher Sprache (du-Form, generisch).

**Architektur:** Drei-Stufen-Ausführung. Stufe 1 (Fundament) sequenziell, Stufe 2 (Module C2–C10) parallel via Subagents, Stufe 3 (Konsolidierung) sequenziell. Jeder Subagent bekommt das gleiche Briefing-Template + modul-spezifische Datenquellen. Quality-Gate verhindert lückenhafte Ergebnisse.

**Tech Stack:** MDX (Fumadocs), Mermaid für Diagramme, `kopexa/docs` als Zielrepo, Branch `docs/platform-rewrite`.

**Spec:** `docs/superpowers/specs/2026-06-01-platform-docs-rewrite-design.md`

---

## Vorbereitung

- Branch `docs/platform-rewrite` ist bereits angelegt und checked out (Commit `f054991`).
- Working directory für alle Tasks: `/Users/steffen/code/kopexa/docs`.
- Bestehende Inhalte unter `content/docs/platform/` werden komplett umstrukturiert. Alte Pfade werden verschoben oder gelöscht — siehe Stufe 3.

---

## Agent-Briefing-Template (für jedes Modul-Task identisch)

> **Briefing — du bist ein Subagent für ein einzelnes Modul.**
>
> **Modul:** `<MODUL>`
> **Zielort:** `content/docs/platform/space/<gruppe>/<modul>/index.mdx` (plus Unterseiten falls nötig)
>
> **Datenquellen (in dieser Reihenfolge durchgehen):**
> 1. **Frontend-Wording:** `/Users/steffen/code/kopexa/frontend/messages/de/<modul>.json` — kanonische deutsche Begriffe ziehen
> 2. **Frontend-Route(n):** `/Users/steffen/code/kopexa/frontend/src/app/(protected)/(space)/s/[spaceId]/(root)/<modul>/`
> 3. **Frontend-Modul:** `/Users/steffen/code/kopexa/frontend/src/modules/<modul>/` — Forms, Validierungs-Schemas, Page-Komponenten
> 4. **Backend-Schema:** `/Users/steffen/code/kopexa/backend/internal/store/schema/<entity>.go` — Pflichtfelder, Enums, Validatoren
> 5. **Backend-Hooks:** `/Users/steffen/code/kopexa/backend/internal/store/hooks/<entity>.go` — was automatisch passiert
> 6. **Backend-Worker:** `/Users/steffen/code/kopexa/backend/internal/river/jobs/<modul>*.go` — Hintergrundjobs
> 7. **Bestehende Doku:** `content/docs/platform/.../<modul>/` falls vorhanden — auf veraltete Aussagen prüfen, ggf. komplett neu schreiben
>
> **Modul-Template (verbindlich, in dieser Reihenfolge):**
> 1. Worum geht's (2–3 Sätze, nicht-technisch)
> 2. Wann nutzt du es (typische Anlässe)
> 3. Das Wichtigste in Kürze (3–5 Bullets)
> 4. Typischer Ablauf (Schritte + ein `<Mermaid>`-Diagramm)
> 5. Felder & Eingaben (Tabelle: Feld, Bedeutung, Pflicht/Optional, Validierungsregel, Tipp — nur kritische Felder)
> 6. Was im Hintergrund passiert (Automatisierungen in Klartext)
> 7. Verknüpfungen (verwandte Module mit Links)
> 8. Berechtigungen (View/Edit/Delete — wer darf was)
> 9. Best Practices (3–5 Empfehlungen)
> 10. Stolperfallen (was schiefgeht, wie vermeiden)
> 11. FAQ (3–5 Fragen)
>
> Abschnitte dürfen nur ausgelassen werden, wenn das im Modul **begründet** wird (z. B. "alle Rollen identisch berechtigt").
>
> **Sprach-Regeln:**
> - Deutsch, du-Form, generische Ansprache
> - "Überprüfung/überprüfen" statt "Review/reviewen" ("Reviewer" als Rolle ok)
> - **Keine em-dashes** (—) — stattdessen Komma, Doppelpunkt oder Punkt
> - **Keine Backend-Vokabeln:** kein "Schema", "Hook", "Worker", "Endpoint", "Mutation", "Query", "Entity". Stattdessen: "Eingabefeld", "automatischer Ablauf", "im Hintergrund", "wird geprüft"
> - Kurze Sätze, eine Idee pro Satz
>
> **MDX-Komponenten verfügbar:**
> `<Mermaid chart="..." />`, `<Callout>`, `<Steps>`, `<Tabs>`, `<Files>`, `<Accordions><Accordion>`, `<FeatureCards><FeatureCard>`
>
> **Quality-Gate (vor Commit prüfen):**
> - [ ] Alle 11 Template-Abschnitte ausgefüllt oder begründet ausgelassen
> - [ ] Frontend-Route gelesen
> - [ ] Backend-Schema verglichen (Pflichtfelder/Validierung stimmt)
> - [ ] Hooks/Worker auf Automatisierungen geprüft
> - [ ] Berechtigungen verifiziert
> - [ ] Bestehende `.mdx` (falls vorhanden) auf veraltete Aussagen geprüft
> - [ ] Mindestens ein `<Mermaid>`-Diagramm
> - [ ] Wording aus `messages/de/<modul>.json` übernommen
> - [ ] Keine Backend-Vokabeln, keine em-dashes, du-Form konsistent
> - [ ] Querverweise zu verwandten Modulen gesetzt (relative Links)
> - [ ] Bestehende Bilder entfernt, falls sie nicht mehr stimmen (keine neuen erzeugen)
>
> **Commit nach Fertigstellung:**
> ```
> docs(<modul>): rewrite for current frontend/backend state
> ```
>
> **Frontmatter-Format (jede `.mdx`):**
> ```yaml
> ---
> title: <Modul-Name aus messages/de>
> description: <ein Satz, was das Modul tut>
> ---
> ```

---

## Stufe 1: Fundament (Cluster C1) — sequenziell

C1 läuft als Erstes, weil Glossar/Konzepte/Workflows die Basis für alle Module sind. Wird vom Haupt-Orchestrator-Agent ausgeführt (nicht parallelisiert).

### Task 1.1: Neue Struktur-Skelette anlegen

**Files:**
- Create: `content/docs/platform/meta.json` (überschreiben)
- Create: alle `space/<gruppe>/meta.json` und `space/<gruppe>/<modul>/meta.json`

- [ ] **Schritt 1:** Neues `platform/meta.json` schreiben mit folgender `pages`-Reihenfolge:

```json
{
    "title": "Plattform",
    "description": "Dokumentation",
    "root": true,
    "pages": [
        "...index",
        "...quickstart",
        "...konzepte",
        "...glossar",
        "...workflows",
        "---Space---",
        "...space",
        "---Organisation---",
        "...organisation",
        "---Hilfe---",
        "...support"
    ]
}
```

- [ ] **Schritt 2:** Verzeichnis-Skelett anlegen — leere `index.mdx` (Titel + Description-Frontmatter) und `meta.json` pro Gruppe:

```
space/
├─ meta.json                        { "title": "Space", "pages": ["index", "issues", "documents", "trust-center", "---Governance---", "governance", "---Compliance---", "compliance", "---Organisation---", "organisation", "---Datenschutz---", "datenschutz", "---Integrationen---", "integrationen", "---Einstellungen---", "einstellungen"] }
├─ index.mdx
├─ issues/{index.mdx,meta.json}
├─ documents/{index.mdx,meta.json}
├─ trust-center/{index.mdx,meta.json}
├─ governance/
│  ├─ meta.json                     { "title": "Governance", "pages": ["programs","stakeholders","objectives"] }
│  ├─ programs/{index.mdx,meta.json}
│  ├─ stakeholders/{index.mdx,meta.json}
│  └─ objectives/{index.mdx,meta.json}
├─ compliance/
│  ├─ meta.json                     { "title": "Compliance", "pages": ["frameworks","controls","measures","risks","incidents","findings","audits"] }
│  ├─ frameworks/...
│  ├─ controls/...
│  ├─ measures/...
│  ├─ risks/...
│  ├─ incidents/...
│  ├─ findings/...
│  └─ audits/...
├─ organisation/
│  ├─ meta.json                     { "title": "Organisation", "pages": ["assets","information-assets","processes","vendors","business-units","people","domains"] }
│  ├─ assets/, information-assets/, processes/, vendors/, business-units/, people/, domains/
├─ datenschutz/
│  ├─ meta.json                     { "title": "Datenschutz", "pages": ["data-subject-requests","processing-activities"] }
│  ├─ data-subject-requests/, processing-activities/
├─ integrationen/
│  └─ {index.mdx, meta.json}
└─ einstellungen/
   ├─ meta.json                     { "title": "Einstellungen", "pages": ["allgemein","users","api-tokens","surveys","affected-parties","lawful-basis","communication-channels","retention-policies","authorities"] }
   ├─ allgemein/, users/, api-tokens/, surveys/, affected-parties/, lawful-basis/, communication-channels/, retention-policies/, authorities/

organisation/                       (Org-Ebene)
├─ meta.json                        { "title": "Organisation", "pages": ["customers","partners","dashboard","einstellungen"] }
├─ customers/, partners/, dashboard/, einstellungen/

support/
├─ meta.json                        { "title": "Hilfe", "pages": ["index","faq","troubleshooting"] }
├─ index.mdx, faq.mdx, troubleshooting.mdx
```

Jede leere `index.mdx` enthält nur Frontmatter + einen Platzhalter-Satz "Inhalt folgt." — wird in Stufe 2 von den Cluster-Agents überschrieben.

- [ ] **Schritt 3:** Alte Pfade umziehen oder leeren:
  - `platform/governance/` und `platform/compliance/` werden nach Stufe 2 entfernt (Inhalte werden in den neuen Pfaden komplett neu geschrieben)
  - `platform/quickstart/`, `platform/konzepte.mdx`, `platform/workflows.mdx` werden in den nächsten Tasks dieser Stufe aktualisiert (nicht verschoben)

- [ ] **Schritt 4:** Build-Sanity prüfen:

```bash
cd /Users/steffen/code/kopexa/docs && pnpm run build 2>&1 | tail -20
```

Erwartung: Build läuft durch (leere Seiten sind erlaubt).

- [ ] **Schritt 5:** Commit

```bash
git add content/docs/platform/
git commit -m "docs: scaffold new platform structure mirroring frontend nav"
```

### Task 1.2: Einführung (`platform/index.mdx`)

**Files:** Modify `content/docs/platform/index.mdx`

- [ ] **Schritt 1:** Inhalt schreiben — kurze Begrüßung, was Kopexa ist (1 Absatz für GFs/CISOs), `<FeatureCards>` mit Links zu Quickstart, Konzepten, Workflows, Glossar, Space-Bereich, Support
- [ ] **Schritt 2:** Sprach-Regeln prüfen (keine Backend-Vokabeln, keine em-dashes)
- [ ] **Schritt 3:** Commit `docs(intro): rewrite landing page for current structure`

### Task 1.3: Quickstart aktualisieren

**Files:**
- Modify: `content/docs/platform/quickstart/index.mdx`
- Modify: `content/docs/platform/quickstart/spaces.mdx`
- Modify: `content/docs/platform/quickstart/organization/*`
- Modify: `content/docs/platform/quickstart/user/*`

- [ ] **Schritt 1:** Alle Quickstart-Seiten lesen, gegen aktuellen Frontend-Flow (`/o/[slug]`, `/s/[spaceId]`, Organization-Setup) abgleichen
- [ ] **Schritt 2:** Veraltete Schritte ersetzen, Screenshots prüfen — entfernen falls überholt
- [ ] **Schritt 3:** Sprach-Check
- [ ] **Schritt 4:** Commit `docs(quickstart): refresh for current onboarding flow`

### Task 1.4: Konzepte aktualisieren

**Files:** Modify `content/docs/platform/konzepte.mdx`

- [ ] **Schritt 1:** Bestehenden Inhalt lesen, gegen aktuelles Modell prüfen: Organization, Space, Module, Berechtigungs-Konzept (FGA), Inventar vs. Compliance vs. Datenschutz
- [ ] **Schritt 2:** Aktualisieren, Mermaid-Diagramm für Org→Space→Module ergänzen
- [ ] **Schritt 3:** Commit `docs(concepts): refresh core concepts page`

### Task 1.5: Glossar aufbauen

**Files:**
- Create: `content/docs/platform/glossar.mdx`
- Delete: `content/docs/platform/quickstart/glossary/glossary.mdx` (Inhalt übernehmen, dann löschen)

- [ ] **Schritt 1:** Bestehenden Glossar-Inhalt aus `quickstart/glossary/glossary.mdx` ins neue `glossar.mdx` migrieren
- [ ] **Schritt 2:** Mit Modulen abgleichen — fehlende Begriffe ergänzen (z. B. "Findings", "Trust Center", "Lawful Basis", "Retention Policy", "DSAR", "Affected Party", "OpenFGA-Berechtigung")
- [ ] **Schritt 3:** Alphabetisch sortieren
- [ ] **Schritt 4:** Alte Datei löschen
- [ ] **Schritt 5:** Commit `docs(glossary): move to top-level and extend`

### Task 1.6: Workflows-Seite neu schreiben

**Files:** Modify `content/docs/platform/workflows.mdx`

- [ ] **Schritt 1:** Modulübergreifende End-to-End-Workflows definieren:
  - Risiko-Lifecycle (Risiko → Maßnahme → Kontrolle → Nachweis → Audit)
  - Lieferanten-Onboarding (Vendor → Risikobewertung → Verträge → Reviewzyklus)
  - Dokumenten-Lifecycle (Draft → Überprüfung → Veröffentlichung → Reviewzyklus)
  - Audit-Zyklus (Vorbereitung → Engagement → Findings → Maßnahmen)
  - Incident-Response (Meldung → Klassifizierung → Untersuchung → Maßnahmen → Meldepflichten)
  - DSAR-Bearbeitung (Eingang → Identitätsprüfung → Datensammlung → Antwort → Dokumentation)
  - Trust-Center-Veröffentlichung
- [ ] **Schritt 2:** Pro Workflow ein Mermaid-Flowchart + Schritt-Liste + Links zu beteiligten Modulen
- [ ] **Schritt 3:** Commit `docs(workflows): rewrite cross-module end-to-end flows`

### Task 1.7: Support-Bereich anlegen

**Files:**
- Create: `content/docs/platform/support/index.mdx`
- Create: `content/docs/platform/support/faq.mdx`
- Create: `content/docs/platform/support/troubleshooting.mdx`
- Create: `content/docs/platform/support/meta.json`

- [ ] **Schritt 1:** `support/index.mdx` — Kontakt: `support@kopexa.com`, Statusseite `https://status.kopexa.com/`, Hinweise zu Onboarding/Erstberatung, Reaktionszeiten (Standard-Best-Effort)
- [ ] **Schritt 2:** `support/faq.mdx` — typische Fragen (Login, Passwort-Reset, Berechtigungen, Datenexport, Mehrsprachigkeit, mobile Nutzung, Reviewzyklen, Trust-Center)
- [ ] **Schritt 3:** `support/troubleshooting.mdx` — SSO-Setup, fehlende Berechtigungen, ausstehende Synchronisationen, Domain-Verifizierung
- [ ] **Schritt 4:** `meta.json` mit Page-Reihenfolge
- [ ] **Schritt 5:** Commit `docs(support): add help and contact section`

---

## Stufe 2: Modul-Cluster (C2–C10) — parallel

Cluster C2–C10 laufen **parallel** als jeweils ein Subagent. Jeder Subagent bekommt:
- Das Briefing-Template (siehe oben)
- Die Modul-Liste seines Clusters mit konkreten Pfaden (siehe unten)
- Anweisung: ein Commit pro Modul

Wird gestartet via `superpowers:subagent-driven-development`. Der Hauptagent wartet auf Cluster-Completion und macht Spot-Checks zwischen Clustern.

### Modul-Quellen-Mapping

Pro Modul: Frontend-Route — Backend-Schema — Hooks — Worker — i18n-Datei — bestehende Doku (falls vorhanden).

| Modul | Frontend-Route | Backend-Schema | Hooks | i18n | Alte Doku |
|---|---|---|---|---|---|
| **C2 — Top-Level** | | | | | |
| Issues | `(root)/issues/` | `schema/issue.go` | `hooks/issue.go` (falls existent) | `messages/de/issues*.json` (prüfen) | — |
| Documents | `(root)/documents/` | `schema/document*.go` | `hooks/document*.go` | `messages/de/document.json` | `compliance/documents/` |
| Trust Center | `(root)/trust-center/` | `schema/trust_center*.go` | `hooks/trust_center*.go` | `messages/de/trust-center.json` | — |
| **C3 — Governance** | | | | | |
| Programs | `(root)/programs/` | `schema/program*.go` | `hooks/program*.go` | `messages/de/program.json` | `governance/programs/` |
| Stakeholders | `(root)/stakeholders/` | `schema/stakeholder*.go` | `hooks/stakeholder*.go` | `messages/de/stakeholder.json` | `governance/stakeholders/` |
| Objectives | `(root)/objectives/` | `schema/objective.go` | `hooks/objective*.go` | `messages/de/objective.json` | `governance/goals/` |
| **C4 — Compliance A** | | | | | |
| Frameworks | `(root)/frameworks/` | `schema/framework*.go` | `hooks/framework.go` | `messages/de/frameworks.json` | — |
| Controls | `(root)/controls/` | `schema/control.go` | `hooks/control.go` | `messages/de/controls.json` | `compliance/controls.mdx` |
| Measures | `(root)/control-implementations/` | `schema/control_implementation*.go` | `hooks/control_implementation*.go` | `messages/de/control-implementation.json` | `compliance/control-implementations.mdx` |
| **C5 — Compliance B** | | | | | |
| Risks | `(root)/risks/` | `schema/risk.go` | `hooks/risk*.go` + `riskengine/` | `messages/de/risk.json` | `compliance/risks/` |
| Incidents | `(root)/incidents/` | `schema/incident*.go` | `hooks/incident.go` + `river/jobs/incident_*` | `messages/de/incidents.json` | — |
| Findings | `(root)/findings/` | `schema/finding.go` | `hooks/finding.go` | `messages/de/findings.json` | — |
| Audits | `(root)/audits/` | `schema/audit*.go` | `hooks/audit*.go` + `river/jobs/audit_*` | `messages/de/audit.json` | — |
| **C6 — Organisation** | | | | | |
| Assets | `(root)/assets/` | `schema/asset.go` | `hooks/asset.go` + `river/jobs/asset_*` | `messages/de/asset.json` | — |
| Information Assets | `(root)/information-assets/` | `schema/information_asset.go` | `hooks/information_asset.go` | `messages/de/information-asset.json` | — |
| Processes | `(root)/processes/` | `schema/process*.go` | `hooks/process*.go` | `messages/de/process.json` | — |
| Vendors | `(root)/vendors/` | `schema/vendor*.go` | `hooks/vendor*.go` | `messages/de/vendor.json` | `compliance/vendors/` |
| Business Units | `(root)/business-units/` | `schema/business_unit*.go` | `hooks/business_unit*.go` | `messages/de/business-units.json` | — |
| People | `(root)/people/` | `schema/person*.go` oder `account.go` | `hooks/person*.go` | `messages/de/people.json` | `compliance/inventory/people.mdx` |
| Domains | `(root)/domains/` | `schema/domain*.go` + `internet_domain.go` | `hooks/domain*.go` + `river/jobs/domain_*` | (Domain-Wording aus `common.json`) | `quickstart/organization/domains/` (prüfen, ggf. integrieren) |
| **C7 — Datenschutz** | | | | | |
| DSARs | `(root)/data-subject-requests/` | `schema/dsr*.go` | `hooks/data_subject_request*.go` | `messages/de/data-subject-request.json` | — |
| Processing Activities | `(root)/processing-activities/` | `schema/processing_activity*.go` | `hooks/processing_activity*.go` | `messages/de/processing-activity.json` | — |
| **C8 — Einstellungen** | | | | | |
| Allgemein (Settings General) | `(settings)/settings/general/` (oder analog) | `schema/space*.go` | `hooks/space*.go` | `messages/de/spaces.json` | — |
| Users | `(settings)/settings/users/` | `schema/space_membership*.go` | `hooks/space_membership*.go` | `messages/de/spaces.json` | — |
| API Tokens | `api-tokens/` (Settings-Untermenü) | `schema/api_token.go` | `hooks/api_token.go` | `messages/de/api-tokens.json` | — |
| Surveys | Settings-Untermenü | `schema/survey*.go` | `internal/survey/` | `messages/de/surveys.json` | — |
| Affected Parties | Settings-Untermenü | `schema/affected_party.go` | `hooks/affected_party.go` | `messages/de/affected-party.json` | — |
| Lawful Basis | Settings-Untermenü | `schema/lawful_basis.go` | `hooks/lawful_basis.go` | `messages/de/lawful-basis.json` | — |
| Communication Channels | Settings-Untermenü | `schema/communication_channel.go` | `hooks/communication_channel.go` | `messages/de/communication-channel.json` | — |
| Retention Policies | Settings-Untermenü | `schema/retention_policy*.go` | `hooks/retention_policy*.go` | `messages/de/retention-policy.json` | — |
| Authorities | Settings-Untermenü | `schema/authority.go` | `hooks/authority.go` | `messages/de/authority.json` | — |
| **C9 — Integrationen** | | | | | |
| Integrationen-Übersicht | `(root)/integrations/` | `schema/integration.go` | `internal/integrations/` | `messages/de/integrations.json` | — |
| **C10 — Org-Ebene** | | | | | |
| Customers | `(organization)/o/[slug]/customers/` | `schema/customer*.go` oder `partner_relationship.go` | — | `messages/de/contact.json` (prüfen) | — |
| Partners | `(organization)/o/[slug]/partners/` | `schema/partner_relationship.go` | `hooks/partner*.go` | (Partner-Wording, prüfen) | — |
| Dashboard | `(organization)/o/[slug]/dashboard/` | — | — | (prüfen) | — |
| Org-Einstellungen | `(organization)/o/[slug]/settings/` | `schema/organization*.go` | `hooks/organization*.go` | `messages/de/organization.json` | — |

> Wenn ein Pfad-Glob nichts findet: Subagent dokumentiert das im Modul-Body ("Funktionalität noch in Vorbereitung — folgender Stand laut Frontend") statt zu erfinden.

### Task 2.C2: Cluster C2 — Top-Level

- [ ] Subagent dispatchen mit Briefing-Template + Modul-Liste {Issues, Documents, Trust Center}
- [ ] Erwartung: 3 Module dokumentiert, 3 Commits, Quality-Gate je Modul erfüllt
- [ ] Spot-Check eines zufälligen Moduls nach Completion

### Task 2.C3: Cluster C3 — Governance

- [ ] Subagent dispatchen mit Briefing-Template + Modul-Liste {Programs, Stakeholders, Objectives}
- [ ] **Hinweis:** Alle drei haben bestehende Doku unter `governance/` — Subagent muss diese explizit gegen aktuellen Code prüfen und ggf. komplett ersetzen
- [ ] Spot-Check

### Task 2.C4: Cluster C4 — Compliance A

- [ ] Subagent dispatchen mit Briefing-Template + Modul-Liste {Frameworks, Controls, Measures}
- [ ] **Hinweis:** `controls.mdx` und `control-implementations.mdx` sind heute Einzeldateien — neu strukturieren als `controls/index.mdx` und `measures/index.mdx`
- [ ] Spot-Check

### Task 2.C5: Cluster C5 — Compliance B

- [ ] Subagent dispatchen mit Briefing-Template + Modul-Liste {Risks, Incidents, Findings, Audits}
- [ ] **Hinweis:** Risks hat bestehende, umfangreichste Doku (`risks/index.mdx`, `assessment.mdx`, `reviews.mdx`, `create-guide.mdx`, `status.mdx`) — Subagent entscheidet pro Datei: behalten/aktualisieren/löschen, mindestens eine konsolidierte `risks/index.mdx` ergibt sich
- [ ] **Hinweis:** Risk-Engine (`backend/internal/riskengine/`) als wichtige Automatisierungsquelle prüfen
- [ ] Spot-Check

### Task 2.C6: Cluster C6 — Organisation

- [ ] Subagent dispatchen mit Briefing-Template + Modul-Liste {Assets, Information Assets, Processes, Vendors, Business Units, People, Domains}
- [ ] **Hinweis:** Vendors hat umfangreiche bestehende Doku (`compliance/vendors/`) — wird nach `organisation/vendors/` verschoben/neu geschrieben. Inhaltlich gründlich prüfen
- [ ] **Hinweis:** Domains-Setup in `quickstart/organization/domains/` enthält bereits SAML/Entra-Setup — entweder dort behalten (Quickstart-Kontext) und im neuen `domains/`-Modul nur die laufende Nutzung dokumentieren, oder verschieben. Subagent entscheidet
- [ ] Spot-Check

### Task 2.C7: Cluster C7 — Datenschutz

- [ ] Subagent dispatchen mit Briefing-Template + Modul-Liste {DSARs, Processing Activities}
- [ ] **Hinweis:** DSAR ist DSGVO-pflichtig — Fristen, Identitätsprüfung, Verweigerungsgründe (DSGVO Art. 12) müssen klar drinstehen. Backend hat eigene Schemas für `dsr_rejection_reason`, `dsr_unable_to_process_reason`, `dsr_extension_reason` — diese als Bausteine erwähnen, mit kurzer Erklärung was sie bedeuten
- [ ] Spot-Check

### Task 2.C8: Cluster C8 — Einstellungen

- [ ] Subagent dispatchen mit Briefing-Template + Modul-Liste {Allgemein, Users, API Tokens, Surveys, Affected Parties, Lawful Basis, Communication Channels, Retention Policies, Authorities}
- [ ] **Hinweis:** Größtes Cluster — Subagent darf intern parallelisieren oder sequenziell arbeiten, solange Quality-Gate je Modul gilt
- [ ] **Hinweis:** API-Tokens-Doku muss Sicherheits-Best-Practices abdecken (Scopes, Rotation, Widerruf)
- [ ] Spot-Check

### Task 2.C9: Cluster C9 — Integrationen

- [ ] Subagent dispatchen mit Briefing-Template + Modul-Liste {Integrationen-Übersicht}
- [ ] **Hinweis:** Detail-Doku einzelner Integrationen lebt im separaten `integrations/`-Bereich (außer Scope). Hier nur die UI-Sicht: "wo finde ich Integrationen, wie aktiviere ich eine, was passiert dann"
- [ ] Spot-Check

### Task 2.C10: Cluster C10 — Org-Ebene

- [ ] Subagent dispatchen mit Briefing-Template + Modul-Liste {Customers, Partners, Dashboard, Org-Einstellungen}
- [ ] **Hinweis:** Diese Module sind oberhalb der Spaces — Kontext klar machen (Org-Admin-Sicht). Dashboard ist eher Übersicht/KPIs, kein klassisches CRUD-Modul
- [ ] Spot-Check

---

## Stufe 3: Konsolidierung (C11) — sequenziell

Wird vom Hauptagent ausgeführt, nachdem alle Stufe-2-Cluster fertig sind.

### Task 3.1: Alte Pfade bereinigen

**Files:**
- Delete: `content/docs/platform/governance/` (Inhalte sind nach `platform/space/governance/` migriert)
- Delete: `content/docs/platform/compliance/` (Inhalte sind nach `platform/space/compliance/` bzw. `platform/space/organisation/vendors/` migriert)
- Delete: `content/docs/platform/quickstart/glossary/` (Inhalt nach `platform/glossar.mdx` migriert)

- [ ] **Schritt 1:** Pro Ordner prüfen: gibt es Dateien, deren Inhalt noch nicht migriert wurde? Falls ja: zurück zum entsprechenden Stufe-2-Agent
- [ ] **Schritt 2:** Löschen
- [ ] **Schritt 3:** Commit `docs: remove legacy platform doc paths after migration`

### Task 3.2: Crosslinks prüfen

- [ ] **Schritt 1:** Alle `.mdx` unter `platform/` nach Links scannen:

```bash
cd /Users/steffen/code/kopexa/docs && grep -rn "](.*\(\.mdx\|/index\)" content/docs/platform/ | head -100
```

- [ ] **Schritt 2:** Tote Links manuell korrigieren (relative Pfade zur neuen Struktur)
- [ ] **Schritt 3:** Commit `docs: fix cross-references after restructure`

### Task 3.3: Index-Querverweise

- [ ] **Schritt 1:** `platform/index.mdx` finale Version: alle Top-Level-Bereiche per `<FeatureCards>` verlinkt
- [ ] **Schritt 2:** `platform/workflows.mdx` mit korrekten Modul-Links zu neuen Pfaden
- [ ] **Schritt 3:** Commit `docs: finalize landing page and workflow cross-links`

### Task 3.4: Sprach-Audit auf Stichprobe

- [ ] **Schritt 1:** 3 zufällige Modul-Seiten + 2 Cluster-Übersichten lesen, prüfen auf:
  - du-Form
  - keine em-dashes
  - keine Backend-Vokabeln
  - Wording aus `messages/de/<modul>.json` übernommen
- [ ] **Schritt 2:** Pro gefundenem Verstoß: zurück zum verantwortlichen Stufe-2-Cluster

### Task 3.5: Build-Check

- [ ] **Schritt 1:**

```bash
cd /Users/steffen/code/kopexa/docs && pnpm run build 2>&1 | tail -40
```

Erwartung: Build erfolgreich, keine MDX-Parse-Fehler, keine ungültigen Frontmatter

- [ ] **Schritt 2:** Falls Fehler: pro Datei fixen, dann erneut bauen
- [ ] **Schritt 3:** Commit (falls Fixes nötig) `docs: fix build errors after restructure`

### Task 3.6: PR vorbereiten (nicht öffnen)

- [ ] **Schritt 1:** `git log main..HEAD --oneline` — Commit-Reihenfolge sauber, conventional commits
- [ ] **Schritt 2:** Status an User berichten mit Commit-Übersicht und Vorschlag für PR-Titel/Body
- [ ] **Schritt 3:** Auf User-Freigabe für `git push` + PR-Erstellung warten (NICHT automatisch pushen)

---

## Risiken & Annahmen

- **Backend-Schemas decken nicht alle Frontend-Module 1:1 ab.** Wenn Subagent keine passende Datei findet, dokumentiert er das ehrlich und beschreibt nur das, was im Frontend sichtbar ist.
- **i18n-Dateien können Lücken haben.** Subagent zieht in dem Fall Begriffe aus `common.json` und Frontend-Strings (Page-Komponenten) — keine Erfindungen.
- **Bestehende Bilder werden eher entfernt als behalten.** User hat bestätigt: "nur wenn sie noch stimmen (unwahrscheinlich)".
- **Frontend-Routen ändern sich häufig.** Plan dokumentiert Stand 2026-06-01 — wenn Code sich zwischen Stufe 1 und Stufe 3 ändert, sind Spot-Checks Pflicht.
- **MDX-Build kann an Mermaid-Diagrammen scheitern.** Subagents validieren ihre Mermaid-Snippets lokal (Syntax prüfen) — Build-Check in Task 3.5 ist das Safety-Net.
