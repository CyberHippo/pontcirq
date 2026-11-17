// Notices shown in a banner at the top of the home page (closures, works, water cuts…).
// A notice is shown while at least one of its dates, or its `until` date, is today or later.
// Like event statuses this is computed at build time, and the site is rebuilt weekly
// (Monday just after midnight, Paris time), so a notice can stay up to a few days past its last date.

export interface Alerte {
  title: string;
  /** Quoted "YYYY-MM-DD" dates listed in the notice; past ones are hidden. */
  dates?: string[];
  /** Last day to show a notice without `dates` ("YYYY-MM-DD"). */
  until?: string;
  /** Body text, one paragraph per entry. */
  paragraphs: string[];
  /** Optional phone number shown as a call link after the paragraphs. */
  phone?: { intro: string; label: string; href: string };
  /** Optional last line, after the phone number. */
  closing?: string;
}

export const alertes: Alerte[] = [
  {
    title: 'Fermeture exceptionnelle de la mairie',
    dates: ['2026-11-24', '2026-12-01', '2026-12-15', '2026-12-18'],
    paragraphs: ['Le secrétariat de mairie sera exceptionnellement fermé :'],
    phone: { intro: "En cas d'urgence, contactez M. le maire au", label: '06 72 02 85 18', href: 'tel:+33672028518' },
    closing: 'Merci de votre compréhension.',
  },
];

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());

// `2026-12-01` -> `mardi 1er décembre`
export function formatAlerteDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  const weekday = d.toLocaleDateString('fr-FR', { weekday: 'long', timeZone: 'UTC' });
  const month = d.toLocaleDateString('fr-FR', { month: 'long', timeZone: 'UTC' });
  const day = d.getUTCDate();
  return `${weekday} ${day === 1 ? '1er' : day} ${month}`;
}

/** Notices to show, with their past dates removed. */
export function getActiveAlertes(): Alerte[] {
  return alertes
    .map((a) => (a.dates ? { ...a, dates: a.dates.filter((d) => d >= today) } : a))
    .filter((a) => (a.dates ? a.dates.length > 0 : a.until !== undefined && a.until >= today));
}
