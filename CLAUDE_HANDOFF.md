# Passation — « Le Carnet d’itinéraires », Voyages Loisirs by Aya

## État actuel (branche `refonte-site`)

Le site est entièrement statique (HTML, CSS, JavaScript vanilla) et livrable tel quel : seize pages, une feuille de style principale (`assets/css/carnet.css`), une feuille d’impression, deux scripts partagés (`assets/js/carnet.js`, `assets/js/formulaire.js`) et quelques compléments par page dans `assets/css/pages/` et `assets/js/pages/`. Le README décrit l’arborescence, la procédure de modification des voyages, l’activation de FormSubmit, la liste des mentions à confirmer, les médias et l’hébergement.

- **Données** : `data/trips.js` est la source unique (cinq voyages, textes finaux, photos, SEO). Les cinq chapitres `voyages/*.html` sont générés par `node scripts/build-chapitres.mjs` depuis `templates/chapitre.html` et les partiels ; `--verifier` contrôle qu’ils sont à jour. Les pages générées sont commitées, le site fonctionne sans Node.
- **Pages** : accueil (`index.html`), sommaire complet (`voyages.html`), cinq chapitres, agence, groupes, questions, contact, merci, 404, redirection `voyage.html`, mentions légales, cookies. Barre, menu mobile et ours sont identiques sur toutes les pages (copiés depuis `templates/partials/`), seules les classes d’état de la barre et `aria-current` changent.
- **Formulaire** : envoi AJAX vers `https://formsubmit.co/ajax/reservation@ayavoyages.fr`, validation douce en français, repli `mailto:` et « Copier le message » en cas d’échec, POST classique sans JavaScript (`_next` → `merci.html?envoye=1`). FormSubmit n’est pas encore activé (première soumission depuis le site en ligne, puis clic sur l’e-mail « Activate »).
- **Vérifications faites** : zéro erreur console, zéro requête locale en échec, zéro débordement horizontal à 390 et 1366 px sur les seize pages ; un seul `<h1>` par page ; liens et ancres internes tous valides ; suites de tests Playwright (accueil, chapitres, sommaire et agence, groupes et questions, contact et pages techniques, intégration) sans échec ; reduced-motion et absence de JavaScript conformes ; typographie française (insécables, guillemets, apostrophes) ; aucun mot interdit par le brief.
- **Environnement de test** : les images Unsplash ne se chargent pas depuis l’environnement de développement (réseau bloqué) ; les couleurs de secours tiennent la mise en page. En production, elles se chargent.

## Ce qui reste à faire

1. **Mettre en ligne** (Vercel, Netlify, GitHub Pages ou OVH, dépôt tel quel), puis activer FormSubmit par un premier envoi et un envoi de test réel.
2. **Faire valider par l’agence** toutes les mentions entre crochets listées dans le README (horaires du comptoir, acompte et délais, délai de prévenance, visa Chine, chambre seule Chine, participation facultative à Auschwitz-Birkenau, gare du château, privatisation et présentation pour les groupes), puis les remplacer : dans `data/trips.js` pour les chapitres (et relancer le script), directement dans les pages pour le reste.
3. **Renseigner le domaine** dans `data/site.js` (`baseUrl`) et relancer `node scripts/build-chapitres.mjs` pour les balises `canonical` / `og:url` des chapitres.
4. **Photos** : pourvoir les emplacements marqués `data-media="à chercher : …"` (liste et mots-clés dans le README) et fournir une vraie photo du comptoir pour `agence.html` ; vérifier visuellement les identifiants candidats cités ; produire éventuellement `assets/img/og.jpg` (1200 × 630) et pointer `og:image` dessus.
5. **Données** : harmoniser `minimum` (Panama : la fiche dit « dès 10 personnes », le champ est vide) ; confirmer les coordonnées légales (47 rue des Mathurins / 01 42 68 68 04 dans les mentions légales d’Aya Voyages, 49 / 06 pour la réservation).
6. **Si un prix ou une date change** : modifier `data/trips.js`, relancer le script, puis reporter à la main dans `index.html` (sommaire, calendrier, lexique), `voyages.html` et `404.html`, qui ne sont pas générés.
7. **Facultatif (V2)** : vidéos d’interlude Pexels dans les chapitres (le module `videos()` de `carnet.js` et la feuille d’impression les prévoient déjà), génération de `voyages.html` et `404.html` depuis les données, mutualisation du `<head>` des chapitres avec `templates/partials/head.html` (aujourd’hui copié dans `templates/chapitre.html`).

## Repères techniques

- Les états initiaux d’animation ne s’appliquent que sous `html:not(.no-js)` : sans script, rien n’est masqué. Les révélations utilisent `[data-reveal]` (variantes `gauche`, `droite`, `haut`, `fondu`, `conteneur`, `chargement`) et `[data-reveal-enfant]` avec `--i` pour le décalage.
- `:root{--duree:1}` pilote toutes les durées ; `prefers-reduced-motion` et la classe `html.motion-off` (bouton « Réduire les animations ») la passent à 0.
- Les valeurs de `periode` dans `data/trips.js` (`hiver`, `automne`, `toute-l-annee`, `en-preparation`) sont celles du filtre de `voyages.html` (ids `p-…`, attribut `data-periode`).
- `data/trips.js` et `data/site.js` exposent `window.TRIPS` et `window.SITE` (navigateur) et `module.exports` (Node). `contact.html` charge `data/trips.js` avant `formulaire.js` pour le select de dates dépendant du voyage.
- Le défilement doux n’est actif que sur `html:focus-within` (ancres cliquées) : les défilements programmatiques restent instantanés, ce qui évite de bloquer les outils de capture et les observateurs.
