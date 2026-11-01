#!/usr/bin/env node
/*
  scripts/build-chapitres.mjs — Le Carnet d’itinéraires, Voyages Loisirs by Aya
  ===========================================================================
  Génère les pages de chapitre voyages/<slug>.html à partir de :
    · data/trips.js              (les cinq voyages, source unique)
    · data/site.js               (constantes du site : baseUrl, téléphone…)
    · templates/chapitre.html    (le gabarit)
    · templates/partials/*.html  (barre, overlay, ours, scripts… inclus par {{> nom}})

  COMMANDE (à la racine du dépôt, Node 18 ou plus récent, aucune dépendance) :
      node scripts/build-chapitres.mjs             écrit voyages/<slug>.html pour chaque voyage
      node scripts/build-chapitres.mjs --verifier  n’écrit rien ; code de sortie 1 si une page
                                                   du dépôt diffère de ce qui serait généré
  Les pages générées sont commitées : le site fonctionne sans Node.

  MINI-MOTEUR DE GABARIT (maison, une soixantaine de lignes) :
      {{champ}}                 valeur échappée pour l’HTML, typographie française appliquée
                                (espaces insécables avant ? ! ; : et dans les nombres)
      {{{brut}}}                valeur insérée telle quelle (HTML déjà prêt, JSON-LD)
      {{a.b.c}}                 accès pointé ; {{this}} l’élément courant d’une boucle ;
                                {{@index}} {{@num}} {{@first}} {{@last}} dans une boucle
      {{#each liste}}…{{else}}…{{/each}}
      {{#if champ}}…{{else}}…{{/if}}      (vide, null, 0, false et tableau vide = faux)
      {{#unless champ}}…{{/unless}}
      {{> nom}}                 inclut templates/partials/nom.html (commentaire d’en-tête retiré)
      {{! commentaire }}
  Une balise de bloc seule sur sa ligne ne laisse pas de ligne vide dans la sortie.
  La résolution des noms remonte les portées (une boucle voit les champs de la page).
*/
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const TRIPS = require(join(RACINE, 'data/trips.js'));
const SITE = require(join(RACINE, 'data/site.js'));
const VERIFIER = process.argv.includes('--verifier');

const NBSP = ' ', FINE = ' ';
const ROOT = '../'; /* les chapitres vivent dans voyages/ */

/* ======================================================================
   1. Typographie française et échappement
   ====================================================================== */
const ESP = '[   ]'; /* un espace quelconque : la fonction est idempotente */
function typo(s) {
  return String(s)
    .replace(new RegExp(ESP + '([?!;])', 'g'), FINE + '$1')
    .replace(new RegExp(ESP + '(:)', 'g'), NBSP + '$1')
    .replace(new RegExp('«' + ESP, 'g'), '«' + NBSP)
    .replace(new RegExp(ESP + '»', 'g'), NBSP + '»')
    .replace(new RegExp('(\\d)' + ESP + '(\\d{3})(?!\\d)', 'g'), '$1' + FINE + '$2')
    .replace(new RegExp('(\\d)' + ESP + '€', 'g'), '$1' + NBSP + '€')
    .replace(new RegExp('(\\d)' + ESP + '%', 'g'), '$1' + FINE + '%')
    .replace(new RegExp('\\+' + ESP + '(\\d)', 'g'), '+' + FINE + '$1')
    .replace(new RegExp('(\\d)' + ESP + '→' + ESP + '(\\d)', 'g'), '$1' + NBSP + '→' + NBSP + '$2') /* plages de dates : insécable des deux côtés */
    .replace(new RegExp(ESP + '→' + ESP + '(?=\\D)', 'g'), NBSP + '→ ') /* entre deux mots : insécable avant la flèche seulement, pour que « Varsovie → Cracovie » puisse se couper dans une colonne étroite */
    .replace(new RegExp('(\\d)' + ESP + 'h' + ESP + '(\\d)', 'g'), '$1' + NBSP + 'h' + NBSP + '$2')
    .replace(new RegExp('N°' + ESP + '?(\\d)', 'g'), 'N°' + NBSP + '$1')
    .replace(new RegExp('(\\d)' + ESP + '(jours?|nuits?|personnes?|participants?|km|°C|hectares|minutes?|heures?)\\b', 'g'), '$1' + NBSP + '$2')
    .replace(new RegExp('\\b(Jour|jours?)' + ESP + '(\\d)', 'g'), '$1' + NBSP + '$2');
}
function echapper(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function pad(n) { return (n < 10 ? '0' : '') + n; }
function prix(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, FINE) + NBSP + '€'; }

