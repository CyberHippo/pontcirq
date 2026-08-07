export interface Actualite {
  id: number;
  date: string;
  endDate?: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  associations?: { name: string; anchor: string }[];
}

export function formatActualiteDate(actualite: Pick<Actualite, 'date' | 'endDate'>): string {
  const start = new Date(actualite.date);
  const startFull = start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  if (!actualite.endDate) {
    return startFull;
  }

  const end = new Date(actualite.endDate);
  const startDay = start.toLocaleDateString('fr-FR', { day: 'numeric' });
  const endFull = end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const isConsecutiveDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) === 1;

  return isConsecutiveDays ? `${startDay} et ${endFull}` : `Du ${startFull} au ${endFull}`;
}

export const actualites: Actualite[] = [
  {
    id: 1,
    date: '2026-07-25',
    endDate: '2026-07-26',
    title: 'Pontcirq en Fête',
    excerpt: "Le Comité des fêtes, l'association du Patrimoine et la bibliothèque organisent deux jours de festivités : messe, cérémonie, soirée dansante et jeu de piste.",
    content:
      "Le Comité des fêtes, l'association du Patrimoine et la bibliothèque de Pontcirq organisent \"Pontcirq en Fête\" les 25 et 26 juillet. " +
      "Samedi 25 juillet : messe à 10h30, cérémonie au monument aux morts à 11h30, puis soirée dansante à 22h animée par le groupe Clin d'œil. " +
      "Dimanche 26 juillet : jeu de piste \"randonnée découverte du patrimoine\" en équipe (5 km) de 10h à 12h, inscription à 9h45 devant la mairie " +
      "— ouvert à tous, gratuit, avec quizz et petits lots. Buvette, petite restauration et vente de pain cuit au four communal les deux jours.",
    image: '/images/actualites/pontcirq-en-fete-1-2026.jpg',
    associations: [{ name: "FESTI'PONTCIRQ", anchor: 'assoc-festi-pontcirq' }],
  },
  {
    id: 9,
    date: '2026-07-11',
    title: 'Concert de harpe celtique à l\'église Saint-Pierre-ès-Liens',
    excerpt: "L'artiste Ronya donnera un concert de harpe celtique à l'église Saint-Pierre-ès-Liens, samedi 11 juillet à 18h.",
    content:
      "Samedi 11 juillet à 18 heures, un concert de harpe celtique sera donné à l'église Saint-Pierre-ès-Liens de Pontcirq par Ronya, " +
      "une artiste d'origine iranienne et allemande installée en Occitanie. Également chanteuse, elle propose un voyage très varié " +
      "à travers des chants traditionnels celtes, hébraïques et des compositions personnelles inspirées de la nature et de légendes. " +
      "Avec sa harpe et sa voix lumineuse, l'artiste souhaite amener le public dans un univers musical empreint de poésie, " +
      "d'émotion et de spiritualité, où chaque note invite à l'évasion et à la rêverie. Ronya s'est déjà produite dans de nombreux " +
      "lieux patrimoniaux en Occitanie ; elle sera pour la première fois dans le Lot. C'est l'occasion de découvrir une artiste singulière. " +
      "Le concert est organisé par l'association Nashuar terre vivante avec le soutien de l'association du patrimoine communal, " +
      "de la bibliothèque et de la commune de Pontcirq. Tarif : 12 €. Réservation possible sur HelloAsso.",
    image: '/images/actualites/concert-harpe-2026.JPG',
    associations: [
      { name: 'Association de Sauvegarde du Patrimoine', anchor: 'assoc-association-de-sauvegarde-du-patrimoine' },
    ],
  },
  {
    id: 10,
    date: '2026-06-14',
    title: 'Concert de gospel à l\'église Saint-Pierre',
    excerpt: "L'association pour la rénovation et la protection du patrimoine communal a organisé un concert de gospel qui a réuni un public attentif.",
    content:
      "Dimanche 14 juin après-midi, l'association pour la rénovation et la protection du patrimoine communal de Pontcirq organisait " +
      "la venue à l'église du village d'un duo de musiciens, Jean-Marie Tiam au chant et à la guitare et Daniel Alogues à la trompette, " +
      "pour un concert de musique gospel. Les deux musiciens ont amené un public attentif à parcourir l'univers et l'histoire de cette " +
      "musique populaire servie avec engagement à travers notamment l'exécution de quelques grands standards (Amazing Grace, " +
      "Joshua Fit the Battle of Jericho…). Les musiciens ont souvent entraîné le public à participer en tapant dans les mains, " +
      "dans l'esprit de la pratique des negro spirituals. Daniel Alogues, trompettiste au jeu subtil, a été très apprécié dans " +
      "l'animation de ce concert, comme dans l'accompagnement du chanteur Jean-Marie Tiam. Le public a apprécié cette après-midi " +
      "musicale, bien au frais dans l'église Saint-Pierre qui accueillait avec cette initiative un concert dont les références " +
      "chrétiennes disparaissent derrière les qualités fédératrices de cette musique.",
    image: '/images/actualites/gospel.jpg',
    associations: [
      { name: 'Association de Sauvegarde du Patrimoine', anchor: 'assoc-association-de-sauvegarde-du-patrimoine' },
    ],
  },
  {
    id: 11,
    date: '2026-06-13',
    title: "Bibs en Jeux",
    excerpt: "La bibliothèque de Pontcirq organise une après-midi jeux de société et grands jeux en bois, gratuite et ouverte à tous.",
    content:
      "Samedi 13 juin de 16h30 à 21h, la bibliothèque de Pontcirq organise \"Bibs en Jeux\" : de nombreux jeux de société, du débutant à " +
      "l'expert, animés par la boutique Guya Jeux de Sarlat et la médiathèque du Grand Cahors, ainsi que de grands jeux en bois animés par " +
      "Les jeux de l'Ours. Événement gratuit et ouvert à tous. Buvette et petite restauration (glaces, paninis, tapas) proposées par le bar " +
      "associatif La Gariotte. Contact : bibliotheque.pontcirq@gmail.com.",
    image: '/images/actualites/bibs-en-jeux-2026.jpg',
    associations: [
      { name: 'Bibliothèque de Pontcirq', anchor: 'assoc-bibliotheque-de-pontcirq' },
      { name: 'La Gariotte', anchor: 'assoc-la-gariotte-cafe-associatif-de-pontcirq' },
    ],
  },
  {
    id: 13,
    date: '2026-06-13',
    title: 'Bal-atelier de danses traditionnelles à Catus',
    excerpt: "L'association Lo Garric propose un bal-atelier de danses traditionnelles, samedi 13 juin de 21h à 23h, place de la halle à Catus.",
    content:
      "Samedi 13 juin de 21h à 23h, place de la halle à Catus, l'association Lo Garric propose un bal-atelier de danses traditionnelles, " +
      "gratuit et ouvert à tous. Le duo Lo Garric, composé de Gilles Cassagnes (cabrette et autres cornemuses) et Francis Barascou " +
      "(accordéon), animera une session de musiques du Quercy, de l'Auvergne, du Limousin et d'autres régions. Jean-Luc Laviale assurera " +
      "l'animation pour la danse.",
    image: '/images/actualites/lo-garric.webp',
    associations: [{ name: 'Lo Garric', anchor: 'assoc-lo-garric' }],
  },
  {
    id: 12,
    date: '2026-03-06',
    title: 'Séance cinéma à la salle communale',
    excerpt: "La bibliothèque de Pontcirq proposait une projection gratuite en partenariat avec le café associatif La Gariotte.",
    content:
      "Vendredi 6 mars à 20h30, la bibliothèque de Pontcirq proposait une séance cinéma à la salle communale : projection d'un film " +
      "sensible et émouvant sur l'amitié et la solidarité, inspiré d'un roman d'Anna Gavalda. Entrée gratuite. Ouverture de la buvette " +
      "à 18h30, vente de popcorns et glaces, en partenariat avec le café associatif La Gariotte.",
    image: '/images/actualites/bibli-projection-2026.jpg',
    associations: [
      { name: 'Bibliothèque de Pontcirq', anchor: 'assoc-bibliotheque-de-pontcirq' },
      { name: 'La Gariotte', anchor: 'assoc-la-gariotte-cafe-associatif-de-pontcirq' },
    ],
  },
];

export const PAGE_SIZE = 3;

const sortedActualites = [...actualites].sort((a, b) => b.date.localeCompare(a.date));

export function getPage(page: number): Actualite[] {
  const start = (page - 1) * PAGE_SIZE;
  return sortedActualites.slice(start, start + PAGE_SIZE);
}

export function getTotalPages(): number {
  return Math.ceil(sortedActualites.length / PAGE_SIZE);
}

export function getById(id: number): Actualite | undefined {
  return actualites.find((a) => a.id === id);
}
