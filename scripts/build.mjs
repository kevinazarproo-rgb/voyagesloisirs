// Génère toutes les pages du site à partir de data/trips.js et data/site.js.
// Usage : node scripts/build.mjs        (régénère les pages HTML, à commiter)
// Pour changer un prix, une date ou un texte de voyage : modifiez data/trips.js, puis relancez.
import { createRequire } from 'node:module';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const TRIPS = require(join(RACINE, 'data/trips.js'));
const SITE = require(join(RACINE, 'data/site.js'));
const TEL = SITE.tel, TEL_HREF = SITE.telHref, EMAIL = SITE.email, ADRESSE = SITE.adresse;
const NBSP = ' ', FINE = ' ';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const euros = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, FINE) + NBSP + '€';
const unsplash = (id, w = 1600, h) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=75`;
const srcset = (id) => [800, 1200, 1800].map((w) => `${unsplash(id, w)} ${w}w`).join(', ');
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const maj = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------------- photos ---------------- */
const HEROS = [
  { lieu: 'Cappadoce, Turquie', img: 'https://images.pexels.com/videos/10745869/kapadokya-turkiye-10745869.jpeg?auto=compress&dpr=1&h=1080&w=1920', video: 'https://videos.pexels.com/video-files/10745869/10745869-hd_1920_1080_25fps.mp4' },
  { lieu: 'Grande Muraille, Chine', img: unsplash('photo-1508804185872-d7badad00f7d', 1920) },
  { lieu: 'Côte crétoise, Grèce', img: unsplash('photo-1533105079780-92b9be482077', 1920) },
  { lieu: 'Cracovie, Pologne', img: unsplash('photo-1519197924294-4ba991a11128', 1920) },
  { lieu: 'Panama', img: unsplash('photo-1518509562904-e7ef99cdcc86', 1920) },
  { lieu: 'Entre mer et montagnes', img: unsplash('photo-1464822759023-fed622ff2c3b', 1920), video: 'https://videos.pexels.com/video-files/8349318/8349318-hd_1920_1080_25fps.mp4' },
];
const PHOTOS = {
  herosAffiche: 'https://images.pexels.com/videos/10745869/kapadokya-turkiye-10745869.jpeg?auto=compress&dpr=1&h=1080&w=1920',
  herosVideo: 'https://videos.pexels.com/video-files/10745869/10745869-hd_1920_1080_25fps.mp4',
  etapes: 'photo-1551632811-561732d1e306',
  aya: 'photo-1464822759023-fed622ff2c3b',
  agence: 'photo-1488646953014-85cb44e25828',
  destinations: 'photo-1469854523086-cc02fe5d8800',
  contact: 'photo-1502602898657-3e91760cbb34',
};

/* ---------------- icônes (traits) ---------------- */
const P = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5Z"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  map: '<path d="m1 6 7-3 8 3 7-3v15l-7 3-8-3-7 3Z"/><path d="M8 3v15M16 6v15"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z"/>',
  bed: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  euro: '<path d="M4 10h12M4 14h9M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
  guide: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
  print: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
};
P.instagram = '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>';
P.linkedin = '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>';
const INSTAGRAM = 'https://www.instagram.com/ayavoyages/';
const LINKEDIN = 'https://www.linkedin.com/showcase/aya-voyages/';
const reseaux = (cls = 'pastille') => `<a class="${cls}" href="${INSTAGRAM}" rel="noopener" target="_blank" aria-label="Aya Voyages sur Instagram">${ico('instagram')}</a><a class="${cls}" href="${LINKEDIN}" rel="noopener" target="_blank" aria-label="Aya Voyages sur LinkedIn">${ico('linkedin')}</a>`;
const ico = (n, cls = '') => `<svg class="icone ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${P[n]}</svg>`;
const trait = `<svg class="trait" viewBox="0 0 190 16" aria-hidden="true"><path d="M3 11C40 4 90 3 187 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`;

/* ---------------- données dérivées ---------------- */
const CIRCUITS = TRIPS.filter((t) => !t.horsSerie);
function periodeCarte(t) {
  if (!t.departures.length) return t.slug === 'chateau-avesnes' ? 'Toute l’année' : 'Dates 2027 à venir';
  const mois = [...new Set(t.departures.map((d) => MOIS[Number(d.iso.slice(5, 7)) - 1]))];
  const an = t.departures[0].iso.slice(0, 4);
  return maj(mois.join(' & ')) + ' ' + an;
}
const prixCourt = (t) => (t.priceFrom ? `dès ${euros(t.priceFrom)}` : 'sur demande');
const nomCourt = (t) => (t.slug === 'chateau-avesnes' ? 'Château d’Avesnes' : t.titreCourt || t.country);
const accroche = (t) => {
  const parts = String(t.title).split(/\s*:\s*/);
  return parts.length > 1 ? maj(parts.slice(1).join(' : ')) + '.' : t.excerpt;
};

/* ---------------- gabarit commun ---------------- */
function tete({ titre, description, racine, image }) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titre)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(titre)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(image || unsplash(PHOTOS.aya, 1200, 630))}">
<meta name="theme-color" content="#0c1d45">
<link rel="icon" href="${racine}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${racine}assets/css/site.css">
<script>document.documentElement.classList.add('js')</script>
</head>`;
}

function barre({ racine, page, pleine }) {
  const cur = (p) => (p === page ? ' aria-current="page"' : '');
  return `<a class="evitement" href="#contenu">Aller au contenu</a>