/* ======================================================================
   2. Mini-moteur de gabarit
   ====================================================================== */
const BALISE = /\{\{\{\s*([^{}]+?)\s*\}\}\}|\{\{\s*([^{}]+?)\s*\}\}/g;

function decouper(src) {
  const jetons = [];
  let dernier = 0, m;
  while ((m = BALISE.exec(src))) {
    if (m.index > dernier) jetons.push({ type: 'texte', v: src.slice(dernier, m.index) });
    if (m[1] !== undefined) jetons.push({ type: 'brut', expr: m[1] });
    else {
      const c = m[2];
      let j;
      if (c.startsWith('#each ')) j = { type: 'each', expr: c.slice(6).trim() };
      else if (c.startsWith('#if ')) j = { type: 'if', expr: c.slice(4).trim() };
      else if (c.startsWith('#unless ')) j = { type: 'unless', expr: c.slice(8).trim() };
      else if (c === 'else') j = { type: 'else' };
      else if (c.startsWith('/')) j = { type: 'fin', nom: c.slice(1).trim() };
      else if (c.startsWith('!')) j = { type: 'commentaire' };
      else if (c.startsWith('>')) j = { type: 'partiel', nom: c.slice(1).trim() };
      else j = { type: 'var', expr: c };
      jetons.push(j);
    }
    dernier = BALISE.lastIndex;
  }
  if (dernier < src.length) jetons.push({ type: 'texte', v: src.slice(dernier) });
  /* balises de bloc seules sur leur ligne : on retire l’indentation et le saut de ligne */
  for (let i = 0; i < jetons.length; i++) {
    const j = jetons[i];
    if (!['each', 'if', 'unless', 'else', 'fin', 'commentaire', 'partiel'].includes(j.type)) continue;
    const avant = jetons[i - 1], apres = jetons[i + 1];
    const debutOk = !avant || (avant.type === 'texte' && /(^|\n)[ \t]*$/.test(avant.v));
    const finOk = !apres || (apres.type === 'texte' && /^[ \t]*(\r?\n|$)/.test(apres.v));
    if (!debutOk || !finOk) continue;
    if (avant && avant.type === 'texte') avant.v = avant.v.replace(/[ \t]*$/, '');
    if (apres && apres.type === 'texte') apres.v = apres.v.replace(/^[ \t]*(\r?\n)?/, '');
  }
  return jetons;
}

function analyser(src) {
  const racine = { enfants: [] };
  const pile = [{ noeud: racine, cible: 'enfants' }];
  for (const j of decouper(src)) {
    const haut = pile[pile.length - 1];
    const liste = haut.noeud[haut.cible];
    if (j.type === 'each' || j.type === 'if' || j.type === 'unless') {
      const n = { type: j.type, expr: j.expr, enfants: [], sinon: null };
      liste.push(n);
      pile.push({ noeud: n, cible: 'enfants' });
    } else if (j.type === 'else') {
      if (pile.length < 2) throw new Error('{{else}} hors d’un bloc');
      haut.noeud.sinon = [];
      haut.cible = 'sinon';
    } else if (j.type === 'fin') {
      if (pile.length < 2 || haut.noeud.type !== j.nom) throw new Error('Fermeture {{/' + j.nom + '}} inattendue');
      pile.pop();
    } else if (j.type !== 'commentaire') liste.push(j);
  }
  if (pile.length !== 1) throw new Error('Bloc {{#' + pile[pile.length - 1].noeud.type + '}} non fermé');
  return racine.enfants;
}

const partiels = {};
function partiel(nom) {
  if (!partiels[nom]) {
    const src = readFileSync(join(RACINE, 'templates/partials', nom + '.html'), 'utf8')
      .replace(/^\s*(<!--[\s\S]*?-->\s*)+/, ''); /* le commentaire d’explication en tête du partiel n’est pas publié */
    partiels[nom] = analyser(src);
  }
  return partiels[nom];
}

