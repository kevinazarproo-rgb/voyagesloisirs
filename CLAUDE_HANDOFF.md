# Passation pour continuer le site Voyages Loisirs by Aya

## Site à ouvrir

- Ouvrir `index.html` dans un navigateur pour voir la version statique actuelle. Elle fonctionne sans Node.js.
- Les médias de la page (vidéo et certaines photos) sont chargés depuis Internet.
- `voyage.html?slug=chine`, `pologne`, `panama`, `chateau-avesnes` ou `crete` affiche les fiches voyage.

## État actuel

- La page d’accueil reprend la direction visuelle des captures de référence : vidéo en grand, menu transparent au-dessus de la vidéo puis blanc au défilement, cartes de destinations en deux colonnes, bloc de présentation agrandi.
- Les formulaires préparent un e-mail vers `reservation@ayavoyages.fr`. Les coordonnées de réservation affichées sont le `01 42 68 68 06` et le `49 rue des Mathurins, 75008 Paris`.
- `mentions-legales.html` et `cookies.html` contiennent les informations légales et la politique de cookies de cette version statique.
- Le logo envoyé par Aya se trouve dans `public/logo-aya.jpeg`. Le fond blanc est fondu visuellement par CSS ; l’image n’a pas encore de véritable transparence.

## Données à vérifier avant publication

- Le PDF `Produits Voyages Loisirs.pdf` n’a pas encore pu être lu. Les descriptions et tarifs actuels viennent du projet initial, pas du PDF.
- Des dates contradictoires avec la durée des séjours ont été retirées de l’affichage : les dates de Chine sont à confirmer ; le départ d’avril en Pologne et la période de juin-juillet en Crète sont masqués. Les départs restants doivent aussi être vérifiés dans le PDF.
- Le site officiel `https://www.ayavoyages.com/` affiche le `49 rue des Mathurins` et le `01 42 68 68 06` dans son pied de page, mais le `47 rue des Mathurins` et le `01 42 68 68 04` dans ses mentions légales. Confirmer les coordonnées à utiliser avant de finaliser les pages légales.

## Structure technique à connaître

- `index.html` et `voyage.html` forment la version statique modifiée, utilisable sans Node.
- `app/`, `components/` et `data/` sont la version Next.js d’origine. Elle n’a pas encore été mise en cohérence visuelle complète avec la version statique ; `npm run dev` affiche donc une version différente.
- `components/RequestForm.tsx` et `components/Footer.tsx` ont été mis à jour avec les coordonnées de réservation.
- `data/trips.ts` contient maintenant uniquement les départs retenus à ce stade pour la version Next.js ; confirmer les données dans le PDF.

## À terminer

1. Lire le PDF et remplacer les descriptions, prix, dates et prestations avec les données confirmées.
2. Confirmer l’adresse et le numéro de téléphone officiels à afficher dans les mentions légales.
3. Créer un vrai logo transparent et vérifier son rendu sur la barre transparente.
4. Vérifier les formulaires en ouvrant un e-mail vers `reservation@ayavoyages.fr`.
5. Décider si la version Next.js doit être synchronisée avec la version statique ou si le site restera entièrement statique.
