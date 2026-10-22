// Town-hall contact details, shared by the home page, /mairie and the footer.

export const address = {
  label: 'Le Bourg, 46150 Pontcirq',
  href: 'geo:44.5476,1.2628?q=Le+Bourg%2C+46150+Pontcirq',
};

export const phone = {
  label: '05 65 36 24 78',
  href: 'tel:+33565362478',
};

export const email = {
  label: 'mairie.de.pontcirq@wanadoo.fr',
  href: 'mailto:mairie.de.pontcirq@wanadoo.fr',
};

export const CLOSED = 'Fermé';

export const hours = [
  { day: 'Lundi', label: CLOSED },
  { day: 'Mardi', label: '14h – 17h' },
  { day: 'Mercredi', label: CLOSED },
  { day: 'Jeudi', label: CLOSED },
  { day: 'Vendredi', label: '9h – 12h' },
];

export const openingHours = hours.filter((h) => h.label !== CLOSED);

// National emergency numbers (France / EU).
export const emergencyNumbers = [
  { number: '15', label: 'SAMU', href: 'tel:15' },
  { number: '17', label: 'Police / Gendarmerie', href: 'tel:17' },
  { number: '18', label: 'Pompiers', href: 'tel:18' },
  { number: '112', label: 'Urgence européenne', href: 'tel:112' },
];
