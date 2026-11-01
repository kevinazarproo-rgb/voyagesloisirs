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
  adresse: "49 rue des Mathurins, 75008 Paris"
};
if (typeof window !== "undefined") window.SITE = SITE;
if (typeof module !== "undefined") module.exports = SITE;
