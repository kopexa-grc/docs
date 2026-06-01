# Platform-Doku-Rewrite — Design

**Datum:** 2026-06-01
**Branch:** `docs/platform-rewrite` (in `kopexa/docs`)
**Status:** Approved

## Ziel

Vollständige, gründlich verifizierte Endnutzer-Dokumentation der Kopexa-Plattform.

- **Sprache:** Deutsch (du-Form, generische Ansprache, später ins Englische übersetzbar)
- **Zielgruppe:** GFs, CISOs, Berater — wenig technisches Verständnis vorausgesetzt
- **Struktur:** Deckungsgleich mit der Frontend-Navigation (Erkennungswert maximieren)
- **Tiefe:** Jeder Punkt aus der Frontend-Navi wird dokumentiert; bestehende Inhalte werden auf den Prüfstand gestellt und ggf. komplett neu geschrieben

Aus Scope ausgeklammert:
- `catalogs/` (bleibt unverändert)
- `integrations/` (bleibt unverändert)
- Frontend-Routen unter `/platform/*` (Admin-/Superuser-Bereich)

## Repos & Datenquellen

| Repo | Pfad | Zweck |
|---|---|---|
| `kopexa/docs` | `content/docs/platform/` | Zielort der neuen Doku (MDX, Fumadocs) |
| `kopexa/frontend` | `src/app/`, `src/modules/`, `messages/de/` | UI-Routen, Forms, deutsche Strings |
| `kopexa/backend` | `internal/`, `db/`, Schemas, Hooks, Worker | Validierungsregeln, Automatisierungen |

## Ziel-Struktur

```
content/docs/platform/
├─ index.mdx                    Einführung
├─ quickstart/                  Quickstart
├─ konzepte.mdx                 Konzepte
├─ glossar.mdx                  Glossar
├─ workflows.mdx                Modulübergreifende End-to-End-Abläufe
├─ support/
│  ├─ index.mdx                 Kontakt: support@kopexa.com,
│  │                            Statusseite https://status.kopexa.com/
│  ├─ faq.mdx                   Häufige Fragen
│  └─ troubleshooting.mdx       Typische Probleme & Lösungswege
│
├─ space/
│  ├─ index.mdx
│  ├─ issues/
│  ├─ documents/
│  ├─ trust-center/
│  ├─ governance/
│  │  ├─ programs/, stakeholders/, objectives/
│  ├─ compliance/
│  │  ├─ frameworks/, controls/, measures/, risks/,
│  │  ├─ incidents/, findings/, audits/
│  ├─ organisation/
│  │  ├─ assets/, information-assets/, processes/,
│  │  ├─ vendors/, business-units/, people/, domains/
│  ├─ datenschutz/
│  │  ├─ data-subject-requests/, processing-activities/
│  ├─ integrationen/
│  └─ einstellungen/
│     ├─ surveys/, affected-parties/, lawful-basis/,
│     ├─ communication-channels/, retention-policies/, authorities/,
│     ├─ allgemein/, users/, api-tokens/
│
└─ organisation/
   ├─ customers/, partners/, dashboard/, einstellungen/
```

Jeder Modul-Ordner enthält mindestens `index.mdx` (Hauptseite) und kann
Unter-Seiten haben (`create.mdx`, `review.mdx` etc.), wenn der Umfang es
rechtfertigt.

## Modul-Template (verbindlich)

