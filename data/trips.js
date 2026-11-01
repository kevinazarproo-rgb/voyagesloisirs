// Données des voyages — source unique pour le site.
// Modifiez ce fichier puis lancez `node build.js` pour régénérer les fiches voyage.
const TRIPS = [
  {
    "slug": "chine",
    "title": "La Chine : escapade au pays du dragon",
    "country": "Chine",
    "category": "Culture & patrimoine",
    "duration": "10 jours / 9 nuits",
    "minimum": 10,
    "priceFrom": 2300,
    "excerpt": "De la Cité interdite à la Grande Muraille, découvrez trois villes et trois visages d’un même empire.",
    "highlights": [
      "Cité interdite et Temple du Ciel",
      "Grande Muraille à Mutianyu",
      "Armée en terre cuite de Xi’an",
      "Calligraphie et dégustation de thé"
    ],
    "departures": [],
    "datesNote": "Dates à confirmer auprès de l’agence.",
    "itinerary": [
      {
        "day": "Jour 1",
        "title": "Paris / Pékin",
        "text": "Envol pour Pékin et nuit à bord."
      },
      {
        "day": "Jour 2",
        "title": "Pékin",
        "text": "Accueil par votre guide francophone. Découverte des bâtiments olympiques, du Nid d’Oiseau et du Water Cube. Transfert à l’hôtel, dîner local et nuit à l’hôtel."
      },
      {
        "day": "Jour 3",
        "title": "Pékin",
        "text": "Découverte de la place Tian’anmen et du Palais impérial, puis visite du Temple du Ciel. Dégustation dans une maison de thé."
      },
      {
        "day": "Jour 4",
        "title": "Pékin – Grande Muraille",
        "text": "Excursion à la Grande Muraille, section de Mutianyu. Retour par le Palais d’Été et ses pavillons."
      },
      {
        "day": "Jour 5",
        "title": "Pékin / Xi’an",
        "text": "Visite du quartier de Gulou, puis train de nuit vers Xi’an."
      },
      {
        "day": "Jour 6",
        "title": "Xi’an",
        "text": "Découverte de l’Armée en terre cuite, puis de la Grande Pagode de l’Oie sauvage et initiation à la calligraphie."
      },
      {
        "day": "Jour 7",
        "title": "Xi’an / Shanghai",
        "text": "Promenade dans le quartier musulman et transfert vers Shanghai."
      },
      {
        "day": "Jour 8",
        "title": "Shanghai / Luzhi / Suzhou / Shanghai",
        "text": "Découverte du village d’eau de Luzhi et de Suzhou, ses jardins et ses canaux."
      },
      {
        "day": "Jour 9",
        "title": "Shanghai / Paris",
        "text": "Visite de Shanghai, du jardin Yu et du Temple du Bouddha de Jade. Transfert à l’aéroport et vol retour."
      },
      {
        "day": "Jour 10",
        "title": "Arrivée à Paris",
        "text": "Arrivée en France selon les horaires de vol."
      }
    ],
    "included": [
      "Vol international au départ de Paris, avec ou sans escale",
      "Transferts aéroport / hôtel / aéroport",
      "6 nuits en hôtel avec petits-déjeuners et 1 nuit en train",
      "Train de nuit Pékin / Xi’an en couchette molle",
      "Vol intérieur Xi’an / Shanghai",
      "Guides locaux francophones",
      "Entrées des visites mentionnées",
      "Autocar climatisé avec chauffeur",
      "Taxe de solidarité"
    ],
    "excluded": [
      "Forfait Dragon : 250 €",
      "Pourboires guides et chauffeurs",
      "Assurances facultatives",
      "Dépenses personnelles"
    ]
  },
  {
    "slug": "pologne",
    "title": "Pologne : entre capitales et héritages",
    "country": "Pologne",
    "category": "Culture & patrimoine",
    "duration": "7 jours / 6 nuits",
    "minimum": 10,
    "priceFrom": 1700,
    "excerpt": "Deux villes reliées par le train à grande vitesse pour découvrir un pays reconstruit pierre par pierre.",
    "highlights": [
      "Varsovie et Cracovie classées à l’UNESCO",
      "Mine de sel de Wieliczka",
      "Train grande vitesse Varsovie–Cracovie",
      "Guide francophone pendant le séjour"
    ],
    "departures": [
      {
        "from": "05/10/2027",
        "to": "11/10/2027",
        "price": 1750,
        "singleSupplement": 280
      }
    ],
    "datesNote": null,
    "itinerary": [
      {
        "day": "Jour 1",
        "title": "Varsovie",
        "text": "Accueil par le guide, tour panoramique de la capitale et première découverte de la vieille ville."
      },
      {
        "day": "Jour 2",
        "title": "Varsovie",
        "text": "Visite guidée de la vieille ville, du Château royal, de la place du marché et du parc Łazienki."
      },
      {
        "day": "Jour 3",
        "title": "Varsovie",
        "text": "Musée de l’Histoire des Juifs polonais POLIN et Monument des Héros du ghetto. Après-midi libre."
      },
      {
        "day": "Jour 4",
        "title": "Varsovie / Wieliczka / Cracovie",
        "text": "Train vers Cracovie et visite de la mine de sel de Wieliczka, classée à l’UNESCO."
      },
      {
        "day": "Jour 5",
        "title": "Cracovie",
        "text": "Visite de la vieille ville, de la colline du Wawel et de la place du marché."
      },
      {
        "day": "Jour 6",
        "title": "Cracovie / Auschwitz / Cracovie",
        "text": "Visite du site mémorial d’Auschwitz-Birkenau, puis découverte du quartier de Kazimierz."
      },
      {
        "day": "Jour 7",
        "title": "Cracovie / Paris",
        "text": "Temps libre puis transfert à l’aéroport pour le vol retour."
      }
    ],
    "included": [
      "Vol international au départ de Paris",
      "Transferts aéroport / hôtel / aéroport",
      "Logement en hôtels 3 étoiles",
      "Pension complète",
      "Train grande vitesse Varsovie–Cracovie en 2e classe",
      "Guide accompagnateur francophone",
      "Audioguides du 2e au 6e jour",
      "Entrées mentionnées au programme"
    ],
    "excluded": [
      "Forfait Chopin : 70 € par personne",
      "Boissons et dépenses personnelles",
      "Pourboires guide et chauffeur",
      "Assurances facultatives"
    ]
  },
  {
    "slug": "panama",
    "title": "Le Panama : trait d’union des Amériques",
    "country": "Panama",
    "category": "Nature & découverte",
    "duration": "10 jours / 9 nuits",
    "minimum": null,
    "priceFrom": 3500,
    "excerpt": "Un canal légendaire, une jungle vivante et deux océans : un voyage entre nature et culture.",
    "highlights": [
      "Écluses de Miraflores et canal de Panama",
      "Rencontre avec la communauté Emberá",
      "Île de Taboga",
      "3 nuits en tout inclus face au Pacifique"
    ],
    "departures": [
      {
        "from": "13/02/2027",
        "to": "22/02/2027",
        "price": 3650,
        "singleSupplement": 550
      },
      {
        "from": "13/11/2027",
        "to": "22/11/2027",
        "price": 3500,
        "singleSupplement": 525
      }
    ],
    "datesNote": null,
    "itinerary": [
      {
        "day": "Jour 1",
        "title": "Arrivée à Panama",
        "text": "Accueil à l’aéroport de Tocumen et transfert privé. Installation à l’hôtel et dîner libre."
      },
      {
        "day": "Jour 2",
        "title": "Panama – la ville et le canal",
        "text": "Panorama de la ville moderne, marché de fruits de mer, découverte du Casco Viejo et des écluses de Miraflores."
      },
      {
        "day": "Jour 3",
        "title": "San Lorenzo & Agua Clara",
        "text": "Découverte de la côte caraïbe, du patrimoine de San Lorenzo et des écluses d’Agua Clara."
      },
      {
        "day": "Jour 4",
        "title": "Communauté indigène Emberá",
        "text": "Remontée de la rivière Chagres en pirogue et rencontre avec la communauté Emberá."
      },
      {
        "day": "Jour 5",
        "title": "Soberanía & lac Gatún",
        "text": "Parc national de Soberanía, promenade en bateau sur le lac Gatún et observation de la faune."
      },
      {
        "day": "Jour 6",
        "title": "Panama, journée libre",
        "text": "Journée libre pour profiter du resort et de la formule tout inclus."
      },
      {
        "day": "Jour 7",
        "title": "Ferme d’ananas & El Valle",
        "text": "Découverte d’une ferme d’ananas puis route vers El Valle de Antón et son village installé dans un cratère volcanique."
      },
      {
        "day": "Jour 8",
        "title": "El Valle / Santa Clara",
        "text": "Découverte du marché artisanal et transfert vers la côte Pacifique."
      },
      {
        "day": "Jour 9",
        "title": "Santa Clara",
        "text": "Journée libre pour profiter du resort et de la formule tout inclus."
      },
      {
        "day": "Jour 10",
        "title": "Santa Clara / départ",
        "text": "Petit-déjeuner, transfert à l’aéroport et vol retour."
      }
    ],
    "included": [
      "Vol international au départ de Paris avec escale",
      "Hébergements mentionnés",
      "Guide francophone les jours 2, 3, 4, 5, 7 et 8",
      "Demi-pension et déjeuners inclus certains jours",
      "Excursions, visites et entrées aux parcs nationaux",
      "Transferts en véhicule privé et en bateau"
    ],
    "excluded": [
      "Forfait Jungle : 350 € par personne",
      "Assurances",
      "Pourboires",
      "Boissons"
    ]
  },
  {
    "slug": "crete",
    "title": "La Crète éternelle",
    "country": "Grèce",
    "category": "Culture & soleil",
    "duration": "8 jours / 7 nuits",
    "minimum": 10,
    "priceFrom": 1850,
    "excerpt": "Palais minoens, gorges et monastères : d’Héraklion à Spinalonga, découvrez le berceau d’une civilisation.",
    "highlights": [
      "Knossos et le musée d’Héraklion",
      "Forteresse de Spinalonga",
      "Leçon de cuisine crétoise à Thronos",
      "Dégustation de vins au monastère d’Agia Triada"
    ],
    "departures": [
      {
        "from": "08/10/2027",
        "to": "15/10/2027",
        "price": 1850,
        "singleSupplement": 250
      }
    ],
    "datesNote": null,
    "itinerary": [
      {
        "day": "Jour 1",
        "title": "Arrivée en Crète",
        "text": "Accueil à l’aéroport d’Héraklion, transfert à l’hôtel et temps libre."
      },
      {
        "day": "Jour 2",
        "title": "Armeni / Kourtaliotiko / Plakias / Réthymnon",
        "text": "Découverte de sites minoens, des gorges de Kourtaliotiko et de la ville de Réthymnon."
      },
      {
        "day": "Jour 3",
        "title": "Jardin botanique / Agia Triada / La Canée",
        "text": "Balade au jardin botanique, visite du monastère d’Agia Triada et découverte de La Canée."
      },
      {
        "day": "Jour 4",
        "title": "Arkadi / Thronos / Margarites",
        "text": "Visite du monastère d’Arkadi, leçon de cuisine crétoise et découverte d’artisans potiers."
      },
      {
        "day": "Jour 5",
        "title": "Héraklion / Archanes / Knossos",
        "text": "Découverte d’Héraklion, de ses trésors archéologiques et du palais de Knossos."
      },
      {
        "day": "Jour 6",
        "title": "Gortyne / Messara / Matala",
        "text": "Découverte de Gortyne, de la plaine de Messara et du village côtier de Matala."
      },
      {
        "day": "Jour 7",
        "title": "Kritsa / Lato / Spinalonga",
        "text": "Visite de Kritsa et de Lato, puis découverte de l’île forteresse de Spinalonga."
      },
      {
        "day": "Jour 8",
        "title": "Héraklion / Paris",
        "text": "Temps libre selon l’horaire du vol, transfert à l’aéroport et retour en France."
      }
    ],
    "included": [
      "Vol aller-retour au départ de Paris",
      "Taxes d’aéroport",
      "Transferts aéroport / hôtel / aéroport",
      "7 nuits en hôtel, chambre double",
      "Les repas mentionnés au programme",
      "Guide francophone pendant le circuit",
      "Transport en autocar climatisé",
      "Entrées et visites mentionnées"
    ],
    "excluded": [
      "Taxe de séjour à régler sur place",
      "Repas et boissons non mentionnés",
      "Pourboires",
      "Assurances annulation et assistance",
      "Dépenses personnelles"
    ]
  },
  {
    "slug": "chateau-avesnes",
    "title": "Le Château d’Avesnes – Le Castelet",
    "country": "Normandie, France",
    "category": "Escapade & détente",
    "duration": "2 jours / 1 nuit",
    "minimum": null,
    "priceFrom": null,
    "excerpt": "Un château de 1862 au cœur de 18 hectares de nature, à 1 h 30 de Paris.",
    "highlights": [
      "Parc, verger et forêt sur 18 hectares",
      "Spa et détente",
      "Table d’hôtes et produits locaux",
      "Gournay-en-Bray et villages de Normandie à proximité"
    ],
    "departures": [],
    "datesNote": null,
    "itinerary": [
      {
        "day": "Jour 1",
        "title": "Arrivée au Castelet",
        "text": "Installation et découverte du domaine, de ses jardins et des environs."
      },
      {
        "day": "Jour 2",
        "title": "Nature et patrimoine",
        "text": "Profitez du domaine et découvrez les villages, jardins et sites patrimoniaux alentour."
      }
    ],
    "included": [
      "Séjour au Château d’Avesnes selon la formule choisie"
    ],
    "excluded": [
      "Tarifs et prestations à confirmer auprès de l’agence"
    ]
  }
];
if (typeof module !== "undefined") module.exports = TRIPS;
