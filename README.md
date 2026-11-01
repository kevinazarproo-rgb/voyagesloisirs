# Le Carnet d’itinéraires — Voyages Loisirs by Aya

Site statique de la marque « Voyages Loisirs » d’Aya Voyages (KTS Tourisme et Voyage SARL, 49 rue des Mathurins, 75008 Paris). Il se présente comme une revue de voyage mise en ligne : une couverture, un édito, un sommaire, quatre chapitres numérotés (un par circuit accompagné), un hors-série (le Château d’Avesnes), l’ours (l’agence) et un formulaire de demande.

- HTML, CSS et JavaScript « vanilla », sans framework, sans bibliothèque externe, sans étape de build obligatoire.
- Aucun paiement en ligne : le site informe et déclenche une demande (formulaire → e-mail à l’agence, ou appel au 01 42 68 68 06).
- Données des voyages centralisées dans `data/trips.js` ; les cinq pages de chapitre sont générées par un petit script Node, puis commitées.

## Arborescence

```
index.html                 Couverture, édito, sommaire, entracte, en une, courrier des lecteurs,
                           calendrier 2027, lexique, le comptoir, mode d’emploi, formulaire court, ours
voyages.html               Sommaire complet (filtre par période, cinq doubles pages)
voyages/chine.html         Chapitre 01 — généré depuis data/trips.js
voyages/pologne.html       Chapitre 02 — généré
voyages/panama.html        Chapitre 03 — généré
voyages/crete.html         Chapitre 04 — généré
voyages/chateau-avesnes.html  Hors-série (gabarit allégé) — généré
agence.html                L’agence (le comptoir, la maison, les garanties, comment nous voyageons)
groupes.html               Groupes, associations et comités d’entreprise (formulaire groupe)
avant-de-partir.html       Questions fréquentes (accordéons) et courrier des lecteurs
contact.html               Contact : téléphone, accès, plan schématique, formulaire complet
merci.html                 Confirmation après envoi du formulaire
404.html                   Page égarée (sommaire des cinq chapitres, téléphone)
voyage.html                Ancienne adresse des fiches : redirige ?slug=… vers voyages/<slug>.html
mentions-legales.html      Mentions légales
cookies.html               Cookies et confidentialité

assets/css/carnet.css      Feuille unique du site (jetons, composants, animations, reduced-motion)
assets/css/print.css       Feuille d’impression (programme d’un chapitre sur papier)
assets/css/pages/*.css     Compléments propres à une page (chargés après carnet.css)
assets/js/carnet.js        Interactions : barre, menu mobile, révélations, titre courant, options de lecture…
assets/js/formulaire.js    Formulaire : pré-remplissage, validation, envoi FormSubmit, repli e-mail
assets/js/pages/*.js       Compléments propres à une page (bouton « Copier ce texte », ancres des questions)
assets/img/                logo.png, logo-light.png (transparents), favicon.svg
data/trips.js              Les cinq voyages : dates, prix, textes, photos (source unique)
data/site.js               Constantes du site (domaine, téléphone, adresse, numéro de la revue)
templates/chapitre.html    Gabarit des chapitres
templates/partials/*.html  Barre, menu mobile, ours, formulaires, scripts (copiés dans chaque page)
scripts/build-chapitres.mjs  Génération des pages voyages/*.html
```

## Modifier un voyage

Tout ce qui s’affiche sur les chapitres, le sommaire, le calendrier et les formulaires vient de `data/trips.js`. Le commentaire en tête du fichier explique chaque champ ; en résumé :

1. **Une date ou un prix** : dans `departures` du voyage, modifiez `from`, `to` (JJ/MM/AAAA), `iso` (AAAA-MM-JJ), `price`, `singleSupplement`, puis les libellés `libelle`, `datesCourt` et `ficheTechnique`. Pour ajouter un départ, copiez un bloc existant.
2. **Un texte** : modifiez la chaîne entre guillemets droits. Les guillemets « », apostrophes ’ et espaces insécables sont déjà en place : copiez-collez un passage existant pour les conserver.
3. **Une photo** : `id` est l’identifiant Unsplash (`photo-…`). Avec `id: null`, la page affiche un emplacement avec couleur de secours, légende et l’attribut `data-media="à chercher : …"`.
4. Régénérez les chapitres, à la racine du site (Node 18 ou plus récent, aucune dépendance) :

   ```bash
   node scripts/build-chapitres.mjs
   ```

   Le script écrit `voyages/<slug>.html` pour les cinq voyages et effectue des contrôles (un seul `<h1>`, JSON-LD valide, aucun marqueur oublié). `node scripts/build-chapitres.mjs --verifier` compare sans écrire et renvoie un code non nul si une page commitée n’est plus à jour (utilisable en intégration continue).
5. Commitez `data/trips.js` et les pages générées.

