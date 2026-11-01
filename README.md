# Voyages Loisirs by Aya — site web

Site statique (HTML, CSS, JavaScript sans bibliothèque), en ligne sur GitHub Pages :
https://kevinazarproo-rgb.github.io/voyagesloisirs/

## Pages
- `index.html` — accueil : grand bandeau (vidéo montgolfières), cartes des voyages, « Comment ça marche ? », Aya Voyages, agence et questions, formulaire
- `voyages.html` — toutes les destinations
- `voyages/<voyage>.html` — fiche de chaque voyage : programme jour par jour, compris / non compris, dates et prix, questions, formulaire
- `agence.html`, `contact.html`, `merci.html`, `404.html`, `mentions-legales.html`, `cookies.html`
- `voyage.html` — redirige les anciennes adresses `voyage.html?slug=…`

## Modifier un voyage (prix, dates, textes, photos)
1. Modifier `data/trips.js` (une entrée par voyage). Coordonnées de l'agence : `data/site.js`.
2. Lancer `node scripts/build.mjs` : toutes les pages sont régénérées.
3. Commiter et pousser sur `main` : GitHub Pages met le site à jour en une minute.

Les textes des pages légales sont dans `content/`. Le style est dans `assets/css/site.css`, les comportements dans `assets/js/site.js`.

## Formulaires (envoi par e-mail)
Les formulaires (« Être rappelé », demande d'information, demande de voyage) sont envoyés à reservation@ayavoyages.fr par le service gratuit FormSubmit.
**À faire une seule fois :** envoyer un premier formulaire depuis le site en ligne, puis cliquer sur « Activate » dans l'e-mail que FormSubmit envoie à reservation@ayavoyages.fr. Si l'envoi échoue, le visiteur se voit proposer un e-mail pré-rempli et le numéro de téléphone.

## À confirmer par l'agence
- Paiement en plusieurs fois sans frais (repris de la maquette) : conditions exactes.
- Horaires d'ouverture du comptoir.
- Coordonnées des mentions légales (47 rue / 01 42 68 68 04) et de réservation (49 rue / 01 42 68 68 06).
- Photos : choisies sur Unsplash et Pexels ; à remplacer par des photos de l'agence si souhaité.

## Versions précédentes
- Branche `version-carnet` : la version « carnet d'itinéraires ».
- Branche `ancien-site` : le site d'origine.
