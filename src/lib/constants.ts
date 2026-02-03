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
    { label: "Asset Management", href: `${KOPEXA_URL}/de/platform/asset-management` },
    { label: "Incident Management", href: `${KOPEXA_URL}/de/platform/incident-management` },
    { label: "Lieferanten Management", href: `${KOPEXA_URL}/de/platform/vendor-management` },
    { label: "Richtlinien", href: `${KOPEXA_URL}/de/platform/policies` },
    { label: "Risk Management", href: `${KOPEXA_URL}/de/platform/risk-management` },
  ],
  catalog: [
    { label: "Übersicht", href: `${KOPEXA_URL}/de/catalog` },
    { label: "ISO 27001", href: `${KOPEXA_URL}/de/catalog/iso-27001` },
    { label: "TISAX", href: `${KOPEXA_URL}/de/catalog/tisax` },
    { label: "DSGVO", href: `${KOPEXA_URL}/de/catalog/gdpr` },
    { label: "NIS2", href: `${KOPEXA_URL}/de/catalog/nis2` },
    { label: "DORA", href: `${KOPEXA_URL}/de/catalog/dora` },
  ],
  resources: [
    { label: "Blog", href: `${KOPEXA_URL}/de/blog` },
    { label: "Dokumentation", href: "/" },
    { label: "Status", href: KOPEXA_STATUS_URL, external: true },
    { label: "Glossar", href: `${KOPEXA_URL}/de/glossary` },
    { label: "Lösungen", href: `${KOPEXA_URL}/de/solutions` },
    { label: "Für Berater", href: `${KOPEXA_URL}/de/partners/consultants` },
  ],
  company: [
    { label: "Impressum", href: `${KOPEXA_URL}/de-de/legal/legal-notice`, external: true },
    { label: "Datenschutz", href: `${KOPEXA_URL}/de-de/legal/privacy-policy`, external: true },
    { label: "Cookies", href: `${KOPEXA_URL}/de-de/legal/cookies`, external: true },
    { label: "Barrierefreiheit", href: `${KOPEXA_URL}/de-de/legal/accessibility`, external: true },
    { label: "Modern Slavery Act", href: `${KOPEXA_URL}/de-de/legal/modern-slavery`, external: true },
    { label: "Security", href: `${KOPEXA_URL}/de/security`, external: true },
    { label: "SLA", href: `${KOPEXA_URL}/de-de/legal/sla`, external: true },
  ],
} as const;

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};
