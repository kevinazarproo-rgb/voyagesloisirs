export type Departure = { from: string; to: string; price: number; singleSupplement?: number };
export type Trip = {
  slug: string; title: string; country: string; category: string; duration: string;
  priceFrom: number | null; minimumPeople?: number; image: string; excerpt: string;
  dates: Departure[]; highlights: string[]; included: string[]; notIncluded: string[];
  itinerary: { day: string; title: string; description: string }[];
};

export const trips: Trip[] = [
  {
    slug: "chine", title: "La Chine : escapade au pays du dragon", country: "Chine", category: "Culture & patrimoine",
    duration: "10 jours / 9 nuits", priceFrom: 2300, minimumPeople: 10,
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1600&q=85",
    excerpt: "De la Cité interdite à la Grande Muraille, découvrez trois villes et trois visages d'un même empire.",
    dates: [],
    highlights: ["Cité interdite et Temple du Ciel", "Grande Muraille à Mutianyu", "Armée en terre cuite de Xi'an", "Calligraphie et dégustation de thé"],
    included: ["Vol international au départ de Paris avec ou sans escale", "Transferts aéroport / hôtel / aéroport", "6 nuits en hôtel avec petits-déjeuners + 1 nuit en train", "Train de nuit Pékin / Xi'an en couchette molle", "Vol intérieur Xi'an / Shanghai", "Guides locaux francophones", "Entrées des visites mentionnées", "Autocar climatisé avec chauffeur", "Taxe de solidarité"],
    notIncluded: ["Forfait Dragon : 250 €", "Pourboires guides et chauffeurs", "Assurances facultatives", "Dépenses personnelles"],
    itinerary: [
      {day:"Jour 1",title:"Paris / Pékin",description:"Envol pour Pékin et nuit à bord."},
      {day:"Jour 2",title:"Pékin",description:"Accueil par votre guide francophone. Découverte des bâtiments olympiques, du Nid d'Oiseau et du Water Cube. Transfert à l'hôtel, dîner local et nuit à l'hôtel."},
      {day:"Jour 3",title:"Pékin",description:"Découverte de la place Tian'anmen et du Palais impérial, puis visite du Temple du Ciel. Dégustation dans une maison de thé."},
      {day:"Jour 4",title:"Pékin – Grande Muraille",description:"Excursion à la Grande Muraille, section de Mutianyu. Retour par le Palais d'Été et ses pavillons."},
      {day:"Jour 5",title:"Pékin / Xi'an",description:"Visite du quartier de Gulou, puis train de nuit vers Xi'an."},
      {day:"Jour 6",title:"Xi'an",description:"Découverte de l'Armée en terre cuite, puis de la Grande Pagode de l'Oie sauvage et initiation à la calligraphie."},
      {day:"Jour 7",title:"Xi'an / Shanghai",description:"Promenade dans le quartier musulman et transfert vers Shanghai."},
      {day:"Jour 8",title:"Shanghai / Luzhi / Suzhou / Shanghai",description:"Découverte du village d'eau de Luzhi et de Suzhou, ses jardins et ses canaux."},
      {day:"Jour 9",title:"Shanghai / Paris",description:"Visite de Shanghai, du jardin Yu et du Temple du Bouddha de Jade. Transfert à l'aéroport et vol retour."},
      {day:"Jour 10",title:"Arrivée à Paris",description:"Arrivée en France selon les horaires de vol."}
    ]
  },
  {
    slug: "pologne", title: "Pologne : entre capitales et héritages", country: "Pologne", category: "Culture & patrimoine",
    duration: "7 jours / 6 nuits", priceFrom: 1700, minimumPeople: 10,
    image: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=1600&q=85",
    excerpt: "Deux villes reliées par le train à grande vitesse pour découvrir un pays reconstruit pierre par pierre.",
    dates: [{from:"05/10/2027",to:"11/10/2027",price:1750,singleSupplement:280}],
    highlights: ["Varsovie et Cracovie classées à l'UNESCO", "Mine de sel de Wieliczka", "Train grande vitesse Varsovie–Cracovie", "Guide francophone pendant le séjour"],
    included: ["Vol international au départ de Paris", "Transferts aéroport / hôtel / aéroport", "Logement en hôtels 3*", "Pension complète", "Train grande vitesse Varsovie–Cracovie en 2e classe", "Guide accompagnateur francophone", "Audioguides du 2e au 6e jour", "Entrées mentionnées au programme"],
    notIncluded: ["Forfait Chopin : 70 € par personne", "Boissons et dépenses personnelles", "Pourboires guide et chauffeur", "Assurances facultatives"],
    itinerary: [
      {day:"Jour 1",title:"Varsovie",description:"Accueil par le guide, tour panoramique de la capitale et première découverte de la vieille ville."},
      {day:"Jour 2",title:"Varsovie",description:"Visite guidée de la vieille ville, du Château royal, de la place du marché et du parc Łazienki."},
      {day:"Jour 3",title:"Varsovie",description:"Musée de l'Histoire des Juifs polonais POLIN et Monument des Héros du ghetto. Après-midi libre."},
      {day:"Jour 4",title:"Varsovie / Wieliczka / Cracovie",description:"Train vers Cracovie et visite de la mine de sel de Wieliczka, classée à l'UNESCO."},
      {day:"Jour 5",title:"Cracovie",description:"Visite de la vieille ville, de la colline du Wawel et de la place du marché."},
      {day:"Jour 6",title:"Cracovie / Auschwitz / Cracovie",description:"Visite du site mémorial d'Auschwitz-Birkenau, puis découverte du quartier de Kazimierz."},
      {day:"Jour 7",title:"Cracovie / Paris",description:"Temps libre puis transfert à l'aéroport pour le vol retour."}
    ]
  },
  {
    slug: "panama", title: "Le Panama : trait d'union des Amériques", country: "Panama", category: "Nature & découverte",
    duration: "10 jours / 9 nuits", priceFrom: 3500,
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1600&q=85",
    excerpt: "Un canal légendaire, une jungle vivante et deux océans : un voyage entre nature et culture.",
    dates: [{from:"13/02/2027",to:"22/02/2027",price:3650,singleSupplement:550},{from:"13/11/2027",to:"22/11/2027",price:3500,singleSupplement:525}],
    highlights: ["Écluses de Miraflores et canal de Panama", "Rencontre avec la communauté Emberá", "Île de Taboga", "3 nuits en tout inclus face au Pacifique"],
    included: ["Vol international au départ de Paris avec escale", "Hébergements mentionnés", "Guide francophone les jours 2, 3, 4, 5, 7 et 8", "Demi-pension et déjeuners inclus certains jours", "Excursions, visites et entrées aux parcs nationaux", "Transferts en véhicule privé et en bateau"],
    notIncluded: ["Forfait Jungle : 350 € par personne", "Assurances", "Pourboires", "Boissons"],
    itinerary: [
      {day:"Jour 1",title:"Arrivée à Panama",description:"Accueil à l'aéroport de Tocumen et transfert privé. Installation à l'hôtel et dîner libre."},
      {day:"Jour 2",title:"Panama – La ville et le canal",description:"Panorama de la ville moderne, marché de fruits de mer, découverte du Casco Viejo et des écluses de Miraflores."},
      {day:"Jour 3",title:"San Lorenzo & Agua Clara",description:"Découverte de la côte caraïbe, du patrimoine de San Lorenzo et des écluses d'Agua Clara."},
      {day:"Jour 4",title:"Communauté indigène Emberá",description:"Remontée de la rivière Chagres en pirogue et rencontre avec la communauté Emberá."},
      {day:"Jour 5",title:"Soberanía & lac Gatún",description:"Parc national de Soberanía, promenade en bateau sur le lac Gatún et observation de la faune."},
      {day:"Jour 6",title:"Panama, journée libre",description:"Journée libre pour profiter du resort et de la formule tout inclus."},
      {day:"Jour 7",title:"Ferme d'ananas & El Valle",description:"Découverte d'une ferme d'ananas puis route vers El Valle de Antón et son village installé dans un cratère volcanique."},
      {day:"Jour 8",title:"El Valle / Santa Clara",description:"Découverte du marché artisanal et transfert vers la côte Pacifique."},
      {day:"Jour 9",title:"Santa Clara",description:"Journée libre pour profiter du resort et de la formule tout inclus."},
      {day:"Jour 10",title:"Santa Clara / Départ",description:"Petit-déjeuner, transfert à l'aéroport et vol retour."}
    ]
  },
  {
    slug: "chateau-avesnes", title: "Le Château d'Avesnes – Le Castelet", country: "Normandie, France", category: "Escapade & détente",
    duration: "2 jours / 1 nuit", priceFrom: null,
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=85",
    excerpt: "Un château de 1862 au cœur de 18 hectares de nature, à 1 h 30 de Paris.", dates: [],
    highlights: ["Parc, verger et forêt sur 18 hectares", "Spa et détente", "Table d'hôtes et produits locaux", "Gournay-en-Bray et villages de Normandie à proximité"],
    included: ["Séjour au Château d'Avesnes selon formule choisie"], notIncluded: ["Tarifs et prestations à confirmer auprès de l'agence"],
    itinerary: [
      {day:"Jour 1",title:"Arrivée au Castelet",description:"Installation et découverte du domaine, de ses jardins et des environs."},
      {day:"Jour 2",title:"Nature et patrimoine",description:"Profitez du domaine et découvrez les villages, jardins et sites patrimoniaux alentour."}
    ]
  },
  {
    slug: "crete", title: "La Crète éternelle", country: "Grèce", category: "Culture & soleil",
    duration: "8 jours / 7 nuits", priceFrom: 1850, minimumPeople: 10,
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=85",
    excerpt: "Palais minoens, gorges et monastères : d'Héraklion à Spinalonga, découvrez le berceau d'une civilisation.",
    dates: [{from:"08/10/2027",to:"15/10/2027",price:1850,singleSupplement:250}],
    highlights: ["Knossos et le musée d'Héraklion", "Forteresse de Spinalonga", "Leçon de cuisine crétoise à Thronos", "Dégustation de vins au monastère d'Agia Triada"],
    included: ["Vol aller-retour au départ de Paris", "Taxes d'aéroport", "Transferts aéroport / hôtel / aéroport", "7 nuits en hôtel, chambre double", "Les repas mentionnés au programme", "Guide francophone pendant le circuit", "Transport en autocar climatisé", "Entrées et visites mentionnées"],
    notIncluded: ["Taxe de séjour à régler sur place", "Repas et boissons non mentionnés", "Pourboires", "Assurances annulation et assistance", "Dépenses personnelles"],
    itinerary: [
      {day:"Jour 1",title:"Arrivée en Crète",description:"Accueil à l'aéroport d'Héraklion, transfert à l'hôtel et temps libre."},
      {day:"Jour 2",title:"Armeni / Kourtaliotiko / Plakias / Réthymnon",description:"Découverte de sites minoens, des gorges de Kourtaliotiko et de la ville de Réthymnon."},
      {day:"Jour 3",title:"Jardin botanique / Agia Triada / La Canée",description:"Balade au jardin botanique, visite du monastère d'Agia Triada et découverte de La Canée."},
      {day:"Jour 4",title:"Arkadi / Thronos / Margarites",description:"Visite du monastère d'Arkadi, leçon de cuisine crétoise et découverte d'artisans potiers."},
      {day:"Jour 5",title:"Héraklion / Archanes / Knossos",description:"Découverte d'Héraklion, de ses trésors archéologiques et du palais de Knossos."},
      {day:"Jour 6",title:"Gortyne / Messara / Matala",description:"Découverte de Gortyne, de la plaine de Messara et du village côtier de Matala."},
      {day:"Jour 7",title:"Kritsa / Lato / Spinalonga",description:"Visite de Kritsa et de Lato, puis découverte de l'île forteresse de Spinalonga."},
      {day:"Jour 8",title:"Héraklion / Paris",description:"Temps libre selon l'horaire du vol, transfert à l'aéroport et retour en France."}
    ]
  }
];
