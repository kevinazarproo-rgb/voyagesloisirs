# Passation

- Site statique généré par `node scripts/build.mjs` à partir de `data/trips.js`, `data/site.js` et `content/*.html`. Ne pas modifier les pages HTML à la main : modifier le générateur ou les données, puis relancer.
- Style : `assets/css/site.css` (bleu marine #0c1d45, orange #f68b1f, Playfair Display + Poppins). Comportements : `assets/js/site.js` (barre, menu mobile, apparitions, étapes, fenêtre « Être rappelé », formulaires FormSubmit avec repli mailto).
- Hébergement : GitHub Pages, branche `main`, racine. `.nojekyll` présent.
- Style voulu par le client : maquette « Prenez le temps de voir le monde » (héros photo, cartes arrondies, bouton flottant « Être rappelé »).
- Branches de sauvegarde : `version-carnet` (version éditoriale précédente), `ancien-site`.