function valeur(expr, portees) {
  const segs = expr.split('.');
  let v;
  if (segs[0] === 'this' || segs[0].startsWith('@')) {
    for (let i = portees.length - 1; i >= 0; i--) {
      const p = portees[i];
      if (p && typeof p === 'object' && segs[0] in p) { v = p[segs[0]]; break; }
    }
  } else {
    for (let i = portees.length - 1; i >= 0; i--) {
      const p = portees[i];
      if (p && typeof p === 'object' && !Array.isArray(p) && segs[0] in p) { v = p[segs[0]]; break; }
    }
  }
  for (let i = 1; i < segs.length; i++) {
    if (v === null || v === undefined) return undefined;
    v = v[segs[i]];
  }
  return v;
}
function vrai(v) { return !!v && !(Array.isArray(v) && v.length === 0); }

function rendre(noeuds, portees) {
  let out = '';
  for (const n of noeuds) {
    if (n.type === 'texte') out += n.v;
    else if (n.type === 'var') { const v = valeur(n.expr, portees); out += v === null || v === undefined ? '' : echapper(typo(v)); }
    else if (n.type === 'brut') { const v = valeur(n.expr, portees); out += v === null || v === undefined ? '' : String(v); }
    else if (n.type === 'partiel') out += rendre(partiel(n.nom), portees);
    else if (n.type === 'if') out += vrai(valeur(n.expr, portees)) ? rendre(n.enfants, portees) : (n.sinon ? rendre(n.sinon, portees) : '');
    else if (n.type === 'unless') out += !vrai(valeur(n.expr, portees)) ? rendre(n.enfants, portees) : (n.sinon ? rendre(n.sinon, portees) : '');
    else if (n.type === 'each') {
      const l = valeur(n.expr, portees);
      if (Array.isArray(l) && l.length) {
        l.forEach((el, i) => {
          const meta = { this: el, '@index': i, '@num': i + 1, '@first': i === 0, '@last': i === l.length - 1 };
          out += rendre(n.enfants, portees.concat(meta, el));
        });
      } else if (n.sinon) out += rendre(n.sinon, portees);
    }
  }
  return out;
}

/* ======================================================================
   3. Données dérivées d’un voyage (ce que le gabarit reçoit)
   ====================================================================== */
