// Constantes du site — « Le Carnet d’itinéraires », Voyages Loisirs by Aya.
// Chargé avant assets/js/formulaire.js (facultatif : les scripts ont des valeurs de repli).
// baseUrl : laisser vide tant que le domaine n’est pas connu [à confirmer par l’agence] ;
// une fois renseigné (ex. "https://www.exemple.fr"), les balises canonical / og:url peuvent être générées.
const SITE = {
  baseUrl: "",
  numero: "N° 1",
  saison: "Hiver 2026-2027",
  enUne: "panama",
  enUneJour: 4,
  tel: "01 42 68 68 06",
  telHref: "tel:+33142686806",
  email: "reservation@ayavoyages.fr",
  adresse: "20 rue de Boulainvilliers, 75016 Paris",
  // Vidéos du grand bandeau de l’accueil, jouées l’une après l’autre.
  // Pour en ajouter une : sur pexels.com, ouvrir la vidéo, « Téléchargement gratuit » → choisir « HD 1920x1080 »,
  // copier l’adresse du fichier (…videos.pexels.com/video-files/…mp4) et l’ajouter ci-dessous, puis lancer node scripts/build.mjs.
  // « affiche » (facultatif) : image montrée pendant le chargement.
  videosAccueil: [
    { video: "https://videos.pexels.com/video-files/10745869/10745869-hd_1920_1080_25fps.mp4", affiche: "https://images.pexels.com/videos/10745869/kapadokya-turkiye-10745869.jpeg?auto=compress&dpr=1&h=1080&w=1920" },
    { video: "https://videos.pexels.com/video-files/8349318/8349318-hd_1920_1080_25fps.mp4", affiche: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=75" }
  ]
};
if (typeof window !== "undefined") window.SITE = SITE;
if (typeof module !== "undefined") module.exports = SITE;
