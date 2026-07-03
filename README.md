# Voyages Loisirs — Site vitrine

Site web moderne pour l'agence de voyages **Voyages Loisirs**. Site statique
(HTML / CSS / JavaScript, sans dépendance ni build) : rapide, facile à héberger
et référencé pour le SEO.

## ✨ Fonctionnalités

- **Accueil** immersif : hero plein écran, barre de recherche de voyage, statistiques.
- **Destinations populaires** en page d'accueil + catalogue filtrable par continent.
- **Réservation en ligne** avec récapitulatif dynamique et calcul du total en temps réel.
- **Moyens de paiement** : carte bancaire (Visa / Mastercard / Amex), PayPal, Apple Pay,
  paiement en 3× et virement SEPA — avec réassurance « paiement sécurisé ».
- **Responsive** (mobile, tablette, desktop) + menu mobile.
- Animations d'apparition au défilement, respect de `prefers-reduced-motion`.

## 🗂 Structure

```
.
├── index.html          # Accueil
├── destinations.html   # Catalogue filtrable
├── reservation.html    # Réservation + paiement
├── css/style.css       # Système de design (couleurs, composants)
└── js/main.js          # Interactions + données des destinations
```

## 🎨 Design

Palette « évasion » : océan profond, corail chaleureux, sable & or.
Typographies Google Fonts : *Playfair Display* (titres) + *Poppins* (texte).

## 🚀 Lancer en local

Ouvrez simplement `index.html` dans un navigateur, ou servez le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## 🌐 Déploiement

Le site étant 100 % statique, il se déploie tel quel sur Netlify, Vercel,
GitHub Pages, ou tout hébergement web classique.

## 🔧 Personnalisation

- **Destinations** : modifiez le tableau `DESTINATIONS` dans `js/main.js`.
- **Couleurs / typo** : variables CSS en haut de `css/style.css`.
- **Coordonnées** : téléphone, e-mail et adresse dans le pied de page de chaque page.

> ⚠️ Le paiement est actuellement une **démonstration** (aucune transaction réelle).
> Pour encaisser en ligne, connectez un prestataire type **Stripe** ou **PayPal**
> (une intégration serveur est nécessaire).