const UNSPLASH = (id, w, h) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}${h ? '&h=' + h : ''}&q=80`;
function srcset(id) { return [800, 1400, 2000].map((w) => UNSPLASH(id, w) + ' ' + w + 'w').join(', '); }

/* Découpe des titres en lignes pour le masque de ligne du H1 (brief §8.4 : pas de découpe automatique du français). */
const TITRES_LIGNES = {
  chine: ['La Chine : escapade', 'au pays du dragon'],
  pologne: ['Pologne : entre capitales', 'et héritages'],
  panama: ['Le Panama : trait d’union', 'des Amériques'],
  crete: ['La Crète éternelle'],
  'chateau-avesnes': ['Le Château d’Avesnes', '– Le Castelet']
};

/* Une figure : image réelle, image de repli (data-media) ou emplacement vide avec couleur de secours. */
function figure(img, fallbackFond) {
  const id = img.id || img.repli || null;
  const f = {
    id, src: id ? UNSPLASH(id, 1400) : '', srcset: id ? srcset(id) : '',
    legende: img.legende, alt: img.alt || '', fond: img.fond || fallbackFond,
    media: img.id ? '' : 'à chercher : ' + img.aChercher + (img.repli ? ' (V1 : photo d’ouverture réutilisée)' : ' (emplacement : couleur de secours)')
  };
  if (!img.id) f.legende = img.legende + (img.repli ? '' : ' [emplacement à pourvoir par l’agence]');
  return f;
}

function preparer(t) {
  const fondVar = t.images.ouverture.fond || `var(--fond-${t.slug})`;
  const total = t.recit.length;
  const jours = t.recit.map((j) => ({
    jour: j.jour, lieu: j.lieu, intertitre: j.intertitre, texte: j.texte,
    notes: j.notes || [], sobre: !!j.sobre, folio: 'Jour ' + pad(j.jour),
    photos: (t.images.recit || []).filter((p) => p.apres === j.jour).map((p) => figure(p, fondVar)),
    exergue: t.exergue && t.exergue.apres === j.jour ? t.exergue.texte : null
  }));
  const departures = (t.departures || []).map((d) => ({
    from: d.from, to: d.to, iso: d.iso, libelle: d.libelle,
    prixTexte: prix(d.price), singleTexte: d.singleSupplement ? '+' + FINE + prix(d.singleSupplement) : '—'
  }));
  const suiv = t.suivant ? TRIPS.find((x) => x.slug === t.suivant) : null;
  const prec = t.precedent ? TRIPS.find((x) => x.slug === t.precedent) : null;
  const couverture = TRIPS[0].images.ouverture;
  const forfait = (t.excluded || []).find((e) => /^Forfait/.test(e)) || null;
  const libelleCourt = t.horsSerie ? 'Hors-série — ' + t.titreCourt : 'Chapitre ' + t.numero + ' — ' + t.titreCourt;
  /* frise horaire : le temps fort occupe deux colonnes ≥ 900 px (chapitre.css) */
  const journeeType = t.journeeType ? { ...t.journeeType, colonnes: t.journeeType.etapes.length + (t.journeeType.etapes.some((e) => e.fort) ? 1 : 0) } : null;
  return {
    ...t,
    journeeType, fondVar, total, totalPad: pad(total), jours, departures, forfait, libelleCourt,
    titreLignes: TITRES_LIGNES[t.slug] || [t.title],
    numeroTexte: t.horsSerie ? 'Hors-série' : 'Chapitre ' + t.numero,
    ouverture: figure(t.images.ouverture, fondVar),
    pagination: total >= 3,
    src: (t.horsSerie ? 'hors-série ' : 'chapitre ' + t.numero + ' — ') + t.titreCourt,
    appelLibelle: t.priceFrom ? 'Demander · ' + t.prixCourt : 'Demander',
    tampon: t.priceFrom ? t.prixCourt + ' / pers.' : 'sur demande',
    datesTitre: t.horsSerie ? 'Les dates du hors-série' : 'Les départs de ce chapitre',
    datesCaption: 'Départs du ' + (t.horsSerie ? 'hors-série' : 'chapitre ' + t.numero),
    encadreBouton: t.slug === 'chine' ? 'Être prévenu·e' : 'Demander ce voyage',
    voyagesOptions: TRIPS.map((v) => ({
      slug: v.slug, courant: v.slug === t.slug,
      libelle: v.horsSerie ? 'Hors-série — ' + v.title.split(' – ')[0] : v.numero + ' — ' + v.title
    })),
    suivant: suiv
      ? { href: suiv.slug + '.html', ariaSection: 'Chapitre suivant', rubrique: 'Chapitre suivant', titre: suiv.numero + ' — ' + suiv.title, fond: suiv.images.ouverture.fond, src: UNSPLASH(suiv.images.ouverture.id, 1400), srcset: srcset(suiv.images.ouverture.id) }
      : { href: ROOT + 'voyages.html', ariaSection: 'Suite de la lecture', rubrique: 'Suite de la lecture', titre: 'Tous les chapitres de ce numéro', fond: couverture.fond, src: UNSPLASH(couverture.id, 1400), srcset: srcset(couverture.id) },
    precedent: prec
      ? { href: prec.slug + '.html', texte: 'Chapitre précédent : ' + prec.numero + ' — ' + prec.titreCourt }
      : { href: ROOT + 'index.html', texte: 'Retour à la couverture' }
  };
}

/* JSON-LD TouristTrip (brief §6.12) */
function jsonLd(t, page) {
  const o = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: t.title,
    description: t.seo.description,
    image: page.image,
    touristType: t.horsSerie ? 'Couples, familles et petits groupes d’amis' : 'Petit groupe accompagné, à partir de dix personnes, guide francophone',
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: t.recit.length,
      itemListElement: t.recit.map((j, i) => ({ '@type': 'ListItem', position: i + 1, name: 'Jour ' + j.jour + ' — ' + j.intertitre, description: j.texte }))
    },
    provider: {
      '@type': 'TravelAgency', name: 'Aya Voyages', alternateName: 'Voyages Loisirs by Aya', legalName: 'KTS Tourisme et Voyage SARL',
      telephone: '+33142686806', email: SITE.email || 'reservation@ayavoyages.fr', url: 'https://www.ayavoyages.com/',
      address: { '@type': 'PostalAddress', streetAddress: '49 rue des Mathurins', postalCode: '75008', addressLocality: 'Paris', addressCountry: 'FR' }
    }
  };
  if (page.canonical) o.url = page.canonical;
  const offre = (o2) => (page.canonical ? { ...o2, url: page.canonical + '#dates' } : o2);
  if (t.departures && t.departures.length) {
    o.offers = t.departures.map((d) => offre({
      '@type': 'Offer', price: String(d.price), priceCurrency: 'EUR',
      description: 'Départ le ' + d.from + ', retour le ' + d.to + ' ; prix par personne en chambre double, à confirmer par l’agence' + (d.singleSupplement ? ' ; chambre seule + ' + d.singleSupplement + ' €' : ''),
      availability: 'https://schema.org/InStock'
    }));
  } else if (t.priceFrom) {
    o.offers = [offre({ '@type': 'Offer', price: String(t.priceFrom), priceCurrency: 'EUR', description: 'Prix à partir de, par personne en chambre double ; dates 2027 en préparation, à confirmer par l’agence', availability: 'https://schema.org/PreOrder' })];
  }
  return JSON.stringify(o).replace(/</g, '\\u003c');
}

function contexte(t) {
  const chapitre = preparer(t);
  const baseUrl = (SITE.baseUrl || '').replace(/\/+$/, '');
  const page = {
    root: ROOT,
    title: t.seo.title,
    description: t.seo.description,
    image: UNSPLASH(t.images.ouverture.id, 1200, 630),
    canonical: baseUrl ? baseUrl + '/voyages/' + t.slug + '.html' : '',
    demande: '#demande',
    site: SITE
  };
  page.jsonLd = jsonLd(t, page);
  page.chapitre = chapitre;
  return page;
}

/* ======================================================================
   4. Génération
   ====================================================================== */
function generer(t, gabarit) {
  let html = rendre(gabarit, [contexte(t)]);
  /* lien courant du chapitre dans l’overlay et dans l’ours */
  html = html.replace(new RegExp('href="\\.\\./voyages/' + t.slug + '\\.html">', 'g'), 'href="../voyages/' + t.slug + '.html" aria-current="page">');
  html = html.replace(/^(<!doctype html>\r?\n)/i, '$1<!-- Page générée par scripts/build-chapitres.mjs à partir de data/trips.js et templates/chapitre.html : modifiez les données ou le gabarit, puis relancez « node scripts/build-chapitres.mjs ». -->\n');
  return html;
}

function controler(nom, html) {
  const avert = [];
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) avert.push(h1 + ' balises <h1>');
  const ld = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html);
  if (!ld) avert.push('JSON-LD absent');
  else { try { JSON.parse(ld[1]); } catch (e) { avert.push('JSON-LD invalide : ' + e.message); } }
  if (/\{\{|\}\}/.test(html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, ''))) avert.push('marqueur {{ }} non remplacé');
  if (/\b(src|href)="\/(?!\/)/.test(html)) avert.push('chemin absolu détecté');
  if (/(inoubliable|évasion|vivez l’expérience|magique|authentique)/i.test(html)) avert.push('mot interdit par le brief');
  return avert.map((a) => '  ⚠ ' + nom + ' : ' + a);
}

function principal() {
  const gabarit = analyser(readFileSync(join(RACINE, 'templates/chapitre.html'), 'utf8'));
  const dossier = join(RACINE, 'voyages');
  if (!VERIFIER) mkdirSync(dossier, { recursive: true });
  let differences = 0;
  for (const t of TRIPS) {
    const fichier = join(dossier, t.slug + '.html');
    const html = generer(t, gabarit);
    const rel = relative(RACINE, fichier);
    const ko = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0);
    if (VERIFIER) {
      const actuel = existsSync(fichier) ? readFileSync(fichier, 'utf8') : null;
      const ok = actuel === html;
      if (!ok) differences++;
      console.log((ok ? '  = ' : '  ≠ ') + rel + (ok ? ' (à jour)' : actuel === null ? ' (absent)' : ' (différent de la génération)'));
    } else {
      writeFileSync(fichier, html, 'utf8');
      console.log('  écrit ' + rel + ' (' + ko + ' Ko, ' + t.recit.length + ' jours' + (t.horsSerie ? ', hors-série allégé' : '') + ')');
    }
    controler(rel, html).forEach((a) => console.log(a));
  }
  if (VERIFIER) {
    console.log(differences ? differences + ' page(s) à régénérer : node scripts/build-chapitres.mjs' : 'Toutes les pages sont à jour.');
    process.exitCode = differences ? 1 : 0;
  } else console.log(TRIPS.length + ' chapitres générés dans voyages/.');
}

principal();
