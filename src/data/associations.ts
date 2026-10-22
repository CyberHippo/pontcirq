import { slugify } from '../utils/slugify';

export interface Association {
  name: string;
  desc: string;
  /** Email address (rendered as a mailto link when it contains "@") or free text; empty when unknown. */
  contact: string;
  website?: string;
}

export const associations: Association[] = [
  {
    name: 'ACCA de Pontcirq',
    desc: 'Association Communale de Chasse Agréée.',
    contact: '',
  },
  {
    name: 'APE 3LP',
    desc: "Association des parents d'élèves du RPI Labastide-du-Vert, Les Junies, Lherm et Pontcirq.",
    contact: '3lp.ape@gmail.com',
  },
  {
    name: 'Association de Sauvegarde du Patrimoine',
    desc: 'Préservation et valorisation du patrimoine communal.',
    contact: '',
  },
  {
    name: "FESTI'PONTCIRQ",
    desc: 'Organisation de festivités et animations locales diverses (marché gourmand, brocante, fête votive, etc.).',
    contact: 'festipontcirq@gmail.com',
  },
  {
    name: 'La Gariotte',
    desc: 'Café associatif et lieu de convivialité du village.',
    contact: 'lagariottepontcirq@gmail.com',
  },
  {
    name: 'La maison du Garric Blanc',
    desc: 'Sauvegarde et mise en valeur de la maison dite du Garric Blanc, située au 158, route de la Crouzette à Pontcirq 46150',
    contact: '',
  },
  {
    name: 'Unis Vers Terre',
    desc: "Laboratoire d'écologie globale cultivant l'autonomie, la coopération humaine et la transition intérieure à travers la permaculture.",
    contact: 'asso.unisversterre (at) gmail.com',
    website: 'https://unisversterre.wordpress.com/',
  },
];

/** Anchor of an association card on /vie-locale. */
export function associationAnchor(name: string): string {
  return `assoc-${slugify(name)}`;
}

/** Anchor of the library card, rendered separately from the associations list on /vie-locale. */
export const LIBRARY_ANCHOR = 'assoc-bibliotheque-de-pontcirq';

/** Every anchor an event may link to on /vie-locale. */
export const VALID_ANCHORS: ReadonlySet<string> = new Set([
  ...associations.map((a) => associationAnchor(a.name)),
  LIBRARY_ANCHOR,
]);
