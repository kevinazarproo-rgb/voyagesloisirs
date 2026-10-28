# Voyages Loisirs by Aya — site vitrine

Site vitrine Next.js + TypeScript + Tailwind CSS, construit à partir du PDF « Produits Voyages Loisirs » fourni.

## Contenu
- Accueil responsive et catalogue de 5 séjours.
- Fiche détaillée pour chaque séjour, avec dates, prix, temps forts, programme, inclus / non inclus.
- Formulaire de demande de réservation sans paiement en ligne.
- Données des voyages centralisées dans `data/trips.ts` : modifiez ce fichier pour changer les tarifs, dates, textes ou ajouter des voyages.
- Logo fourni dans `public/logo-voyages-loisirs.jpeg`.

## Lancer en local
Installez Node.js (version LTS recommandée), puis dans ce dossier :

```bash
npm install
npm run dev
```

Ouvrez http://localhost:3000.

## Important avant publication
1. Dans `components/RequestForm.tsx`, remplacez `CONTACT-A-CONFIGURER@example.com` par l'adresse e-mail réelle de l'agence. Le formulaire utilise pour l'instant `mailto:` : il ouvre le logiciel de messagerie du visiteur et ne stocke pas les demandes dans une base de données.
2. Vérifiez avec l'agence tous les prix, dates, suppléments et prestations avant publication. Le PDF contient des prix variables selon les départs et certains éléments à confirmer.
3. Les photos de destinations sont chargées depuis Unsplash. Pour une mise en production, vérifier les droits d'utilisation et privilégier les photos autorisées par l'agence.
4. Ajouter les mentions légales, politique de confidentialité, informations de l'entreprise et gestion des cookies si nécessaire.
5. Le nom de domaine et l'hébergement ne sont pas encore connectés.

## Mettre en ligne avec Vercel
1. Créez un dépôt GitHub et envoyez-y le contenu de ce dossier.
2. Importez le dépôt sur https://vercel.com.
3. Lancez le déploiement avec les réglages Next.js détectés automatiquement.
4. Dans Project Settings → Domains, ajoutez le nom de domaine existant et suivez les instructions DNS du fournisseur du domaine.

## Modifier un voyage
Ouvrez `data/trips.ts`. Chaque séjour est un objet dans le tableau `trips`. Pour ajouter un séjour, dupliquez un objet, donnez-lui un `slug` unique et complétez les champs.
