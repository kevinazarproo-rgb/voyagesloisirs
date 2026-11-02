/*
  Le Carnet d’itinéraires — N° 1 · Voyages Loisirs by Aya
  ---------------------------------------------------------
  DONNÉES DES VOYAGES : c’est la source unique du site.
  Tout ce qui s’affiche dans les chapitres (voyages/*.html), le sommaire,
  le calendrier et les formulaires vient d’ici.

  COMMENT MODIFIER (pour l’agence)
  1. Une date ou un prix : dans « departures » du voyage concerné, changez
     « from », « to » (format JJ/MM/AAAA), « iso » (AAAA-MM-JJ, pour les liens
     « Demander cette date »), « price » et « singleSupplement » (nombres sans
     espace ni symbole), puis mettez à jour le libellé « libelle » et les textes
     courts « datesCourt » et « ficheTechnique ». Pour ajouter un départ, copiez
     un bloc existant. Pour la Chine, quand les dates seront fixées : remplissez
     « departures », passez « periode » à ["automne"] ou ["hiver"], et remplacez
     « datesEncadre » par null.
  2. Un texte : modifiez la chaîne entre guillemets droits " ". Les guillemets
     français « », les apostrophes ’ et les espaces insécables (avant ? ! ; : et
     dans les nombres) sont déjà en place : copiez-collez un passage existant
     pour les conserver. Les mentions [à confirmer par l’agence] restent telles
     quelles jusqu’à validation.
  3. Une photo : « id » est l’identifiant Unsplash (la partie « photo-… » de
     l’adresse de l’image). Quand « id » vaut null, la page affiche un
     emplacement avec couleur de secours et légende ; « aChercher » donne les
     mots-clés de recherche et « repli » l’identifiant réutilisé en attendant
     (null = aplat de couleur).
  4. Ensuite, dans un terminal, à la racine du site :
        node scripts/build-chapitres.mjs
     Le script régénère les cinq pages voyages/<slug>.html. Commitez-les.

  STRUCTURE D’UN VOYAGE (champs ajoutés pour la revue)
  - numero, horsSerie, rubrique, pays, lieux, titreCourt : sommaire et titres courants.
  - papier, fond : teinte de papier du chapitre et couleur de secours des photos.
  - suivant, precedent : enchaînement circulaire 01 → 02 → 03 → 04 → 01
    (le hors-série n’est pas dans la boucle).
  - periode : filtre du sommaire complet ("hiver", "automne", "toute-l-annee",
    "en-preparation"). datesCourt, ficheTechnique, prixCourt : textes courts.
  - chapeau, reperes (4), aSavoir, journeeType, recit (un élément par jour,
    « sobre: true » = jour sans photo, sans exergue, sans animation),
    exergue ({ apres: n° du jour, texte }), images, faq (3), notesComptoir, seo.
  Le fichier se charge dans le navigateur (<script src="data/trips.js"> définit
  TRIPS) et dans Node (module.exports).
*/
const TRIPS = [
  {
    slug: "chine",
    title: "La Chine : escapade au pays du dragon",
    country: "Chine",
    category: "Culture & patrimoine",
    duration: "10 jours / 9 nuits",
    minimum: 10,
    priceFrom: 2300,
    excerpt: "De la Cité interdite à la Grande Muraille, découvrez trois villes et trois visages d’un même empire.",
    highlights: [
      "Cité interdite et Temple du Ciel",
      "Grande Muraille à Mutianyu",
      "Armée en terre cuite de Xi’an",
      "Calligraphie et dégustation de thé"
    ],
    departures: [],
    datesNote: "Dates à confirmer auprès de l’agence.",
    itinerary: [
      { day: "Jour 1", title: "Paris / Pékin", text: "Envol pour Pékin et nuit à bord." },
      { day: "Jour 2", title: "Pékin", text: "Accueil par votre guide francophone. Découverte des bâtiments olympiques, du Nid d’Oiseau et du Water Cube. Transfert à l’hôtel, dîner local et nuit à l’hôtel." },
      { day: "Jour 3", title: "Pékin", text: "Découverte de la place Tian’anmen et du Palais impérial, puis visite du Temple du Ciel. Dégustation dans une maison de thé." },
      { day: "Jour 4", title: "Pékin – Grande Muraille", text: "Excursion à la Grande Muraille, section de Mutianyu. Retour par le Palais d’Été et ses pavillons." },
      { day: "Jour 5", title: "Pékin / Xi’an", text: "Visite du quartier de Gulou, puis train de nuit vers Xi’an." },
      { day: "Jour 6", title: "Xi’an", text: "Découverte de l’Armée en terre cuite, puis de la Grande Pagode de l’Oie sauvage et initiation à la calligraphie." },
      { day: "Jour 7", title: "Xi’an / Shanghai", text: "Promenade dans le quartier musulman et transfert vers Shanghai." },
      { day: "Jour 8", title: "Shanghai / Luzhi / Suzhou / Shanghai", text: "Découverte du village d’eau de Luzhi et de Suzhou, ses jardins et ses canaux." },
      { day: "Jour 9", title: "Shanghai / Paris", text: "Visite de Shanghai, du jardin Yu et du Temple du Bouddha de Jade. Transfert à l’aéroport et vol retour." },
      { day: "Jour 10", title: "Arrivée à Paris", text: "Arrivée en France selon les horaires de vol." }
    ],
    included: [
      "Vol international au départ de Paris, avec ou sans escale",
      "Transferts aéroport / hôtel / aéroport",
      "6 nuits en hôtel avec petits-déjeuners et 1 nuit en train",
      "Train de nuit Pékin / Xi’an en couchette molle",
      "Vol intérieur Xi’an / Shanghai",
      "Guides locaux francophones",
      "Entrées des visites mentionnées",
      "Autocar climatisé avec chauffeur",
      "Taxe de solidarité"
    ],
    excluded: [
      "Forfait Dragon : 250 € par personne",
      "Pourboires guides et chauffeurs",
      "Assurances facultatives",
      "Dépenses personnelles"
    ],

    /* — Revue — */
    numero: "01",
    horsSerie: false,
    rubrique: "Culture & patrimoine",
    pays: "Chine",
    lieux: "Pékin, Mutianyu, Xi’an, Shanghai, Suzhou",
    titreCourt: "La Chine",
    papier: "var(--papier-chine)",
    fond: "#6b3b2a",
    suivant: "pologne",
    precedent: "crete",
    periode: ["en-preparation"],
    datesCourt: "dates en préparation",
    prixCourt: "dès 2 300 €",
    ficheTechnique: "10 jours / 9 nuits · dès 10 personnes · guide francophone · dates 2027 en préparation",
    datesEncadre: "Les dates 2027 sont en préparation. Laissez-nous vos coordonnées : nous vous prévenons en premier, et vous décidez ensuite.",
    recitTitre: "Dix jours, racontés dans l’ordre",
    chapeau: "Trois villes, trois visages d’un même empire : Pékin et ses palais, Xi’an et ses soldats d’argile, Shanghai et ses jardins. Entre les deux premières, une nuit de train.",
    reperes: [
      "Cité interdite et Temple du Ciel",
      "Grande Muraille, section de Mutianyu",
      "Armée en terre cuite de Xi’an",
      "Calligraphie et dégustation de thé"
    ],
    aSavoir: "Forfait Dragon : 250 € par personne, réglé sur place. Il couvre des prestations locales ; nous l’écrivons ici pour que personne ne le découvre à l’arrivée. Visa : nécessaire pour la plupart des ressortissants français ; l’agence vous indique la marche à suivre à l’inscription. [À confirmer par l’agence.]",
    journeeType: {
      jour: 4,
      titre: "La Muraille, côté calme",
      etapes: [
        { h: "07 h 30", t: "Petit-déjeuner à l’hôtel", fort: false },
        { h: "08 h 30", t: "Départ en autocar climatisé, votre guide est à bord", fort: false },
        { h: "10 h 00", t: "Arrivée à Mutianyu, à 70 km au nord de Pékin", fort: false },
        { h: "10 h 15", t: "Montée (télécabine possible) et marche sur la Muraille, à votre rythme", fort: true },
        { h: "12 h 30", t: "Déjeuner", fort: false },
        { h: "14 h 30", t: "Palais d’Été et ses pavillons au bord du lac", fort: false },
        { h: "17 h 30", t: "Retour à l’hôtel", fort: false },
        { h: "19 h 30", t: "Dîner", fort: false }
      ]
    },
    recit: [
      { jour: 1, lieu: "Paris", intertitre: "Le départ", texte: "Rendez-vous à l’aéroport, groupe au complet, guide au bout du fil. Envol pour Pékin et nuit à bord.", notes: ["Nuit en vol"] },
      { jour: 2, lieu: "Pékin", intertitre: "Première soirée dans la capitale", texte: "Votre guide francophone vous attend à l’arrivée. On traverse le parc olympique, le Nid d’Oiseau et le Water Cube avant de poser les valises. Dîner local, première nuit en Chine.", notes: ["Hôtel", "Dîner"] },
      { jour: 3, lieu: "Pékin", intertitre: "La place, le palais, le thé", texte: "Tian’anmen au matin, immense, puis la Cité interdite, cour après cour. L’après-midi, le Temple du Ciel et ses allées où l’on joue aux cartes. On termine dans une maison de thé, à goûter plutôt qu’à acheter.", notes: ["Hôtel"] },
      { jour: 4, lieu: "Mutianyu", intertitre: "La Muraille, côté calme", texte: "Mutianyu est la section que choisissent ceux qui veulent marcher sans foule. On monte, on souffle, on regarde la ligne de pierre courir sur les crêtes. Retour par le Palais d’Été et ses pavillons au bord du lac.", notes: ["Autocar climatisé", "Hôtel"] },
      { jour: 5, lieu: "Pékin → Xi’an", intertitre: "Pékin – Xi’an, en couchette molle", texte: "Le quartier de Gulou l’après-midi, puis la gare. Douze heures de train, une couverture, le thé dans un gobelet en inox. Au réveil, la plaine du Shaanxi.", notes: ["Train de nuit, couchette molle", "Petit sac pour la nuit"] },
      { jour: 6, lieu: "Xi’an", intertitre: "Huit mille soldats", texte: "L’Armée en terre cuite, fosse après fosse, avec le guide qui explique ce qu’on regarde. Puis la Grande Pagode de l’Oie sauvage et une initiation à la calligraphie : un pinceau, de l’encre, un caractère.", notes: ["Hôtel"] },
      { jour: 7, lieu: "Xi’an → Shanghai", intertitre: "Le quartier musulman, puis l’avion", texte: "Promenade dans le quartier musulman, ses étals et ses brochettes, avant le vol intérieur pour Shanghai.", notes: ["Vol intérieur", "Hôtel"] },
      { jour: 8, lieu: "Luzhi, Suzhou", intertitre: "Les villages d’eau", texte: "Luzhi, ses canaux et ses ponts de pierre ; Suzhou, ses jardins où chaque fenêtre cadre un paysage. Retour à Shanghai le soir.", notes: ["Autocar", "Hôtel"] },
      { jour: 9, lieu: "Shanghai → Paris", intertitre: "Le jardin Yu et le Bouddha de jade", texte: "Dernière matinée : le jardin Yu, le Temple du Bouddha de Jade, un dernier thé. Transfert à l’aéroport et vol retour.", notes: ["Nuit en vol"] },
      { jour: 10, lieu: "Paris", intertitre: "Arrivée", texte: "Arrivée en France selon les horaires de vol.", notes: [] }
    ],
    exergue: { apres: 5, texte: "Douze heures de train, une couverture, le thé dans un gobelet en inox. Au réveil, la plaine du Shaanxi." },
    images: {
      ouverture: {
        id: "photo-1508804185872-d7badad00f7d",
        legende: "Section de Mutianyu, Grande Muraille — jour 4. Photo : Unsplash",
        alt: "Section de Mutianyu de la Grande Muraille sous un ciel clair",
        fond: "var(--fond-chine)"
      },
      recit: [
        {
          apres: 4,
          id: null,
          aChercher: "Mutianyu Great Wall autumn",
          repli: "photo-1508804185872-d7badad00f7d",
          legende: "Grande Muraille, section de Mutianyu — jour 4. Photo : Unsplash",
          alt: "La Grande Muraille à Mutianyu, courant sur les crêtes boisées",
          fond: "var(--fond-chine)"
        },
        {
          apres: 6,
          id: null,
          aChercher: "Terracotta Army Xi’an pit (candidat à vérifier : photo-1536599018102-9f803c140fc1)",
          repli: null,
          legende: "Armée en terre cuite, Xi’an — jour 6.",
          alt: "Rangées de soldats de l’Armée en terre cuite dans leur fosse, à Xi’an",
          fond: "var(--fond-chine)"
        }
      ]
    },
    faq: [
      { q: "Faut-il un visa ?", r: "Oui pour la plupart des ressortissants français ; l’agence vous indique la marche à suivre à l’inscription. [À confirmer.]" },
      { q: "Comment se passe la nuit en train ?", r: "En couchette molle, compartiment de quatre, literie fournie. Prévoyez un petit sac pour la nuit, la valise voyage en soute du wagon." },
      { q: "Y a-t-il beaucoup de marche ?", r: "Oui : Pékin se visite à pied, et la Muraille monte. De bonnes chaussures, et un bâton si vous en avez l’habitude." }
    ],
    notesComptoir: [
      "Forfait Dragon : 250 € par personne, réglé sur place. Nous l’écrivons ici pour que personne ne le découvre à l’arrivée.",
      "Les dates 2027 sont en préparation : laissez-nous vos coordonnées, nous vous prévenons en premier.",
      "Chambre seule : [à confirmer par l’agence]."
    ],
    seo: {
      title: "La Chine : escapade au pays du dragon — 10 jours dès 2 300 € · Voyages Loisirs by Aya",
      description: "Trois villes, trois visages d’un même empire : Pékin et ses palais, Xi’an et ses soldats d’argile, Shanghai et ses jardins. Entre les deux premières, une nuit de train. Circuit accompagné de 10 jours, dès 2 300 €, guide francophone."
    }
  },

  {
    slug: "pologne",
    title: "Pologne : entre capitales et héritages",
    country: "Pologne",
    category: "Culture & patrimoine",
    duration: "7 jours / 6 nuits",
    minimum: 10,
    priceFrom: 1700,
    excerpt: "Deux villes reliées par le train à grande vitesse pour découvrir un pays reconstruit pierre par pierre.",
    highlights: [
      "Varsovie et Cracovie classées à l’UNESCO",
      "Mine de sel de Wieliczka",
      "Train grande vitesse Varsovie–Cracovie",
      "Guide francophone pendant le séjour"
    ],
    departures: [
      { from: "05/10/2027", to: "11/10/2027", iso: "2027-10-05", price: 1750, singleSupplement: 280, libelle: "05 → 11 octobre 2027 — 1 750 € par personne" }
    ],
    datesNote: null,
    itinerary: [
      { day: "Jour 1", title: "Varsovie", text: "Accueil par le guide, tour panoramique de la capitale et première découverte de la vieille ville." },
      { day: "Jour 2", title: "Varsovie", text: "Visite guidée de la vieille ville, du Château royal, de la place du marché et du parc Łazienki." },
      { day: "Jour 3", title: "Varsovie", text: "Musée de l’Histoire des Juifs polonais POLIN et Monument des Héros du ghetto. Après-midi libre." },
      { day: "Jour 4", title: "Varsovie / Wieliczka / Cracovie", text: "Train vers Cracovie et visite de la mine de sel de Wieliczka, classée à l’UNESCO." },
      { day: "Jour 5", title: "Cracovie", text: "Visite de la vieille ville, de la colline du Wawel et de la place du marché." },
      { day: "Jour 6", title: "Cracovie / Auschwitz / Cracovie", text: "Visite du site mémorial d’Auschwitz-Birkenau, puis découverte du quartier de Kazimierz." },
      { day: "Jour 7", title: "Cracovie / Paris", text: "Temps libre puis transfert à l’aéroport pour le vol retour." }
    ],
    included: [
      "Vol international au départ de Paris",
      "Transferts aéroport / hôtel / aéroport",
      "Logement en hôtels 3 étoiles",
      "Pension complète",
      "Train grande vitesse Varsovie–Cracovie en 2e classe",
      "Guide accompagnateur francophone",
      "Audioguides du 2e au 6e jour",
      "Entrées mentionnées au programme"
    ],
    excluded: [
      "Forfait Chopin : 70 € par personne",
      "Boissons et dépenses personnelles",
      "Pourboires guide et chauffeur",
      "Assurances facultatives"
    ],

    /* — Revue — */
    numero: "02",
    horsSerie: false,
    rubrique: "Culture & patrimoine",
    pays: "Pologne",
    lieux: "Varsovie, Wieliczka, Cracovie",
    titreCourt: "Pologne",
    papier: "var(--papier-pologne)",
    fond: "#3d4a5c",
    suivant: "panama",
    precedent: "chine",
    periode: ["automne"],
    datesCourt: "05 → 11 oct. 2027",
    prixCourt: "dès 1 700 €",
    ficheTechnique: "7 jours / 6 nuits · dès 10 personnes · guide francophone · départ 05 → 11 oct. 2027",
    datesEncadre: null,
    recitTitre: "Sept jours, racontés dans l’ordre",
    chapeau: "Deux capitales, l’ancienne et l’actuelle, reliées par un train à grande vitesse. Un pays reconstruit pierre par pierre, et une journée que l’on ne résume pas.",
    reperes: [
      "Vieille ville de Varsovie et Château royal",
      "Mine de sel de Wieliczka",
      "Cracovie, le Wawel et la place du marché",
      "Mémorial d’Auschwitz-Birkenau et quartier de Kazimierz"
    ],
    aSavoir: "Forfait Chopin : 70 € par personne, réglé sur place. Pension complète du premier au dernier jour. Audioguides fournis du 2e au 6e jour : pratique pour entendre le guide dans les sites fréquentés. Chambre seule : + 280 €.",
    journeeType: {
      jour: 4,
      titre: "Sous terre, à Wieliczka",
      etapes: [
        { h: "07 h 00", t: "Petit-déjeuner, valises dans le hall", fort: false },
        { h: "08 h 30", t: "Train à grande vitesse Varsovie → Cracovie, 2e classe, bagages à côté de vous", fort: false },
        { h: "11 h 15", t: "Arrivée à Cracovie, autocar vers Wieliczka", fort: false },
        { h: "12 h 00", t: "Déjeuner", fort: false },
        { h: "13 h 30", t: "Descente dans la mine : galeries, chapelles taillées dans le sel, lac souterrain", fort: true },
        { h: "16 h 00", t: "Remontée, route vers l’hôtel", fort: false },
        { h: "17 h 30", t: "Installation", fort: false },
        { h: "19 h 30", t: "Dîner", fort: false }
      ]
    },
    recit: [
      { jour: 1, lieu: "Varsovie", intertitre: "Première vue sur la capitale", texte: "Accueil par le guide à l’aéroport, tour panoramique de Varsovie et première marche dans la vieille ville, reconstruite à l’identique après 1945.", notes: ["Hôtel 3 étoiles", "Dîner"] },
      { jour: 2, lieu: "Varsovie", intertitre: "Pierre par pierre", texte: "La vieille ville en détail : le Château royal, la place du marché, puis le parc Łazienki et son palais sur l’eau. L’audioguide dans l’oreille, le guide devant.", notes: ["Audioguide", "Pension complète"] },
      { jour: 3, lieu: "Varsovie", intertitre: "POLIN, puis l’après-midi à vous", texte: "Le musée de l’Histoire des Juifs polonais, POLIN, et le Monument des Héros du ghetto. L’après-midi est libre : un café, une librairie, une sieste.", notes: ["Après-midi libre"] },
      { jour: 4, lieu: "Varsovie → Wieliczka → Cracovie", intertitre: "Sous terre, à Wieliczka", texte: "Le train du matin vers Cracovie, puis la descente : galeries, chapelles taillées dans le sel, un lac souterrain. Deux heures sous terre qui passent en vingt minutes.", notes: ["Train grande vitesse, 2e classe", "Hôtel à Cracovie"] },
      { jour: 5, lieu: "Cracovie", intertitre: "Le Wawel et la place", texte: "La colline du Wawel, sa cathédrale et son château, puis la vieille ville et la place du marché, la plus grande d’Europe médiévale, avec la halle aux draps au milieu.", notes: ["Audioguide"] },
      { jour: 6, lieu: "Auschwitz-Birkenau", intertitre: "Auschwitz-Birkenau", texte: "Nous n’écrirons pas de belle phrase sur cette journée. Le guide parle, le groupe écoute, on marche. La visite du mémorial est éprouvante ; personne n’est obligé d’y participer, et le guide reste avec ceux qui préfèrent rester à Cracovie [à confirmer par l’agence]. L’après-midi, Kazimierz : ses cours, ses synagogues, un café pour se poser.", notes: [], sobre: true },
      { jour: 7, lieu: "Cracovie → Paris", intertitre: "Dernier matin", texte: "Temps libre selon l’horaire, puis transfert à l’aéroport et vol retour.", notes: [] }
    ],
    exergue: { apres: 5, texte: "Un pays qui a tout reconstruit, et qui vous montre où étaient les pierres." },
    images: {
      ouverture: {
        id: "photo-1519197924294-4ba991a11128",
        legende: "Cracovie, la vieille ville — jour 5. Photo : Unsplash",
        alt: "Façades de la vieille ville de Cracovie",
        fond: "var(--fond-pologne)"
      },
      recit: [
        {
          apres: 2,
          id: null,
          aChercher: "Warsaw old town market square",
          repli: "photo-1519197924294-4ba991a11128",
          legende: "Varsovie, la place du marché de la vieille ville — jour 2. Photo : Unsplash",
          alt: "La place du marché de la vieille ville de Varsovie et ses façades reconstruites",
          fond: "var(--fond-pologne)"
        }
      ]
    },
    faq: [
      { q: "Le rythme est-il soutenu ?", r: "Deux villes en sept jours, des visites à pied d’une à deux heures, un après-midi libre à Varsovie. Le train évite une longue route." },
      { q: "La visite d’Auschwitz-Birkenau est-elle obligatoire ?", r: "Non. Elle est prévue le matin du jour 6 ; dites-le au guide si vous préférez rester à Cracovie. [À confirmer par l’agence.]" },
      { q: "Que couvre le forfait Chopin ?", r: "Des prestations locales réglées sur place, 70 € par personne ; le détail figure sur la proposition écrite." }
    ],
    notesComptoir: [
      "Nous n’écrirons pas de belle phrase sur la journée à Auschwitz-Birkenau. Le guide parle, le groupe écoute, on marche.",
      "Forfait Chopin : 70 € par personne, écrit dans le récit, pas caché dans une note.",
      "Chambre seule : + 280 €."
    ],
    seo: {
      title: "Pologne : entre capitales et héritages — 7 jours dès 1 700 € · Voyages Loisirs by Aya",
      description: "Deux capitales, l’ancienne et l’actuelle, reliées par un train à grande vitesse. Un pays reconstruit pierre par pierre, et une journée que l’on ne résume pas. Circuit accompagné de 7 jours, départ 05 → 11 oct. 2027, dès 1 700 €."
    }
  },

  {
    slug: "panama",
    title: "Le Panama : trait d’union des Amériques",
    country: "Panama",
    category: "Nature & découverte",
    duration: "10 jours / 9 nuits",
    minimum: null,
    priceFrom: 3500,
    excerpt: "Un canal légendaire, une jungle vivante et deux océans : un voyage entre nature et culture.",
    highlights: [
      "Écluses de Miraflores et canal de Panama",
      "Rencontre avec la communauté Emberá",
      "Île de Taboga",
      "3 nuits en tout inclus face au Pacifique"
    ],
    departures: [
      { from: "13/02/2027", to: "22/02/2027", iso: "2027-02-13", price: 3650, singleSupplement: 550, libelle: "13 → 22 février 2027 — 3 650 € par personne" },
      { from: "13/11/2027", to: "22/11/2027", iso: "2027-11-13", price: 3500, singleSupplement: 525, libelle: "13 → 22 novembre 2027 — 3 500 € par personne" }
    ],
    datesNote: null,
    itinerary: [
      { day: "Jour 1", title: "Arrivée à Panama", text: "Accueil à l’aéroport de Tocumen et transfert privé. Installation à l’hôtel et dîner libre." },
      { day: "Jour 2", title: "Panama – la ville et le canal", text: "Panorama de la ville moderne, marché de fruits de mer, découverte du Casco Viejo et des écluses de Miraflores." },
      { day: "Jour 3", title: "San Lorenzo & Agua Clara", text: "Découverte de la côte caraïbe, du patrimoine de San Lorenzo et des écluses d’Agua Clara." },
      { day: "Jour 4", title: "Communauté indigène Emberá", text: "Remontée de la rivière Chagres en pirogue et rencontre avec la communauté Emberá." },
      { day: "Jour 5", title: "Soberanía & lac Gatún", text: "Parc national de Soberanía, promenade en bateau sur le lac Gatún et observation de la faune." },
      { day: "Jour 6", title: "Panama, journée libre", text: "Journée libre pour profiter du resort et de la formule tout inclus." },
      { day: "Jour 7", title: "Ferme d’ananas & El Valle", text: "Découverte d’une ferme d’ananas puis route vers El Valle de Antón et son village installé dans un cratère volcanique." },
      { day: "Jour 8", title: "El Valle / Santa Clara", text: "Découverte du marché artisanal et transfert vers la côte Pacifique." },
      { day: "Jour 9", title: "Santa Clara", text: "Journée libre pour profiter du resort et de la formule tout inclus." },
      { day: "Jour 10", title: "Santa Clara / départ", text: "Petit-déjeuner, transfert à l’aéroport et vol retour." }
    ],
    included: [
      "Vol international au départ de Paris avec escale",
      "Hébergements mentionnés",
      "Guide francophone les jours 2, 3, 4, 5, 7 et 8",
      "Demi-pension et déjeuners inclus certains jours",
      "Excursions, visites et entrées aux parcs nationaux",
      "Transferts en véhicule privé et en bateau"
    ],
    excluded: [
      "Forfait Jungle : 350 € par personne",
      "Assurances",
      "Pourboires",
      "Boissons"
    ],

    /* — Revue — */
    numero: "03",
    horsSerie: false,
    rubrique: "Nature & découverte",
    pays: "Panama",
    lieux: "Canal, Chagres, Gatún, El Valle, Pacifique",
    titreCourt: "Le Panama",
    papier: "var(--papier-panama)",
    fond: "#1f3b2d",
    suivant: "crete",
    precedent: "pologne",
    periode: ["hiver", "automne"],
    datesCourt: "févr. & nov. 2027",
    prixCourt: "dès 3 500 €",
    ficheTechnique: "10 jours / 9 nuits · dès 10 personnes · guide francophone · départs 13 → 22 févr. 2027 et 13 → 22 nov. 2027",
    datesEncadre: null,
    recitTitre: "Dix jours, racontés dans l’ordre",
    chapeau: "Un canal qui a coupé un continent en deux, une jungle qui recommence juste derrière la ville, et deux océans à moins de deux heures l’un de l’autre. Dix jours entre Caraïbes et Pacifique, avec trois nuits en tout inclus pour finir.",
    reperes: [
      "Écluses de Miraflores et canal de Panama",
      "Rencontre avec la communauté Emberá, en pirogue",
      "Lac Gatún et parc national de Soberanía",
      "Trois nuits en tout inclus, face au Pacifique"
    ],
    aSavoir: "Guide francophone les jours 2, 3, 4, 5, 7 et 8 ; les autres jours sont libres ou en transfert. Forfait Jungle : 350 € par personne, réglé sur place.",
    journeeType: {
      jour: 4,
      titre: "La pirogue, puis le village",
      etapes: [
        { h: "07 h 00", t: "Petit-déjeuner", fort: false },
        { h: "08 h 00", t: "Départ en véhicule privé vers la rivière Chagres", fort: false },
        { h: "09 h 15", t: "Embarcadère, gilets, on s’assoit", fort: false },
        { h: "09 h 30", t: "Une heure de pirogue sur la Chagres, menée par un homme de la communauté Emberá", fort: true },
        { h: "10 h 30", t: "Le village : accueil, musique, teintures végétales", fort: false },
        { h: "12 h 30", t: "Repas servi dans des feuilles", fort: false },
        { h: "14 h 30", t: "Retour en pirogue, puis en véhicule", fort: false },
        { h: "17 h 00", t: "Hôtel, soirée libre", fort: false }
      ]
    },
    recit: [
      { jour: 1, lieu: "Panama", intertitre: "Tocumen, le soir", texte: "Accueil à l’aéroport de Tocumen, transfert privé, installation à l’hôtel. Le dîner est libre : on se repose.", notes: ["Hôtel", "Dîner libre"] },
      { jour: 2, lieu: "Panama", intertitre: "La ville, le vieux quartier et les écluses", texte: "La ville moderne vue d’en haut, le marché aux fruits de mer, puis le Casco Viejo et ses balcons. L’après-midi, les écluses de Miraflores : on regarde un cargo monter de neuf mètres.", notes: ["Guide francophone", "Hôtel"] },
      { jour: 3, lieu: "San Lorenzo, Agua Clara", intertitre: "Côté Caraïbes", texte: "Route vers la côte caraïbe, le fort de San Lorenzo à l’embouchure de la Chagres, puis les écluses d’Agua Clara, les neuves, côté Atlantique.", notes: ["Guide francophone", "Déjeuner inclus"] },
      { jour: 4, lieu: "Rivière Chagres", intertitre: "La pirogue, puis le village", texte: "On laisse la route à l’embarcadère. La pirogue est longue, basse, menée par un homme de la communauté Emberá qui connaît chaque méandre de la Chagres. Une heure plus tard, le village : musique, teintures végétales, un repas servi dans des feuilles. On repart avec moins de certitudes et plus de questions, ce qui est le but.", notes: ["Guide francophone", "Repas au village"] },
      { jour: 5, lieu: "Soberanía, lac Gatún", intertitre: "La forêt qui recommence", texte: "Le parc national de Soberanía au matin, jumelles conseillées, puis le bateau sur le lac Gatún entre les îles : singes hurleurs, paresseux si la chance est là, cargos au loin.", notes: ["Guide francophone", "Bateau"] },
      { jour: 6, lieu: "Panama", intertitre: "Journée libre", texte: "Rien n’est prévu, et c’est prévu. Piscine, lecture, ou une marche dans le Casco Viejo.", notes: ["Journée libre", "Formule tout inclus"] },
      { jour: 7, lieu: "El Valle de Antón", intertitre: "L’ananas et le cratère", texte: "Une ferme d’ananas sur la route, puis El Valle de Antón, village installé dans un cratère volcanique éteint, à 600 mètres d’altitude, plus frais que la côte.", notes: ["Guide francophone"] },
      { jour: 8, lieu: "El Valle → Santa Clara", intertitre: "Vers le Pacifique", texte: "Le marché artisanal d’El Valle le matin, puis la route vers la côte Pacifique et le resort de Santa Clara. Trois nuits, tout compris.", notes: ["Guide francophone", "Tout inclus"] },
      { jour: 9, lieu: "Santa Clara", intertitre: "Journée libre, face à l’océan", texte: "La mer est devant vous. Rien d’autre à écrire.", notes: ["Journée libre", "Tout inclus"] },
      { jour: 10, lieu: "Santa Clara → Paris", intertitre: "Retour", texte: "Petit-déjeuner, transfert à l’aéroport et vol retour, avec escale.", notes: ["Vol avec escale"] }
    ],
    exergue: { apres: 5, texte: "Le temps libre n’est pas une absence de programme. C’est le programme." },
    images: {
      ouverture: {
        id: "photo-1518509562904-e7ef99cdcc86",
        legende: "Écluses de Miraflores, canal de Panama. Photo : Unsplash",
        alt: "Paysage du Panama, entre canal, forêt et côte",
        fond: "var(--fond-panama)"
      },
      recit: [
        {
          apres: 2,
          id: null,
          aChercher: "Miraflores locks Panama Canal ship",
          repli: null,
          legende: "Écluses de Miraflores, un cargo monte de neuf mètres — jour 2.",
          alt: "Un cargo dans les écluses de Miraflores, sur le canal de Panama",
          fond: "var(--fond-panama)"
        },
        {
          apres: 8,
          id: null,
          aChercher: "Santa Clara Panama beach Pacific",
          repli: null,
          legende: "Plage de Santa Clara, côte Pacifique — jour 8.",
          alt: "Plage de sable clair et cocotiers à Santa Clara, sur la côte Pacifique du Panama",
          fond: "var(--fond-panama)"
        }
      ]
    },
    faq: [
      { q: "Le rythme est-il soutenu ?", r: "Non : deux journées entièrement libres au resort, jours 6 et 9, et des visites à la journée les autres jours." },
      { q: "Qu’est-ce que le forfait Jungle ?", r: "350 € par personne, réglés sur place, pour des prestations locales ; le détail figure sur la proposition écrite." },
      { q: "Quel climat en février et en novembre ?", r: "Chaud et humide, autour de 30 °C ; novembre est en fin de saison des pluies, février en saison sèche. Vêtements légers, imperméable fin." }
    ],
    notesComptoir: [
      "Forfait Jungle : 350 € par personne, réglé sur place. Le détail figure sur la proposition écrite.",
      "Guide francophone les jours 2, 3, 4, 5, 7 et 8 ; les autres jours sont libres ou en transfert.",
      "Chambre seule : + 550 € en février, + 525 € en novembre."
    ],
    seo: {
      title: "Le Panama : trait d’union des Amériques — 10 jours dès 3 500 € · Voyages Loisirs by Aya",
      description: "Un canal qui a coupé un continent en deux, une jungle qui recommence juste derrière la ville, et deux océans à moins de deux heures l’un de l’autre. Dix jours entre Caraïbes et Pacifique, départs en février et novembre 2027, dès 3 500 €."
    }
  },

  {
    slug: "crete",
    title: "La Crète éternelle",
    country: "Grèce",
    category: "Culture & soleil",
    duration: "8 jours / 7 nuits",
    minimum: 10,
    priceFrom: 1850,
    excerpt: "Palais minoens, gorges et monastères : d’Héraklion à Spinalonga, découvrez le berceau d’une civilisation.",
    highlights: [
      "Knossos et le musée d’Héraklion",
      "Forteresse de Spinalonga",
      "Leçon de cuisine crétoise à Thronos",
      "Dégustation de vins au monastère d’Agia Triada"
    ],
    departures: [
      { from: "08/10/2027", to: "15/10/2027", iso: "2027-10-08", price: 1850, singleSupplement: 250, libelle: "08 → 15 octobre 2027 — 1 850 € par personne" }
    ],
    datesNote: null,
    itinerary: [
      { day: "Jour 1", title: "Arrivée en Crète", text: "Accueil à l’aéroport d’Héraklion, transfert à l’hôtel et temps libre." },
      { day: "Jour 2", title: "Armeni / Kourtaliotiko / Plakias / Réthymnon", text: "Découverte de sites minoens, des gorges de Kourtaliotiko et de la ville de Réthymnon." },
      { day: "Jour 3", title: "Jardin botanique / Agia Triada / La Canée", text: "Balade au jardin botanique, visite du monastère d’Agia Triada et découverte de La Canée." },
      { day: "Jour 4", title: "Arkadi / Thronos / Margarites", text: "Visite du monastère d’Arkadi, leçon de cuisine crétoise et découverte d’artisans potiers." },
      { day: "Jour 5", title: "Héraklion / Archanes / Knossos", text: "Découverte d’Héraklion, de ses trésors archéologiques et du palais de Knossos." },
      { day: "Jour 6", title: "Gortyne / Messara / Matala", text: "Découverte de Gortyne, de la plaine de Messara et du village côtier de Matala." },
      { day: "Jour 7", title: "Kritsa / Lato / Spinalonga", text: "Visite de Kritsa et de Lato, puis découverte de l’île forteresse de Spinalonga." },
      { day: "Jour 8", title: "Héraklion / Paris", text: "Temps libre selon l’horaire du vol, transfert à l’aéroport et retour en France." }
    ],
    included: [
      "Vol aller-retour au départ de Paris",
      "Taxes d’aéroport",
      "Transferts aéroport / hôtel / aéroport",
      "7 nuits en hôtel, chambre double",
      "Les repas mentionnés au programme",
      "Guide francophone pendant le circuit",
      "Transport en autocar climatisé",
      "Entrées et visites mentionnées"
    ],
    excluded: [
      "Taxe de séjour à régler sur place",
      "Repas et boissons non mentionnés",
      "Pourboires",
      "Assurances annulation et assistance",
      "Dépenses personnelles"
    ],

    /* — Revue — */
    numero: "04",
    horsSerie: false,
    rubrique: "Culture & soleil",
    pays: "Grèce",
    lieux: "Héraklion, Réthymnon, La Canée, Knossos, Spinalonga",
    titreCourt: "La Crète",
    papier: "var(--papier-crete)",
    fond: "#1f4e79",
    suivant: "chine",
    precedent: "panama",
    periode: ["automne"],
    datesCourt: "08 → 15 oct. 2027",
    prixCourt: "dès 1 850 €",
    ficheTechnique: "8 jours / 7 nuits · dès 10 personnes · guide francophone · départ 08 → 15 oct. 2027",
    datesEncadre: null,
    recitTitre: "Huit jours, racontés dans l’ordre",
    chapeau: "Palais minoens, gorges, monastères et une île-forteresse : d’Héraklion à Spinalonga, le berceau d’une civilisation qui a aussi inventé le déjeuner qui dure.",
    reperes: [
      "Knossos et le musée d’Héraklion",
      "Leçon de cuisine crétoise à Thronos",
      "Vins du monastère d’Agia Triada",
      "L’île-forteresse de Spinalonga"
    ],
    aSavoir: "Sept nuits dans le même hôtel : on défait sa valise une seule fois. Autocar climatisé et guide francophone pendant tout le circuit. Taxe de séjour à régler sur place. Chambre seule : + 250 €.",
    journeeType: {
      jour: 4,
      titre: "Arkadi, Thronos, Margarites",
      etapes: [
        { h: "08 h 00", t: "Petit-déjeuner", fort: false },
        { h: "09 h 00", t: "Départ en autocar", fort: false },
        { h: "10 h 00", t: "Monastère d’Arkadi, pour l’histoire", fort: false },
        { h: "12 h 00", t: "Thronos : leçon de cuisine crétoise, dakos, huile, herbes du jardin, puis on mange ce qu’on a cuisiné", fort: true },
        { h: "15 h 00", t: "Margarites, chez les potiers", fort: false },
        { h: "17 h 00", t: "Retour à l’hôtel", fort: false },
        { h: "19 h 30", t: "Dîner", fort: false }
      ]
    },
    recit: [
      { jour: 1, lieu: "Héraklion", intertitre: "Arrivée", texte: "Accueil à l’aéroport d’Héraklion, transfert à l’hôtel, temps libre. La mer est au bout de la rue.", notes: ["Hôtel, 7 nuits"] },
      { jour: 2, lieu: "Armeni, Kourtaliotiko, Réthymnon", intertitre: "Les tombes, la gorge, le port", texte: "La nécropole minoenne d’Armeni, les gorges de Kourtaliotiko que l’on regarde d’en haut, la plage de Plakias, puis Réthymnon et son port vénitien.", notes: ["Autocar", "Guide"] },
      { jour: 3, lieu: "Agia Triada, La Canée", intertitre: "Du jardin au port", texte: "Le jardin botanique le matin, le monastère d’Agia Triada et ses vins à midi, La Canée l’après-midi : le phare, les ruelles, le marché couvert.", notes: ["Dégustation", "Guide"] },
      { jour: 4, lieu: "Arkadi, Thronos, Margarites", intertitre: "Arkadi, Thronos, Margarites", texte: "Le monastère d’Arkadi le matin, pour l’histoire. Thronos à midi, pour la leçon de cuisine : dakos, huile, herbes du jardin, et une hôtesse qui ne mesure rien. Margarites l’après-midi, chez les potiers.", notes: ["Déjeuner cuisiné ensemble"] },
      { jour: 5, lieu: "Héraklion, Knossos", intertitre: "Le palais et le musée", texte: "Héraklion et son musée archéologique le matin, puis Knossos : les fresques, les colonnes rouges, le labyrinthe que l’on comprend enfin avec un guide.", notes: ["Sols irréguliers, bonnes chaussures"] },
      { jour: 6, lieu: "Gortyne, Messara, Matala", intertitre: "Le sud", texte: "Gortyne et ses lois gravées, la plaine de Messara et ses oliviers, puis Matala, ses grottes et sa plage.", notes: ["Autocar", "Guide"] },
      { jour: 7, lieu: "Kritsa, Lato, Spinalonga", intertitre: "Spinalonga, l’île qui attend", texte: "Kritsa et ses ruelles, Lato et ses pierres grecques, puis le bateau. Spinalonga se visite en silence, puis on en parle longtemps.", notes: ["Bateau"] },
      { jour: 8, lieu: "Héraklion → Paris", intertitre: "Retour", texte: "Temps libre selon l’horaire du vol, transfert à l’aéroport et retour en France.", notes: [] }
    ],
    exergue: { apres: 4, texte: "Une hôtesse qui ne mesure rien, et un déjeuner qui dure." },
    images: {
      ouverture: {
        id: "photo-1533105079780-92b9be482077",
        legende: "Côte crétoise, mer et rochers. Photo : Unsplash",
        alt: "Côte rocheuse de Crète et mer bleue sous le soleil",
        fond: "var(--fond-crete)"
      },
      recit: [
        {
          apres: 3,
          id: null,
          aChercher: "Chania Venetian harbour lighthouse",
          repli: "photo-1533105079780-92b9be482077",
          legende: "La Canée, le port vénitien et son phare — jour 3. Photo : Unsplash",
          alt: "Le port vénitien de La Canée et son phare, en fin d’après-midi",
          fond: "var(--fond-crete)"
        },
        {
          apres: 7,
          id: null,
          aChercher: "Spinalonga island Elounda",
          repli: null,
          legende: "Spinalonga, vue depuis la baie d’Elounda — jour 7.",
          alt: "L’île-forteresse de Spinalonga au milieu de la baie d’Elounda",
          fond: "var(--fond-crete)"
        }
      ]
    },
    faq: [
      { q: "Combien de marche ?", r: "Des visites à pied d’une à deux heures, sols irréguliers à Knossos et à Spinalonga ; de bonnes chaussures suffisent." },
      { q: "Change-t-on d’hôtel ?", r: "Non : sept nuits au même endroit, les excursions partent et reviennent chaque jour." },
      { q: "Les repas sont-ils compris ?", r: "Ceux mentionnés au programme ; les autres, et les boissons, restent à votre charge." }
    ],
    notesComptoir: [
      "Sept nuits dans le même hôtel : on défait sa valise une seule fois.",
      "Taxe de séjour à régler sur place. Chambre seule : + 250 €.",
      "Sols irréguliers à Knossos et à Spinalonga : de bonnes chaussures suffisent."
    ],
    seo: {
      title: "La Crète éternelle — 8 jours dès 1 850 € · Voyages Loisirs by Aya",
      description: "Palais minoens, gorges, monastères et une île-forteresse : d’Héraklion à Spinalonga, le berceau d’une civilisation qui a aussi inventé le déjeuner qui dure. Circuit accompagné de 8 jours, départ 08 → 15 oct. 2027, dès 1 850 €."
    }
  },

  {
    slug: "chateau-avesnes",
    title: "Le Château d’Avesnes – Le Castelet",
    country: "Normandie, France",
    category: "Escapade & détente",
    duration: "2 jours / 1 nuit",
    minimum: null,
    priceFrom: null,
    excerpt: "Un château de 1862 au cœur de 18 hectares de nature, à 1 h 30 de Paris.",
    highlights: [
      "Parc, verger et forêt sur 18 hectares",
      "Spa et détente",
      "Table d’hôtes et produits locaux",
      "Gournay-en-Bray et villages de Normandie à proximité"
    ],
    departures: [],
    datesNote: null,
    itinerary: [
      { day: "Jour 1", title: "Arrivée au Castelet", text: "Installation et découverte du domaine, de ses jardins et des environs." },
      { day: "Jour 2", title: "Nature et patrimoine", text: "Profitez du domaine et découvrez les villages, jardins et sites patrimoniaux alentour." }
    ],
    included: [
      "Séjour au Château d’Avesnes selon la formule choisie"
    ],
    excluded: [
      "Tarifs et prestations à confirmer auprès de l’agence"
    ],

    /* — Revue (hors-série, gabarit allégé) — */
    numero: "HS",
    horsSerie: true,
    rubrique: "Escapade & détente",
    pays: "Normandie",
    lieux: "Gournay-en-Bray, pays de Bray",
    titreCourt: "Château d’Avesnes",
    papier: "var(--papier-avesnes)",
    fond: "#4a5a3a",
    suivant: null,
    precedent: null,
    periode: ["toute-l-annee"],
    datesCourt: "toute l’année, sur demande",
    prixCourt: "sur demande",
    ficheTechnique: "2 jours / 1 nuit · à 1 h 30 de Paris · sans minimum de participants · toute l’année, sur demande",
    datesEncadre: "Toute l’année, selon les disponibilités du domaine ; tarif et formule sur demande.",
    recitTitre: "Deux jours, racontés dans l’ordre",
    chapeau: "Un château de 1862, dix-huit hectares de parc, de verger et de forêt, une table d’hôtes et un spa. À 1 h 30 de Paris, pour deux jours où le programme tient en un mot : rien.",
    reperes: [
      "Parc, verger et forêt sur 18 hectares",
      "Spa et détente",
      "Table d’hôtes et produits locaux",
      "Gournay-en-Bray et les villages de Normandie"
    ],
    aSavoir: "Toute l’année, selon les disponibilités du domaine ; tarif et formule sur demande, pour un couple, une famille ou un petit groupe d’amis. Pas de minimum de participants. Le transport n’est pas compris : on arrive par ses propres moyens, en voiture ou en train jusqu’à Gournay-en-Bray [gare la plus proche à confirmer par l’agence].",
    journeeType: null,
    recit: [
      { jour: 1, lieu: "Le Castelet", intertitre: "Arrivée au domaine", texte: "On arrive par ses propres moyens, en voiture ou en train jusqu’à Gournay-en-Bray [à confirmer]. Installation, découverte du parc, des jardins, puis la table d’hôtes le soir.", notes: ["Table d’hôtes", "Nuit au château"] },
      { jour: 2, lieu: "Alentours", intertitre: "Nature et patrimoine", texte: "Le domaine le matin, un village ou un jardin l’après-midi, et le retour quand on veut.", notes: ["Retour libre"] }
    ],
    exergue: null,
    images: {
      ouverture: {
        src: "assets/img/chateau-avesnes.jpg",
        position: "50% 80%",
        id: "photo-1511818966892-d7d671e672a2",
        legende: "Le Castelet et son parc, Normandie. Photo : Unsplash",
        alt: "Façade d’un château du XIXe siècle et son parc arboré",
        fond: "var(--fond-avesnes)"
      },
      recit: []
    },
    faq: [
      { q: "Comment s’y rend-on ?", r: "À 1 h 30 de Paris ; le transport n’est pas compris. [Gare la plus proche à confirmer.]" },
      { q: "Peut-on venir à deux ?", r: "Oui : le hors-série n’a pas de minimum de participants." },
      { q: "Que comprend le tarif ?", r: "Il dépend de la formule ; l’agence vous fait une proposition écrite." }
    ],
    notesComptoir: [
      "Deux jours, une nuit, et un programme qui tient en un mot : rien.",
      "Pour un couple, une famille ou un petit groupe d’amis : le hors-série n’a pas de minimum de participants.",
      "Tarif et formule sur demande."
    ],
    seo: {
      title: "Le Château d’Avesnes – Le Castelet — 2 jours en Normandie, sur demande · Voyages Loisirs by Aya",
      description: "Un château de 1862, dix-huit hectares de parc, de verger et de forêt, une table d’hôtes et un spa. À 1 h 30 de Paris, pour deux jours où le programme tient en un mot : rien. Toute l’année, sur demande."
    }
  }
];

if (typeof window !== "undefined") window.TRIPS = TRIPS;
if (typeof module !== "undefined" && module.exports) module.exports = TRIPS;