Les textes de l’accueil (`index.html`), du sommaire complet (`voyages.html`) et de la page 404 reprennent les mêmes dates et prix : si vous changez un prix ou une date, mettez-les à jour à la main dans ces trois pages (recherchez le prix ou la date dans le fichier).

## Formulaire de demande : activation de FormSubmit

Le formulaire envoie la demande à `reservation@ayavoyages.fr` par le service [FormSubmit](https://formsubmit.co), sans compte ni serveur. Une seule étape à faire, une fois le site en ligne (pas depuis un fichier ouvert en `file://`) :

1. Ouvrez le site en ligne, remplissez le formulaire (n’importe quelle page) et envoyez-le.
2. FormSubmit envoie un e-mail « Activate form » à `reservation@ayavoyages.fr` : cliquez sur le lien d’activation.
3. Renvoyez une demande de test : elle arrive dans la boîte avec un sujet structuré (« Carnet N° 1 — Demande : 03 — Le Panama … (13 → 22 novembre 2027), 2 voyageurs — via contact ») et un tableau des champs.

Si l’envoi échoue (réseau coupé, service indisponible), le visiteur voit un panneau d’erreur avec un lien `mailto:` déjà rédigé, un bouton « Copier le message » et le téléphone. Sans JavaScript, le formulaire est envoyé en POST classique et FormSubmit redirige vers `merci.html?envoye=1`.

## Mentions « à confirmer par l’agence »

Elles restent telles quelles dans le site jusqu’à validation. À remplacer avant publication (chercher le texte entre crochets dans la page) :

| Mention | Pages |
|---|---|
| `[horaires à confirmer par l’agence]` (horaires du comptoir) | pied de page de toutes les pages ; `index.html` (édito, comptoir), `agence.html` (bloc « Venir »), `contact.html`, `groupes.html`, `avant-de-partir.html`, `404.html` |
| `[Montant et délais : à confirmer par l’agence.]` (acompte) | `index.html`, `contact.html`, `groupes.html` (étape « La confirmation ») |
| `[délai à confirmer par l’agence]` (délai de prévenance si le groupe n’atteint pas dix personnes) et `[conditions à confirmer]` (acompte et solde) | `avant-de-partir.html` (questions « Que se passe-t-il si le groupe n’atteint pas dix personnes ? », « Quand paie-t-on ? ») |
| `[à confirmer]` (visa Chine) | `avant-de-partir.html` (« Passeport, visa ? ») |
| `[À confirmer par l’agence.]` (visa et Forfait Dragon) et `[À confirmer.]` (chambre seule) | `voyages/chine.html` (« À savoir », notes de marge) ; `[Chine : à confirmer par l’agence.]` dans le lexique de `index.html` |
| `[à confirmer par l’agence]` (participation facultative à la visite d’Auschwitz-Birkenau) | `voyages/pologne.html` (jour 6) |
| `[gare la plus proche à confirmer par l’agence]`, `[Gare la plus proche à confirmer.]`, `[à confirmer]` | `voyages/chateau-avesnes.html` (« À savoir », jour 1) |
| `[privatisation à confirmer par l’agence]`, `[à confirmer par l’agence]` (présentation en Île-de-France) | `groupes.html` |
| `[à confirmer par l’agence]` (photo du comptoir, photo de la rue) | `agence.html`, `index.html` (légendes des emplacements) |
| Domaine du site | `data/site.js` (`baseUrl`, vide tant que le domaine n’est pas connu) |

Les textes des chapitres étant générés, modifiez-les dans `data/trips.js` puis relancez le script ; les autres se modifient directement dans la page.

Données à faire valider aussi : tous les prix sont « à partir de » ; le minimum de dix participants ; la fiche du Panama indique « dès 10 personnes » alors que le champ `minimum` de `data/trips.js` est vide ; les mentions légales reprennent le 47 rue des Mathurins et le 01 42 68 68 04 des mentions légales d’Aya Voyages (voir le paragraphe « Contact et écarts relevés »).

## Médias

Toutes les photos sont chargées depuis Unsplash par URL (`https://images.unsplash.com/photo-ID?auto=format&fit=crop&w=…&q=80`), avec une couleur de secours sur la figure, des traits de coupe sur les images clés et une légende. Aucune vidéo en V1.

Identifiants utilisés :

| Identifiant | Sujet | Emplacements |
|---|---|---|
| `photo-1508804185872-d7badad00f7d` | Grande Muraille | couverture de l’accueil, ouverture et vignettes du chapitre 01, chapitre suivant de 04 |
| `photo-1519197924294-4ba991a11128` | Cracovie | ouverture et vignettes du chapitre 02, chapitre suivant de 01 |
| `photo-1518509562904-e7ef99cdcc86` | Panama | ouverture et vignettes du chapitre 03, « En une » de l’accueil, chapitre suivant de 02 |
| `photo-1533105079780-92b9be482077` | Crète | ouverture et vignettes du chapitre 04, chapitre suivant de 03 |
| `photo-1511818966892-d7d671e672a2` | château et parc | entracte de l’accueil, ouverture et vignette du hors-série |
| `photo-1488646953014-85cb44e25828` | carte et appareil photo | comptoir de l’accueil et de la page agence (en attendant une vraie photo), image de partage des pages sans photo |

Emplacements à pourvoir (l’attribut `data-media="à chercher : …"` sur la figure donne les mots-clés ; chercher l’image sur Unsplash, copier son identifiant dans `data/trips.js` ou dans la page, et relire la légende) :

| Emplacement | Mots-clés | Secours actuel |
|---|---|---|
| Accueil « En une » (pirogue) | « Chagres river dugout canoe Embera » | photo d’ouverture du chapitre 03 |
| Accueil, section « Le comptoir » et ouverture de `agence.html` | « Paris Haussmann street Opera Garnier morning » (candidats à vérifier : `photo-1502602898657-3e91760cbb34`, `photo-1499856871958-5b9627545d1a`) | aplat `--fond-paris` |
| `agence.html`, le comptoir | vraie photo du comptoir fournie par l’agence (1600 × 1067) | `photo-1488646953014-85cb44e25828` |
| Chapitre 01, après le jour 4 | « Mutianyu Great Wall autumn » | ouverture 01 réutilisée |
| Chapitre 01, après le jour 6 | « Terracotta Army Xi’an pit » (candidat à vérifier : `photo-1536599018102-9f803c140fc1`) | aplat |
| Chapitre 02, après le jour 2 | « Warsaw old town market square » | ouverture 02 réutilisée |
| Chapitre 03, après les jours 2 et 8 | « Miraflores locks Panama Canal ship », « Santa Clara Panama beach Pacific » | aplats |
| Chapitre 04, après les jours 3 et 7 | « Chania Venetian harbour lighthouse », « Spinalonga island Elounda » | ouverture 04 réutilisée, aplat |
| Image de partage `assets/img/og.jpg` (1200 × 630) | fond papier, logo, « Le Carnet d’itinéraires — N° 1 » | les balises `og:image` pointent sur la photo de couverture |

Aucune image, aucune animation pour la journée d’Auschwitz-Birkenau (chapitre 02, jour 6).

## Hébergement

Le site se dépose tel quel (aucune commande à lancer) sur Vercel, Netlify, GitHub Pages ou un hébergement mutualisé OVH : copiez le contenu du dépôt à la racine du site. Tous les chemins sont relatifs, le site fonctionne aussi dans un sous-dossier.

- **Page 404** : Vercel, Netlify et GitHub Pages servent automatiquement `404.html`. Sur OVH (Apache), ajoutez un fichier `.htaccess` à la racine contenant `ErrorDocument 404 /404.html`.
- **Domaine** : une fois connu, renseignez-le dans `data/site.js` (`baseUrl: "https://www.exemple.fr"`), puis relancez `node scripts/build-chapitres.mjs` : les balises `canonical` et `og:url` des chapitres sont alors générées. Pour les autres pages, ajoutez-les à la main dans le `<head>` si vous le souhaitez.
- **Formulaire** : l’activation FormSubmit (ci-dessus) se fait depuis le site en ligne.
- Les anciennes adresses `voyage.html?slug=…` redirigent vers les nouvelles pages de chapitre.

## Accessibilité et options de lecture

- Un seul `<h1>` par page, lien d’évitement « Aller au contenu », `<main id="contenu">`, sections titrées, fil d’Ariane, `aria-current` sur la page courante.
- Menu mobile : focus piégé, fermeture par Échap, reste de la page inerte ; fonctionne aussi sans JavaScript.
- Formulaire : libellés associés, aides et erreurs reliées par `aria-describedby`, messages en français, résumé des erreurs annoncé, cibles tactiles de 48 px.
- Tableaux des dates empilés sous 600 px avec libellés ; exergues découpés mot par mot avec le texte complet pour les lecteurs d’écran.
- Pied de page : deux boutons mémorisés dans le navigateur, « Agrandir le texte » (112,5 %) et « Réduire les animations » (équivalent de `prefers-reduced-motion`, qui est aussi respecté automatiquement).
- Sans JavaScript, tout le contenu est visible, la barre est posée, le formulaire et les accordéons fonctionnent nativement.
- Impression : `assets/css/print.css` met en page le programme d’un chapitre (en-tête avec coordonnées, récit sur une colonne, tableau des dates, prix) ; le bouton « Imprimer le programme » ouvre la boîte d’impression et les accordéons s’ouvrent le temps de l’impression.

## Vérifier avant de publier

- `node scripts/build-chapitres.mjs --verifier` : les chapitres commitées correspondent bien à `data/trips.js`.
- Ouvrir chaque page dans un navigateur, à 390 px et 1366 px de large, et vérifier qu’aucune mention entre crochets ne subsiste.
- Faire un envoi réel du formulaire après activation de FormSubmit.
