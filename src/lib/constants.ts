// src/lib/constants.ts

export const KOPEXA_URL = "https://kopexa.com";
export const KOPEXA_APP_URL = "https://app.kopexa.com";
export const KOPEXA_STATUS_URL = "https://status.kopexa.com";

export const SOCIALS = {
  github: "https://github.com/kopexa-grc",
  linkedin: "https://de.linkedin.com/company/kopexa",
} as const;

export const FOOTER_LINKS = {
  platform: [
    { label: "Asset Management", href: `${KOPEXA_URL}/de/asset-management` },
    { label: "Incident Management", href: `${KOPEXA_URL}/de/incidents` },
    { label: "Lieferanten Management", href: `${KOPEXA_URL}/de/vendors` },
    { label: "Richtlinien", href: `${KOPEXA_URL}/de/policies` },
    { label: "Risk Management", href: `${KOPEXA_URL}/de/risks` },
  ],
  catalog: [
    { label: "Übersicht", href: `${KOPEXA_URL}/de/catalog` },
    { label: "ISO 27001", href: `${KOPEXA_URL}/de/catalog/iso-27001` },
    { label: "TISAX", href: `${KOPEXA_URL}/de/catalog/tisax` },
    { label: "DSGVO", href: `${KOPEXA_URL}/de/catalog/gdpr` },
    { label: "NIS2", href: `${KOPEXA_URL}/de/catalog/nis-2` },
    { label: "DORA", href: `${KOPEXA_URL}/de/catalog/dora` },
  ],
  resources: [
    { label: "Blog", href: `${KOPEXA_URL}/de/blog` },
    { label: "Dokumentation", href: "/" },
    { label: "Status", href: KOPEXA_STATUS_URL, external: true },
    { label: "Glossar", href: `${KOPEXA_URL}/de/glossary` },
    { label: "Lösungen", href: `${KOPEXA_URL}/de/loesungen` },
    { label: "Für Berater", href: `${KOPEXA_URL}/de/fuer-berater` },
  ],
  company: [
    { label: "Impressum", href: `${KOPEXA_URL}/de/legal/imprint`, external: true },
    { label: "Datenschutz", href: `${KOPEXA_URL}/de/legal/privacy`, external: true },
    { label: "Cookies", href: `${KOPEXA_URL}/de/legal/cookies`, external: true },
    { label: "Barrierefreiheit", href: `${KOPEXA_URL}/de/legal/accessibility-statement`, external: true },
    { label: "Modern Slavery Act", href: `${KOPEXA_URL}/de/legal/modern-slavery-statement`, external: true },
    { label: "Security", href: `${KOPEXA_URL}/de/legal/security`, external: true },
    { label: "SLA", href: `${KOPEXA_URL}/de/legal/service-level-agreement`, external: true },
  ],
} as const;

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};