Jede Modul-Hauptseite folgt diesem Aufbau. Abschnitte dürfen ausgelassen
werden, **wenn dies in der Spec begründet ist** (z. B. "Berechtigungen: alle
Rollen identisch — Abschnitt entfällt").

1. **Worum geht's** — 2–3 Sätze, nicht-technisch. Was ist dieses Modul,
   welche Frage beantwortet es für CISO/GF/Berater.
2. **Wann nutzt du es** — Typische Anlässe.
3. **Das Wichtigste in Kürze** — 3–5 Kernkonzepte als Bullet-Liste.
4. **Typischer Ablauf** — Schritt-für-Schritt + Mermaid-Diagramm
   (flowchart oder sequenceDiagram, je nach Modul).
5. **Felder & Eingaben** — Tabelle: Feld, Bedeutung, Pflicht/Optional,
   Validierungsregel, Tipp. Nur die kritischen Felder.
6. **Was im Hintergrund passiert** — Automatisierungen in Klartext
   (Quelle: Backend-Hooks/Worker, ohne Tech-Vokabular).
7. **Verknüpfungen** — Welche anderen Module hängen dran.
8. **Berechtigungen** — Wer darf was (View/Edit/Delete).
9. **Best Practices** — 3–5 konkrete Empfehlungen.
10. **Stolperfallen** — Was schiefgeht und wie man's vermeidet.
11. **FAQ** — 3–5 modulspezifische Fragen.

### Wording-Regeln

- **Deutsche Begriffe immer aus `frontend/messages/de/<modul>.json`**
  ziehen — single source of truth.
- du-Form, generische Ansprache.
- "Überprüfung/überprüfen" statt "Review/reviewen". "Reviewer" ist okay.
- **Keine em-dashes** (—). Stattdessen Doppelpunkt, Komma oder Punkt.
- **Keine Backend-Vokabeln**: kein "Schema", "Hook", "Worker", "Endpoint",
  "Mutation", "Query". Stattdessen: "Eingabefeld", "automatischer Ablauf",
  "im Hintergrund", "wird geprüft".
- Kurze Sätze. Eine Idee pro Satz.

### MDX-Komponenten

Verfügbar in `kopexa/docs`:
- `<Mermaid chart="..." />` — Diagramme
- `<FeatureCards>`, `<FeatureCard>` — Kachel-Navigation
- `<Accordions>`, `<Accordion>` — FAQ und ausklappbare Bereiche
- Fumadocs-Defaults: `<Callout>`, `<Tabs>`, `<Steps>`, `<Files>`

## Datenquellen pro Modul

Jeder Agent geht für sein Modul folgende Quellen durch:

1. **Frontend-Routen** — `src/app/(protected)/(space)/s/[spaceId]/(root)/<modul>/`
   plus zugehörige `src/modules/<modul>/`.
2. **Backend-Schema** — `internal/<modul>/` und `db/migrations/` für
   Pflichtfelder, Validierungsregeln, Enums.
3. **Backend-Hooks/Worker** — was passiert automatisch beim Anlegen,
   Statuswechsel, Löschen, Zuweisen.
4. **Berechtigungen** — FGA-Tuples, `AccessEnum`/`ObjectEnum` im Frontend.
5. **Bestehende `.mdx`** — Stand vs. aktueller Code abgleichen.
6. **`frontend/messages/de/<modul>.json`** — Wording.

## Cluster (Agent-Aufteilung)

| Cluster | Module | Reihenfolge |
|---|---|---|
| **C1 — Fundament** | Index, Quickstart-Update, Konzepte-Update, Glossar, Workflows-Rewrite, Support (neu) | **Sequenziell, zuerst** |
| **C2 — Top-Level** | Issues, Documents, Trust Center | Parallel |
| **C3 — Governance** | Programs, Stakeholders, Objectives | Parallel |
| **C4 — Compliance A** | Frameworks, Controls, Measures | Parallel |
| **C5 — Compliance B** | Risks, Incidents, Findings, Audits | Parallel |
| **C6 — Organisation** | Assets, Information Assets, Processes, Vendors, Business Units, People, Domains | Parallel |
| **C7 — Datenschutz** | DSARs, Processing Activities | Parallel |
| **C8 — Einstellungen** | Surveys, Affected Parties, Lawful Basis, Communication Channels, Retention Policies, Authorities, General, Users, API Tokens | Parallel |
| **C9 — Integrationen** | Integrationen-Übersicht (UI-Doku) | Parallel |
| **C10 — Org-Ebene** | Customers, Partners, Dashboard, Org-Settings | Parallel |
| **C11 — Konsolidierung** | meta.json-Hierarchie, Crosslinks, Workflows-Querverweise, Build-Check | **Sequenziell, zuletzt** |

### Ausführungsplan

1. C1 läuft als Erstes (Hauptsession oder ein dedizierter Subagent).
2. C2–C10 laufen parallel — jeweils ein Subagent pro Cluster mit
   identischem Briefing-Template.
3. C11 läuft am Ende, prüft Konsistenz und führt den Build aus.

## Qualitäts-Gate pro Modul

Bevor ein Agent ein Modul als fertig meldet, MUSS gelten:

- [ ] Alle elf Template-Abschnitte ausgefüllt oder Auslassung begründet
- [ ] Frontend-Route durchgegangen
- [ ] Validierung mit Backend-Schema abgeglichen
- [ ] Backend-Hooks/Worker auf Automatisierungen geprüft
- [ ] Berechtigungen verifiziert
- [ ] Bestehende `.mdx` (falls vorhanden) auf veraltete Aussagen geprüft
- [ ] Mindestens ein Mermaid-Diagramm
- [ ] Wording aus `messages/de/<modul>.json` übernommen
- [ ] Keine Backend-Vokabeln, keine em-dashes, du-Form konsistent
- [ ] Querverweise zu verwandten Modulen gesetzt

## Branch-Workflow

- Branch: `docs/platform-rewrite` in `kopexa/docs`
- Ein Commit pro Modul: `docs(<modul>): ...` (conventional commits, englisch)
- Cluster-Commits für Fundament und Konsolidierung
- Bestehende Bilder werden entfernt, wenn sie nicht mehr stimmen — keine
  neuen Screenshots werden erzeugt
- PR am Ende — der Nutzer reviewt und merged

## Konsolidierungs-Pass (C11)

- `meta.json`-Hierarchie auf neue Struktur umstellen
- Alle Crosslinks prüfen (keine toten Links)
- Workflows-Seite auf neue Modul-Pfade aktualisieren
- Index, Konzepte, Glossar finalisieren
- `pnpm run build` in `kopexa/docs` erfolgreich

## Erfolgskriterien

- Alle Frontend-Navi-Punkte (Space-Ebene + Org-Ebene) haben mindestens eine
  `index.mdx`-Seite, die das Modul-Template erfüllt.
- Keine veralteten Aussagen in `governance/` und `compliance/` (bestehende
  Inhalte wurden geprüft und ggf. neu geschrieben).
- Build läuft ohne Fehler durch.
- Alle Querverweise funktionieren.
- Doku ist für nicht-technische Leser:innen verständlich (Spot-Checks: 2–3
  zufällige Module gegen das Sprach-Regelwerk prüfen).

## Folgeschritte

1. Spec-Review-Loop ausführen.
2. Nach Approval: Implementierungsplan via `superpowers:writing-plans`.
3. Plan-Ausführung: C1 zuerst, dann C2–C10 parallel via subagent-driven-development.
4. C11 als finaler sequenzieller Pass.
5. PR auf `main` öffnen.