<header class="barre${pleine ? ' barre--pleine' : ''}">
  <div class="conteneur barre__in">
    <div class="barre__gauche">
      ${reseaux()}
    </div>
    <a class="barre__logo" href="${racine}index.html" aria-label="Voyages Loisirs by Aya — accueil"><img src="${racine}assets/img/logo-light.png" alt="Voyages Loisirs by Aya" width="900" height="354"></a>
    <nav class="barre__nav" aria-label="Navigation principale">
      <a href="${racine}index.html"${cur('accueil')}>Accueil</a>
      <a href="${racine}agence.html"${cur('agence')}>L’agence</a>
      <a class="barre__logo" href="${racine}index.html" aria-label="Voyages Loisirs by Aya — accueil"><img src="${racine}assets/img/logo-light.png" alt="Voyages Loisirs by Aya" width="900" height="354"></a>
      <a href="${racine}voyages.html"${cur('voyages')}>Destinations</a>
      <a href="${racine}contact.html"${cur('contact')}>Contact</a>
    </nav>
    <a class="barre__aya" href="https://www.ayavoyages.com/" rel="noopener">Aya Voyages</a>
    <a class="barre__tel" href="${TEL_HREF}" aria-label="Appeler l’agence">${ico('phone')}</a>
    <button class="barre__menu" type="button" aria-expanded="false" aria-controls="menu-mobile" aria-label="Ouvrir le menu">${ico('menu')}</button>
  </div>
</header>
<div class="menu-mobile" id="menu-mobile" aria-hidden="true">
  <div class="menu-mobile__haut">
    <img src="${racine}assets/img/logo-light.png" alt="Voyages Loisirs by Aya" width="900" height="354">
    <button class="barre__menu" type="button" data-fermer-menu aria-label="Fermer le menu" style="display:inline-flex">${ico('x')}</button>
  </div>
  <nav aria-label="Menu">
    <a href="${racine}index.html"${cur('accueil')}>Accueil</a>
    <a href="${racine}voyages.html"${cur('voyages')}>Destinations</a>
    <a href="${racine}agence.html"${cur('agence')}>L’agence</a>
    <a href="${racine}contact.html"${cur('contact')}>Contact</a>
    <a href="https://www.ayavoyages.com/" rel="noopener">Aya Voyages ↗</a>
  </nav>
  <div class="menu-mobile__bas">
    <a class="btn btn--orange" href="${TEL_HREF}">${ico('phone')} Appeler le ${TEL.replace(/ /g, FINE)}</a>
    <a class="btn btn--contour" href="${racine}contact.html" data-rappel>Être rappelé</a>
    <div style="display:flex;gap:12px;justify-content:center;margin-top:6px">${reseaux()}</div>
  </div>
</div>`;
}

function optionsVoyages(choisi) {
  return `<option value="">Je ne sais pas encore</option>` + TRIPS.map((t) => `<option value="${t.slug}"${t.slug === choisi ? ' selected' : ''}>${esc(nomCourt(t))} — ${esc(t.duration)}</option>`).join('');
}

function formulaire({ id, sujet, voyage = '', titre = true }) {
  const f = (n) => `${id}-${n}`;
  return `<form class="formulaire" id="${id}" data-form data-sujet="${esc(sujet)}" method="POST" action="https://formsubmit.co/${EMAIL}" novalidate>
  <input type="hidden" name="_subject" value="${esc(sujet)}">
  <input type="hidden" name="_template" value="table">
  <div class="champ"><label for="${f('nom')}">Nom et prénom *</label><input id="${f('nom')}" name="nom" autocomplete="name" required></div>
  <div class="champ"><label for="${f('tel')}">Téléphone *</label><input id="${f('tel')}" name="telephone" type="tel" autocomplete="tel" inputmode="tel" required></div>
  <div class="champ"><label for="${f('email')}">E-mail *</label><input id="${f('email')}" name="email" type="email" autocomplete="email" required></div>
  <div class="champ"><label for="${f('nb')}">Nombre de voyageurs</label><select id="${f('nb')}" name="voyageurs">${['1', '2', '3', '4', '5 à 9', '10 et plus (groupe)'].map((n) => `<option${n === '2' ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
  <div class="champ"><label for="${f('voyage')}">Voyage souhaité</label><select id="${f('voyage')}" name="voyage">${optionsVoyages(voyage)}</select></div>
  <div class="champ"><label for="${f('date')}">Date ou période</label><input id="${f('date')}" name="date" placeholder="ex. octobre 2027"></div>
  <div class="champ plein"><label for="${f('msg')}">Message</label><textarea id="${f('msg')}" name="message" placeholder="Vos questions, une chambre seule, une mobilité réduite…"></textarea></div>
  <div class="pot" aria-hidden="true"><label for="${f('web')}">Ne pas remplir</label><input id="${f('web')}" name="site_web" tabindex="-1" autocomplete="off"></div>
  <label class="case plein" for="${f('ok')}"><input id="${f('ok')}" name="consentement" type="checkbox" required><span>J’accepte que l’agence utilise ces informations pour me répondre (<a href="${'{{r}}'}cookies.html">confidentialité</a>). *</span></label>
  <div class="plein"><button class="btn btn--orange" type="submit">Envoyer ma demande ${ico('arrow', 'icone--fleche')}</button></div>
  <p class="plein" style="margin:0;font-size:13.5px;color:var(--gris)">Aucun paiement sur ce site, aucun engagement : l’agence vous rappelle sous deux jours ouvrés.</p>
</form>`;
}

function modaleRappel(racine) {
  return `<dialog class="modale" id="rappel" aria-labelledby="rappel-titre">
  <div class="modale__in">
    <div class="modale__haut">
      <div><h2 id="rappel-titre">Être rappelé</h2><p>Laissez votre numéro : un conseiller vous rappelle, sans engagement.</p></div>
      <button class="fermer" type="button" data-fermer aria-label="Fermer">${ico('x')}</button>
    </div>
    <form class="formulaire" data-form data-sujet="Demande de rappel" method="POST" action="https://formsubmit.co/${EMAIL}" novalidate>
      <input type="hidden" name="_subject" value="Demande de rappel">
      <div class="champ"><label for="r-nom">Nom et prénom *</label><input id="r-nom" name="nom" autocomplete="name" required></div>
      <div class="champ"><label for="r-tel">Téléphone *</label><input id="r-tel" name="telephone" type="tel" autocomplete="tel" inputmode="tel" required></div>
      <div class="champ"><label for="r-quand">Quand vous rappeler ?</label><select id="r-quand" name="creneau"><option>Peu importe</option><option>Plutôt le matin</option><option>Plutôt l’après-midi</option></select></div>
      <div class="champ"><label for="r-voyage">Voyage qui vous intéresse</label><select id="r-voyage" name="voyage">${optionsVoyages('')}</select></div>
      <div class="pot" aria-hidden="true"><label for="r-web">Ne pas remplir</label><input id="r-web" name="site_web" tabindex="-1" autocomplete="off"></div>
      <label class="case" for="r-ok"><input id="r-ok" name="consentement" type="checkbox" required><span>J’accepte d’être rappelé par l’agence (<a href="${racine}cookies.html">confidentialité</a>). *</span></label>
      <button class="btn btn--orange btn--bloc" type="submit">${ico('phone')} Me faire rappeler</button>
    </form>
  </div>
</dialog>`;
}

function pied(racine) {
  return `<footer class="pied">
  <div class="conteneur">
    <div class="pied__grille">
      <div>
        <img src="${racine}assets/img/logo-light.png" alt="Voyages Loisirs by Aya" width="900" height="354" loading="lazy">
        <p>Des circuits accompagnés en petits groupes, avec un guide francophone, préparés par une agence parisienne de la rue des Mathurins.</p>
        <div style="display:flex;gap:10px">${reseaux()}</div>
      </div>
      <div>
        <h2>Nous joindre</h2>
        <ul>
          <li><a href="${TEL_HREF}">${TEL.replace(/ /g, FINE)}</a></li>
          <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
          <li>${esc(ADRESSE)}</li>
          <li>Métro Saint-Lazare, Havre-Caumartin</li>
        </ul>
      </div>
      <div>
        <h2>Nos voyages</h2>
        <ul>${TRIPS.map((t) => `<li><a href="${racine}voyages/${t.slug}.html">${esc(nomCourt(t))}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h2>Informations</h2>
        <ul>
          <li><a href="${racine}agence.html">L’agence</a></li>
          <li><a href="${racine}contact.html">Contact</a></li>
          <li><a href="${racine}mentions-legales.html">Mentions légales</a></li>
          <li><a href="${racine}cookies.html">Cookies et confidentialité</a></li>
          <li><a href="https://www.ayavoyages.com/" rel="noopener">ayavoyages.com ↗</a></li>
        </ul>
      </div>
    </div>
    <div class="pied__bas">
      <span>© <span data-annee>2026</span> Voyages Loisirs by Aya — KTS Tourisme et Voyage SARL</span>
      <span>Atout France IM075100068 · Garantie financière APST · RC pro Hiscox</span>
    </div>
  </div>
</footer>
<a class="rappel-flottant" href="${racine}contact.html" data-rappel>${ico('phone')} Être rappelé</a>
<button class="haut" type="button" aria-label="Revenir en haut de la page">${ico('up')}</button>
${modaleRappel(racine)}
<script src="${racine}assets/js/site.js" defer></script>`;
}

function page({ fichier, titre, description, pageId, racine = '', pleine = false, image, corps }) {
  const html = `${tete({ titre, description, racine, image })}
<body>
${barre({ racine, page: pageId, pleine })}
<main id="contenu">
${corps}
</main>
${pied(racine)}
</body>
</html>
`.replace(/\{\{r\}\}/g, racine);
  const chemin = join(RACINE, fichier);
  mkdirSync(dirname(chemin), { recursive: true });
  writeFileSync(chemin, html);
  console.log('écrit', fichier);
}

/* ---------------- composants ---------------- */
function carteVoyage(t, racine, i = 0) {
  const img = t.images.ouverture;
  return `<a class="carte" href="${racine}voyages/${t.slug}.html" data-anim style="--delai:${(i % 2) * 0.12}s">
  <span class="carte__img"><img src="${unsplash(img.id, 1000)}" srcset="${srcset(img.id)}" sizes="(min-width:760px) 50vw, 100vw" alt="${esc(img.alt)}" loading="lazy" decoding="async"></span>
  <span class="carte__pays">${esc(t.pays || t.country)}</span>
  <span class="carte__corps">
    <span class="carte__meta">${esc(periodeCarte(t))} · ${esc(t.duration)}</span>
    <h3>${esc(nomCourt(t))}</h3>
    <span class="carte__desc">${esc(accroche(t))} ${esc(t.lieux ? t.lieux.replace(/, ([^,]+)$/, ' et $1') + '.' : '')}</span>
    <span class="carte__pied">
      <span class="carte__prix">${t.priceFrom ? `à partir de<strong>${euros(t.priceFrom)}</strong>/ pers.` : `tarif<strong>sur demande</strong>`}</span>
      <span class="carte__fleche">${ico('arrow')}</span>
    </span>
  </span>
</a>`;
}

const FAQ_ACCUEIL = [
  ['Les vols sont-ils inclus dans le prix ?', 'Oui : sur nos circuits, le vol aller-retour au départ de Paris et les taxes d’aéroport sont compris, comme les transferts, les hôtels et les visites indiquées au programme. Le détail de ce qui est compris figure sur chaque fiche.'],
  ['Comment fonctionne le paiement en plusieurs fois ?', 'Le règlement peut être échelonné, jusqu’en 10 fois sans frais. L’agence vous présente l’échéancier avec votre devis ; rien ne se paie sur ce site.'],
  ['À combien part-on ?', 'Dix personnes au minimum, le plus souvent entre douze et vingt-cinq. Un petit groupe, un seul autocar, personne qui attend personne.'],
  ['Et si on ne parle pas la langue ?', 'Un guide francophone vous accompagne du premier au dernier jour. Vous n’avez rien à traduire, pas même la carte du restaurant.'],
  ['Nous ne sommes que deux, c’est possible ?', 'Oui : vous rejoignez un départ déjà ouvert. Nous vous disons combien de places il reste.'],
  ['Qu’est-ce qui n’est pas compris ?', 'Les assurances, les pourboires et, sur certains circuits, un forfait de visites et de repas réglé sur place : 250 € en Chine, 70 € en Pologne, 350 € au Panama. Tout est indiqué sur chaque fiche.'],
];
const faq = (liste) => `<div class="faq">${liste.map(([q, r], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)} ${ico('down')}</summary><div class="faq__rep"><p>${esc(r)}</p></div></details>`).join('')}</div>`;

/* ---------------- ACCUEIL ---------------- */
function accueil() {
  const r = '';
  const etapes = [
    { t: 'Choisissez votre voyage', p: 'Parcourez nos circuits accompagnés et trouvez celui qui vous ressemble.', d: `<ul class="liste-voyages">${CIRCUITS.map((t) => `<li><a href="voyages/${t.slug}.html"><img src="${unsplash(t.images.ouverture.id, 120, 80)}" alt="" width="50" height="34" loading="lazy">${esc(nomCourt(t))}<span class="prix">${prixCourt(t)}</span></a></li>`).join('')}</ul><p class="etape-note"><strong>${CIRCUITS.length}</strong> circuits accompagnés · départs <strong>2027</strong></p>` },
    { t: 'Demandez à être rappelé', p: 'Un formulaire de deux minutes, ou un simple appel. Aucun engagement à ce stade.', d: `<ul class="coches"><li>${ico('check')} Un conseiller vous rappelle sous deux jours ouvrés</li><li>${ico('check')} Il vérifie les places et répond à vos questions</li></ul><p style="margin:20px 0 6px;color:rgba(255,255,255,.8);font-size:14px">Ou appelez directement :</p><a class="gros-tel" href="${TEL_HREF}">${TEL.replace(/ /g, FINE)}</a>` },
    { t: 'Recevez programme et devis', p: 'Le programme jour par jour et le tarif exact de votre date, par e-mail ou par courrier.', d: `<ul class="coches"><li>${ico('check')} Le programme détaillé, jour par jour</li><li>${ico('check')} Le prix définitif de votre date</li><li>${ico('check')} Paiement possible en plusieurs fois</li><li>${ico('check')} Vous confirmez seulement si tout vous convient</li></ul>` },
    { t: 'Partez l’esprit léger', p: 'Rendez-vous à l’aéroport : votre groupe et votre guide vous attendent.', d: `<ul class="coches"><li>${ico('check')} Guide francophone du premier au dernier jour</li><li>${ico('check')} Vols, hôtels, transferts et visites réservés</li><li>${ico('check')} Une agence joignable pendant tout le voyage</li><li>${ico('check')} Garantie financière APST</li></ul>` },
  ];
  const corps = `
<section class="heros" aria-labelledby="heros-titre">
  <div class="heros__media" data-diaporama>
    ${HEROS.map((d, i) => `<figure class="diapo${i === 0 ? ' is-active' : ''}">
      <img src="${d.img}" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
      ${d.video ? `<video muted loop playsinline preload="none" data-src="${d.video}" aria-hidden="true"></video>` : ''}
      <figcaption>${ico('pin')} ${esc(d.lieu)}</figcaption>
    </figure>`).join('')}
  </div>
  <div class="conteneur heros__contenu">
    <h1 class="heros__titre" id="heros-titre">Prenez le temps de voir le monde</h1>
    <p class="heros__texte">Des circuits culturels accompagnés, en petits groupes, avec un guide francophone à chaque étape. Vous n’avez qu’à profiter, nous nous occupons de tout.</p>
    <div class="heros__actions">
      <a class="btn btn--orange btn--maj" href="#destinations">Nos destinations</a>
      <a class="btn btn--contour btn--maj" href="contact.html" data-rappel>Être rappelé</a>
    </div>
  </div>
  <div class="atouts">
    <ul class="conteneur">
      <li>${ico('users')} Circuits accompagnés en petits groupes</li>
      <li>${ico('chat')} Guides francophones à chaque étape</li>
      <li>${ico('card')} Paiement en plusieurs fois sans frais</li>
      <li>${ico('shield')} Garantie financière APST</li>
    </ul>
  </div>
</section>

<section class="section" id="destinations" aria-labelledby="dest-titre">
  <div class="conteneur">
    <div class="entete" data-anim>
      <h2 class="titre" id="dest-titre">Choisissez <em>votre voyage</em></h2>${trait}
    </div>
    <div class="cartes">${CIRCUITS.map((t, i) => carteVoyage(t, r, i)).join('')}</div>
    <div class="centre" data-anim><a class="btn btn--orange btn--maj" href="voyages.html">Toutes les destinations</a></div>
  </div>
</section>

<section class="section etapes" aria-labelledby="etapes-titre">
  <div class="etapes__fond"><img src="${unsplash(PHOTOS.etapes, 1800)}" alt="" loading="lazy"></div>
  <div class="conteneur sur-fond">
    <div class="entete" data-anim><span class="surtitre">Simple et sans souci</span><h2 class="titre" id="etapes-titre">Comment ça marche ?</h2></div>
    <div class="etapier" data-etapier data-anim="zoom">
      <div class="etapier__gauche">${etapes.map((e, i) => `<div class="etape-g" data-etape-gauche${i ? ' hidden' : ''}><div class="etape-num">${i + 1}</div><h3>${esc(e.t)}</h3><p>${esc(e.p)}</p></div>`).join('')}</div>
      <div class="etapier__droite">${etapes.map((e, i) => `<div class="etape"${i ? ' hidden' : ''}>${e.d}</div>`).join('')}</div>
    </div>
    <div class="progression" role="group" aria-label="Étapes">${etapes.map((e, i) => `<button type="button" aria-label="Étape ${i + 1} : ${esc(e.t)}"></button>`).join('')}</div>
    <div class="etapes__libelles" aria-hidden="true">${etapes.map((e) => `<span>${esc(e.t)}</span>`).join('')}</div>
  </div>
</section>

<section class="section aya" aria-labelledby="aya-titre">
  <div class="aya__fond"><img src="${unsplash(PHOTOS.aya, 1800)}" alt="" loading="lazy"></div>
  <div class="conteneur">
    <div class="aya__gauche" data-anim="gauche">
      <div class="aya__marque" aria-hidden="true"><b>AYA</b><span>VOYAGES</span></div>
      <div class="aya__texte">
        <span class="surtitre" style="color:var(--orange)">Voyages Loisirs, c’est by Aya</span>
        <h2 id="aya-titre">Envie d’aller plus loin ?</h2>
        <p>Voyages Loisirs fait partie du groupe Aya. Sur ayavoyages.com, retrouvez encore plus de destinations et des services complets pour organiser tout votre voyage, de A à Z.</p>
        <a class="btn btn--orange" href="https://www.ayavoyages.com/" rel="noopener">Découvrir Aya Voyages ${ico('arrow', 'icone--fleche')}</a>
      </div>
    </div>
    <div class="verres">
      <div class="verre" data-anim style="--delai:0s">${ico('map')}<h3>Plus de circuits</h3><p>Un choix élargi de circuits accompagnés partout dans le monde.</p></div>
      <div class="verre" data-anim style="--delai:.1s">${ico('edit')}<h3>Voyages sur mesure</h3><p>Un itinéraire conçu pour vous, à votre rythme et selon votre budget.</p></div>
      <div class="verre" data-anim style="--delai:.2s">${ico('plane')}<h3>Billetterie</h3><p>Vos vols réservés au meilleur tarif par nos conseillers.</p></div>
      <div class="verre" data-anim style="--delai:.3s">${ico('bed')}<h3>Hôtels & transferts</h3><p>Hébergements sélectionnés et transferts pris en charge à l’arrivée.</p></div>
    </div>
  </div>
</section>

<section class="section section--blanc" aria-labelledby="faq-titre">
  <div class="conteneur" style="max-width:820px">
    <div class="entete" data-anim><span class="surtitre">Questions fréquentes</span><h2 class="titre" id="faq-titre">Vos <em>questions</em></h2>${trait}</div>
    <div data-anim>${faq(FAQ_ACCUEIL)}</div>
  </div>
</section>

<section class="section" id="demande" aria-labelledby="demande-titre">
  <div class="conteneur duo">
    <div data-anim="gauche">
      <span class="surtitre">Demande d’information</span>
      <h2 class="titre" id="demande-titre">Parlons de <em>votre voyage</em></h2>
      <p style="margin-top:18px;color:var(--gris)">Dites-nous quel voyage vous tente : nous vous rappelons, nous répondons à vos questions, puis nous vous envoyons le programme et le devis. Rien n’est engagé à ce stade.</p>
      <div class="infos" style="margin-top:26px">
        <div class="info"><span class="info__ico">${ico('phone')}</span><div><h3>Par téléphone</h3><p><a href="${TEL_HREF}">${TEL.replace(/ /g, FINE)}</a></p></div></div>
        <div class="info"><span class="info__ico">${ico('mail')}</span><div><h3>Par e-mail</h3><p><a href="mailto:${EMAIL}">${EMAIL}</a></p></div></div>
        <div class="info"><span class="info__ico">${ico('pin')}</span><div><h3>À l’agence</h3><p>${esc(ADRESSE)}</p></div></div>
      </div>
    </div>
    <div class="carte-form" data-anim="droite">
      <h2>Votre demande</h2>
      <p>Réponse sous deux jours ouvrés.</p>
      ${formulaire({ id: 'fa', sujet: 'Demande d’information via le site' })}
    </div>
  </div>
</section>`;
  page({ fichier: 'index.html', pageId: 'accueil', titre: 'Voyages Loisirs by Aya — Circuits accompagnés en petits groupes', description: 'Circuits culturels accompagnés en petits groupes, avec un guide francophone : Chine, Pologne, Panama, Crète. Agence Aya Voyages, Paris 8e. 01 42 68 68 06.', image: PHOTOS.herosAffiche, corps });
}

/* ---------------- DESTINATIONS ---------------- */
function destinations() {
  const corps = `
<section class="heros-page heros-page--court">
  <div class="heros-page__media"><img src="${unsplash(PHOTOS.destinations, 1800)}" alt="" fetchpriority="high"></div>
  <div class="conteneur heros-page__contenu">
    <nav class="ariane" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › <span>Destinations</span></nav>
    <h1>Nos destinations</h1>
    <p>${CIRCUITS.length} circuits accompagnés en petits groupes, et une escapade en Normandie. Guide francophone, vols et hôtels compris.</p>
  </div>
</section>
<section class="section">
  <div class="conteneur">
    <div class="entete" data-anim><h2 class="titre">Les circuits <em>2027</em></h2>${trait}<p>Cliquez sur un voyage pour lire le programme jour par jour, les dates, les prix et ce qui est compris.</p></div>
    <div class="cartes">${CIRCUITS.map((t, i) => carteVoyage(t, '', i)).join('')}</div>
  </div>
</section>
<section class="section section--creme2">
  <div class="conteneur">
    <div class="entete" data-anim><span class="surtitre">Escapade</span><h2 class="titre">Deux jours à <em>1 h 30 de Paris</em></h2></div>
    <div class="cartes" style="max-width:720px;margin:0 auto;grid-template-columns:1fr">${TRIPS.filter((t) => t.horsSerie).map((t) => carteVoyage(t, '')).join('')}</div>
  </div>
</section>
<section class="section"><div class="conteneur">${bandeau('')}</div></section>`;
  page({ fichier: 'voyages.html', pageId: 'voyages', titre: 'Nos destinations — Voyages Loisirs by Aya', description: 'Tous nos circuits accompagnés 2027 : Chine, Pologne, Panama, Crète, et une escapade en Normandie. Dates, prix et programmes.', corps });
}

function bandeau(racine) {
  return `<div class="bandeau" data-anim="zoom">
  <div><h2>Une question ? Parlons-en.</h2><p>Un conseiller vous répond du lundi au vendredi, ou vous rappelle quand vous voulez.</p></div>
  <div class="bandeau__actions"><a class="btn btn--marine" href="${TEL_HREF}">${ico('phone')} ${TEL.replace(/ /g, FINE)}</a><a class="btn btn--contour" href="${racine}contact.html" data-rappel>Être rappelé</a></div>
</div>`;
}

/* ---------------- FICHE VOYAGE ---------------- */
function fiche(t) {
  const r = '../';
  const img = t.images.ouverture;
  const autres = TRIPS.filter((x) => x.slug !== t.slug && !x.horsSerie).slice(0, 2);
  const dates = t.departures.length
    ? `<table class="tableau"><thead><tr><th>Départ</th><th>Retour</th><th>Prix / pers.</th><th>Chambre seule</th><th><span class="sr-only">Demander</span></th></tr></thead><tbody>${t.departures.map((d) => `<tr><td data-label="Départ">${esc(d.from)}</td><td data-label="Retour">${esc(d.to)}</td><td data-label="Prix / pers." class="prix">${euros(d.price)}</td><td data-label="Chambre seule">${d.singleSupplement ? '+' + FINE + euros(d.singleSupplement) : '—'}</td><td data-label=""><a class="btn btn--orange" style="min-height:42px;padding:0 18px;font-size:14px" href="#demande" data-date="${esc(d.from + ' → ' + d.to)}">Demander</a></td></tr>`).join('')}</tbody></table>
       <p style="margin-top:14px;font-size:14px;color:var(--gris)">Prix par personne en chambre double, vol depuis Paris compris, à confirmer par l’agence au moment du devis.</p>`
    : `<div class="encart"><strong>${t.slug === 'chateau-avesnes' ? 'Toute l’année.' : 'Dates 2027 en préparation.'}</strong> ${esc(t.datesEncadre || t.datesNote || '')} <a href="#demande">Laissez-nous vos coordonnées</a>, nous vous prévenons en premier.</div>`;
  const corps = `
<section class="heros-page">
  <div class="heros-page__media"><img src="${unsplash(img.id, 1800)}" srcset="${srcset(img.id)}" sizes="100vw" alt="${esc(img.alt)}" fetchpriority="high"></div>
  <div class="conteneur heros-page__contenu">
    <nav class="ariane" aria-label="Fil d’Ariane"><a href="${r}index.html">Accueil</a> › <a href="${r}voyages.html">Destinations</a> › <span>${esc(nomCourt(t))}</span></nav>
    <span class="surtitre" style="color:var(--orange)">${esc(t.category)} · ${esc(t.pays || t.country)}</span>
    <h1>${esc(t.title)}</h1>
    <div class="puces">
      <span class="puce">${ico('calendar')} ${esc(t.duration)}</span>
      <span class="puce">${ico('users')} ${t.minimum ? `dès ${t.minimum} personnes` : 'petit groupe'}</span>
      ${t.horsSerie ? '' : `<span class="puce">${ico('guide')} guide francophone</span>`}
      <span class="puce">${ico('euro')} ${prixCourt(t)}</span>
    </div>
  </div>
</section>
<div class="section"><div class="conteneur fiche">
  <div class="fiche__main">
    <section aria-labelledby="bref" data-anim>
      <span class="surtitre">Le voyage en bref</span>
      <h2 id="bref">${esc(t.lieux || 'L’essentiel')}</h2>
      <p class="chapeau">${esc(t.chapeau || t.excerpt)}</p>
      <div class="points">${(t.reperes || t.highlights).map((h) => `<div class="point">${ico('star')}<span>${esc(h)}</span></div>`).join('')}</div>
      ${t.aSavoir ? `<div class="encart"><strong>À savoir :</strong> ${esc(t.aSavoir)}</div>` : ''}
    </section>
    <section aria-labelledby="prog">
      <span class="surtitre">Programme</span>
      <h2 id="prog">Jour par jour</h2>
      <ol class="programme">${t.recit.map((j) => `<li class="jour" id="jour-${j.jour}" data-anim><span class="jour__num"><small>Jour</small>${j.jour}</span><div class="jour__carte"><span class="jour__lieu">${esc(j.lieu || '')}</span><h3>${esc(j.intertitre || '')}</h3><p>${esc(j.texte)}</p>${j.notes && j.notes.length && !j.sobre ? `<div class="jour__tags">${j.notes.map((n) => `<span>${esc(n)}</span>`).join('')}</div>` : ''}</div></li>`).join('')}</ol>
    </section>
    <section aria-labelledby="compris" data-anim>
      <span class="surtitre">Le prix</span>
      <h2 id="compris">Ce qui est compris</h2>
      <div class="compris">
        <div class="oui"><h3>${ico('check')} Compris</h3><ul>${t.included.map((x) => `<li>${ico('check')}<span>${esc(x)}</span></li>`).join('')}</ul></div>
        <div class="non"><h3>${ico('x')} Non compris</h3><ul>${t.excluded.map((x) => `<li>${ico('x')}<span>${esc(x)}</span></li>`).join('')}</ul></div>
      </div>
    </section>
    <section aria-labelledby="dates" id="dates" data-anim>
      <span class="surtitre">Dates et prix</span>
      <h2 id="dates-titre">Les départs</h2>
      ${dates}
    </section>
    ${t.faq && t.faq.length ? `<section aria-labelledby="q" data-anim><span class="surtitre">Questions</span><h2 id="q">Vos questions sur ce voyage</h2>${faq(t.faq.map((x) => [x.q, x.r]))}</section>` : ''}
    <section id="demande" aria-labelledby="demande-titre" data-anim>
      <div class="carte-form">
        <h2 id="demande-titre">Demander ce voyage</h2>
        <p>Nous vérifions les places, nous vous rappelons, puis vous recevez le programme et le devis. Sans engagement.</p>
        ${formulaire({ id: 'fv', sujet: `Demande — ${nomCourt(t)}`, voyage: t.slug })}
      </div>
    </section>
  </div>
  <aside class="reserve" aria-label="Réserver">
    <div class="reserve__prix">${t.priceFrom ? 'À partir de' : 'Tarif'}<strong>${t.priceFrom ? euros(t.priceFrom) : 'Sur demande'}</strong>${t.priceFrom ? 'par personne, vol compris' : 'selon la formule choisie'}</div>
    <ul>
      <li>${ico('calendar')} ${esc(t.duration)}</li>
      <li>${ico('clock')} ${esc(t.departures.length ? t.departures.map((d) => d.from.slice(0, 5).replace('/', '.') + ' → ' + d.to).join(' · ') : periodeCarte(t))}</li>
      <li>${ico('users')} ${t.minimum ? `Départ garanti dès ${t.minimum} personnes` : 'Petit groupe'}</li>
      ${t.horsSerie ? '' : `<li>${ico('guide')} Guide francophone</li>`}
    </ul>
    <a class="btn btn--orange" href="#demande">Demander ce voyage</a>
    <a class="btn btn--contour-marine" href="${r}contact.html" data-rappel data-voyage="${t.slug}">${ico('phone')} Être rappelé</a>
    <p class="reserve__note">Ou appelez le <a href="${TEL_HREF}">${TEL.replace(/ /g, FINE)}</a></p>
  </aside>
</div></div>
<section class="section section--creme2" aria-labelledby="autres">
  <div class="conteneur">
    <div class="entete" data-anim><h2 class="titre" id="autres">Ces voyages pourraient <em>vous plaire</em></h2>${trait}</div>
    <div class="cartes">${autres.map((x, i) => carteVoyage(x, r, i)).join('')}</div>
  </div>
</section>`;
  page({ fichier: `voyages/${t.slug}.html`, pageId: 'voyages', racine: r, titre: `${t.title} — Voyages Loisirs by Aya`, description: (t.seo && t.seo.description) || t.excerpt, image: unsplash(img.id, 1200, 630), corps });
}

/* ---------------- AGENCE ---------------- */
function agence() {
  const corps = `
<section class="heros-page heros-page--court">
  <div class="heros-page__media"><img src="${unsplash(PHOTOS.agence, 1800)}" alt="" fetchpriority="high"></div>
  <div class="conteneur heros-page__contenu">
    <nav class="ariane" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › <span>L’agence</span></nav>
    <h1>Une agence de quartier, des voyages bien préparés</h1>
  </div>
</section>
<section class="section section--blanc">
  <div class="conteneur duo">
    <div class="duo__texte" data-anim="gauche">
      <span class="surtitre">Qui sommes-nous</span>
      <h2 class="titre">Rue des Mathurins, <em>Paris 8e</em></h2>
      <p style="margin-top:18px">Voyages Loisirs est la collection de voyages accompagnés d’Aya Voyages, agence du 8e arrondissement, entre la gare Saint-Lazare et l’Opéra. On y entre pour un billet d’avion ; on y revient pour un circuit.</p>
      <p>Nous proposons peu de voyages, mais nous les connaissons bien : l’hôtel, le guide, l’heure du train. Chaque circuit part en petit groupe, avec un guide francophone du premier au dernier jour, et tout est organisé avant votre départ.</p>
      <p>Une question ? Passez nous voir, ou appelez-nous : c’est encore comme ça qu’on prépare le mieux un voyage.</p>
    </div>
    <div class="duo__photo" data-anim="droite"><img src="${unsplash(PHOTOS.aya, 1200)}" alt="Paysage de montagne au crépuscule" loading="lazy"></div>
  </div>
</section>
<section class="section">
  <div class="conteneur">
    <div class="entete" data-anim><span class="surtitre">Notre façon de voyager</span><h2 class="titre">Ce qui ne change <em>jamais</em></h2>${trait}</div>
    <div class="valeurs">
      <div class="valeur" data-anim>${ico('users')}<h3>Des petits groupes</h3><p>Dix personnes au minimum, rarement plus de vingt-cinq. Un seul autocar, personne n’attend personne.</p></div>
      <div class="valeur" data-anim style="--delai:.1s">${ico('chat')}<h3>Un guide francophone</h3><p>Du premier matin au dernier soir, quelqu’un qui parle votre langue et connaît la sienne.</p></div>
      <div class="valeur" data-anim style="--delai:.2s">${ico('heart')}<h3>Tout est organisé</h3><p>Vols, hôtels, transferts, entrées et horaires : vous n’avez qu’à regarder.</p></div>
      <div class="valeur" data-anim style="--delai:.3s">${ico('shield')}<h3>Des garanties</h3><p>Immatriculation Atout France IM075100068, garantie financière APST, RC professionnelle Hiscox.</p></div>
    </div>
  </div>
</section>
<section class="section aya" aria-labelledby="aya-titre">
  <div class="aya__fond"><img src="${unsplash(PHOTOS.aya, 1800)}" alt="" loading="lazy"></div>
  <div class="conteneur">
    <div class="aya__gauche" data-anim="gauche">
      <div class="aya__marque" aria-hidden="true"><b>AYA</b><span>VOYAGES</span></div>
      <div class="aya__texte"><h2 id="aya-titre">Le groupe Aya Voyages</h2><p>Billetterie, voyages sur mesure, hôtels et transferts : retrouvez tous les services de l’agence sur ayavoyages.com.</p><a class="btn btn--orange" href="https://www.ayavoyages.com/" rel="noopener">Découvrir Aya Voyages ${ico('arrow', 'icone--fleche')}</a></div>
    </div>
    <div class="verres">
      <div class="verre" data-anim>${ico('map')}<h3>Plus de circuits</h3><p>Un choix élargi de circuits accompagnés partout dans le monde.</p></div>
      <div class="verre" data-anim style="--delai:.1s">${ico('edit')}<h3>Voyages sur mesure</h3><p>Un itinéraire conçu pour vous, à votre rythme et selon votre budget.</p></div>
      <div class="verre" data-anim style="--delai:.2s">${ico('plane')}<h3>Billetterie</h3><p>Vos vols réservés au meilleur tarif par nos conseillers.</p></div>
      <div class="verre" data-anim style="--delai:.3s">${ico('bed')}<h3>Hôtels & transferts</h3><p>Hébergements sélectionnés et transferts pris en charge à l’arrivée.</p></div>
    </div>
  </div>
</section>
<section class="section"><div class="conteneur">${bandeau('')}</div></section>`;
  page({ fichier: 'agence.html', pageId: 'agence', titre: 'L’agence — Voyages Loisirs by Aya', description: 'Voyages Loisirs, la collection de voyages accompagnés d’Aya Voyages, agence du 8e arrondissement de Paris, rue des Mathurins.', corps });
}

/* ---------------- CONTACT ---------------- */
function contact() {
  const corps = `
<section class="heros-page heros-page--court">
  <div class="heros-page__media"><img src="${unsplash(PHOTOS.contact, 1800)}" alt="" fetchpriority="high"></div>
  <div class="conteneur heros-page__contenu">
    <nav class="ariane" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › <span>Contact</span></nav>
    <h1>Contactez-nous</h1>
    <p>Par téléphone, par e-mail ou à l’agence : un conseiller vous répond et vous envoie le programme du voyage qui vous tente.</p>
  </div>
</section>
<section class="section" id="demande">
  <div class="conteneur contact">
    <div class="infos" data-anim="gauche">
      <div class="info"><span class="info__ico">${ico('phone')}</span><div><h3>Téléphone</h3><p><a href="${TEL_HREF}">${TEL.replace(/ /g, FINE)}</a><br>Du lundi au vendredi</p></div></div>
      <div class="info"><span class="info__ico">${ico('mail')}</span><div><h3>E-mail</h3><p><a href="mailto:${EMAIL}">${EMAIL}</a></p></div></div>
      <div class="info"><span class="info__ico">${ico('pin')}</span><div><h3>L’agence</h3><p>${esc(ADRESSE)}<br>Métro Saint-Lazare, Havre-Caumartin, Opéra<br><a href="https://www.google.com/maps/search/?api=1&query=49+rue+des+Mathurins+75008+Paris" rel="noopener" target="_blank">Voir sur le plan ↗</a></p></div></div>
      <div class="info"><span class="info__ico">${ico('clock')}</span><div><h3>Rappel</h3><p>Réponse sous deux jours ouvrés.<br><a href="contact.html" data-rappel>Être rappelé →</a></p></div></div>
    </div>
    <div class="carte-form" data-anim="droite">
      <h2>Votre demande</h2>
      <p>Indiquez le voyage qui vous intéresse : nous vous rappelons avec les places disponibles et le prix exact.</p>
      ${formulaire({ id: 'fc', sujet: 'Demande via la page contact' })}
    </div>
  </div>
</section>`;
  page({ fichier: 'contact.html', pageId: 'contact', titre: 'Contact — Voyages Loisirs by Aya', description: 'Contactez Voyages Loisirs by Aya : 01 42 68 68 06, reservation@ayavoyages.fr, 49 rue des Mathurins, 75008 Paris.', corps });
}

/* ---------------- pages simples ---------------- */
function simple(fichier, titre, h1, contenu, pageId = '') {
  const corps = `
<section class="heros-page heros-page--court" style="min-height:34svh">
  <div class="conteneur heros-page__contenu">
    <nav class="ariane" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › <span>${esc(h1)}</span></nav>
    <h1>${esc(h1)}</h1>
  </div>
</section>
<section class="section section--blanc"><div class="conteneur"><div class="texte-long">${contenu}</div></div></section>`;
  page({ fichier, pageId, titre: `${titre} — Voyages Loisirs by Aya`, description: `${titre} du site Voyages Loisirs by Aya.`, corps, pleine: true });
}

function centre(fichier, titre, contenu, robots = true) {
  page({ fichier, pageId: '', pleine: true, titre: `${titre} — Voyages Loisirs by Aya`, description: titre, corps: `<section class="section centrage"><div class="conteneur">${contenu}</div></section>` });
  if (robots) {
    const p = join(RACINE, fichier);
    writeFileSync(p, readFileSync(p, 'utf8').replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"'));
  }
}

/* ---------------- génération ---------------- */
accueil();
destinations();
TRIPS.forEach(fiche);
agence();
contact();
simple('mentions-legales.html', 'Mentions légales', 'Mentions légales', readFileSync(join(RACINE, 'content/mentions-legales.html'), 'utf8'));
simple('cookies.html', 'Cookies et confidentialité', 'Cookies et confidentialité', readFileSync(join(RACINE, 'content/cookies.html'), 'utf8'));
centre('merci.html', 'Merci', `<div class="code404" style="font-size:80px">${'✓'}</div><h1>Merci, c’est envoyé</h1><p>Votre demande est bien arrivée à l’agence. Une personne vous rappelle sous deux jours ouvrés. Pressé ? Appelez le <a href="${TEL_HREF}">${TEL.replace(/ /g, FINE)}</a>.</p><a class="btn btn--orange" href="index.html">Retour à l’accueil</a>`);
// 404 : page d’erreur (GitHub Pages la sert automatiquement)
centre('404.html', 'Page introuvable', `<div class="code404">404</div><h1>Cette page n’existe pas</h1><p>Elle a peut-être changé d’adresse. Nos voyages, eux, sont toujours là.</p><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><a class="btn btn--orange" href="voyages.html">Nos destinations</a><a class="btn btn--contour-marine" href="index.html">Accueil</a></div>`);
// ancienne adresse voyage.html?slug=… → nouvelle fiche
writeFileSync(join(RACINE, 'voyage.html'), `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Redirection — Voyages Loisirs by Aya</title>
<script>(function(){var s=new URLSearchParams(location.search).get('slug')||'';var ok=${JSON.stringify(TRIPS.map((t) => t.slug))};location.replace(ok.indexOf(s)>-1?'voyages/'+s+'.html':'voyages.html');})();</script>
<meta http-equiv="refresh" content="2;url=voyages.html"></head>
<body><p><a href="voyages.html">Voir nos destinations</a></p></body></html>
`);
console.log('écrit voyage.html');
