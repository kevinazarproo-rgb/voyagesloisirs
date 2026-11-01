/* ==========================================================================
   LE CARNET D’ITINÉRAIRES — formulaire.js
   Composant unique .formulaire (variantes --court, --chapitre, --complet, --groupe).
   Pré-remplissage ?voyage=&date=, verrou « changer », radios et « autre période »,
   case courrier → adresse, validation douce, envoi FormSubmit AJAX (10 s),
   repli mailto + copier, états, sessionStorage, « Demander cette date ».
   Lit window.SITE (data/site.js) et window.TRIPS (data/trips.js) s’ils sont chargés.
   ========================================================================== */
(function () {
  'use strict';
  var html = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var SITE = window.SITE || {};
  var NUMERO = SITE.numero || 'N° 1';
  var EMAIL = SITE.email || 'reservation@ayavoyages.fr';
  var TEL = SITE.tel || '01 42 68 68 06';
  var TEL_HREF = SITE.telHref || 'tel:+33142686806';
  var NBSP = ' ', FINE = ' ';
  function reduit() {
    if (window.Carnet && window.Carnet.reduit) return window.Carnet.reduit();
    return (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || html.classList.contains('motion-off');
  }
  var MESSAGES = {
    nom: 'Indiquez votre nom et votre prénom.',
    telephone: 'Indiquez un numéro de téléphone à dix chiffres au moins.',
    email: 'Cette adresse e-mail ne semble pas complète.',
    consentement: 'Cochez cette case pour que nous puissions vous répondre.',
    defaut: 'Ce champ est à compléter.'
  };
  var LIBELLES_COURTS = { nom: 'nom', telephone: 'téléphone', email: 'e-mail', consentement: 'consentement' };
  var NOMBRES = ['Aucun', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit'];
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var VOYAGES = {
    chine: '01 — La Chine : escapade au pays du dragon',
    pologne: '02 — Pologne : entre capitales et héritages',
    panama: '03 — Le Panama : trait d’union des Amériques',
    crete: '04 — La Crète éternelle',
    'chateau-avesnes': 'Hors-série — Le Château d’Avesnes'
  };

  /* ---------- utilitaires de format ---------- */
  function prix(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, FINE) + NBSP + '€'; }
  function dateIso(fr) { /* "13/02/2027" → "2027-02-13" */ var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(fr || ''); return m ? m[3] + '-' + m[2] + '-' + m[1] : (fr || ''); }
  function dateLongue(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? m[3] + ' ' + MOIS[parseInt(m[2], 10) - 1] + ' ' + m[1] : (iso || ''); }
  function plage(depFr, retFr) {
    var a = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(depFr || ''), b = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(retFr || '');
    if (!a || !b) return (depFr || '') + ' → ' + (retFr || '');
    if (a[2] === b[2] && a[3] === b[3]) return a[1] + NBSP + '→' + NBSP + b[1] + ' ' + MOIS[+a[2] - 1] + ' ' + a[3];
    return a[1] + ' ' + MOIS[+a[2] - 1] + NBSP + '→' + NBSP + b[1] + ' ' + MOIS[+b[2] - 1] + ' ' + b[3];
  }
  function trouverVoyage(slug) {
    var t = window.TRIPS;
    if (!t || !t.length) return null;
    for (var i = 0; i < t.length; i++) if (t[i].slug === slug) return t[i];
    return null;
  }
  function texteLibelle(el) {
    if (!el) return '';
    var clone = el.cloneNode(true);
    $$('.champ__optionnel,.sr-only,.champ__aide', clone).forEach(function (x) { x.parentNode.removeChild(x); });
    return clone.textContent.replace(/\s*\*\s*$/, '').replace(/\s+/g, ' ').trim();
  }

  /* ---------- champs révélés (autre période, adresse postale) ---------- */
  function montrer(el, on) {
    if (!el) return;
    el.classList.toggle('is-visible', !!on);
    $$('input,textarea,select', el).forEach(function (c) { if (!on) { c.removeAttribute('aria-invalid'); } });
  }
  function majReveles(form) {
    var autre = $('.champ--date-autre', form);
    if (autre) {
      var radio = $('input[name="date"]:checked', form), sel = $('select[name="date"]', form);
      var val = radio ? radio.value : (sel ? sel.value : '');
      montrer(autre, val === 'autre');
    }
    var adresse = $('.champ--adresse', form), courrier = $('input[name="courrier"]', form);
    if (adresse && courrier) montrer(adresse, courrier.checked);
  }

  /* ---------- select de dates dépendant du voyage (contact.html) ---------- */
  function optionsDates(slug) {
    var opts = [];
    var v = trouverVoyage(slug);
    if (slug === 'chine' || (v && v.slug === 'chine')) {
      opts.push({ v: 'prevenir', t: 'Me prévenir dès que les dates 2027 sont fixées' });
    } else if (slug === 'chateau-avesnes') {
      opts.push({ v: 'sur-demande', t: 'Toute l’année, sur demande' });
    } else if (v && v.departures && v.departures.length) {
      v.departures.forEach(function (d) {
        opts.push({ v: dateIso(d.from), t: plage(d.from, d.to) + ' — ' + prix(d.price) + ' par personne' });
      });
    } else if (!slug) {
      opts.push({ v: '', t: 'Je ne sais pas encore' });
    }
    opts.push({ v: 'autre', t: 'Une autre période' });
    return opts;
  }
  function remplirDates(select, slug, valeurVoulue) {
    /* au changement de voyage, « Une autre période » n’est pas conservée : on propose la première date réelle
       (ou « Me prévenir » pour la Chine, « sur demande » pour le château) ; ?date=… passe par valeurVoulue */
    var actuelle = valeurVoulue || (select.value === 'autre' ? '' : select.value);
    select.textContent = '';
    optionsDates(slug).forEach(function (o) {
      var opt = document.createElement('option'); opt.value = o.v; opt.textContent = o.t; select.appendChild(opt);
    });
    var ok = false;
    $$('option', select).forEach(function (o) { if (o.value === actuelle && actuelle !== '') { o.selected = true; ok = true; } });
    if (!ok) select.selectedIndex = 0;
  }

  /* ---------- pré-remplissage ---------- */
  function choisirVoyage(form, slug) {
    var sel = $('select[name="voyage"]', form), cache = $('input[type="hidden"][name="voyage"]', form);
    var trouve = false;
    if (sel) { $$('option', sel).forEach(function (o) { if (o.value === slug) { o.selected = true; trouve = true; } }); }
    if (cache && (trouve || !sel)) cache.value = slug;
    var dateSel = $('select[name="date"]', form);
    if (dateSel && dateSel.hasAttribute('data-dependant')) remplirDates(dateSel, slug);
    /* cases à cocher « chapitres envisagés » (variante groupe) */
    $$('input[name="chapitres"]', form).forEach(function (c) { if (c.value === slug) c.checked = true; });
    return trouve;
  }
  function choisirDate(form, val) {
    if (!val) return false;
    var radio = $('input[name="date"][value="' + val + '"]', form);
    if (radio) { radio.checked = true; majReveles(form); return true; }
    var sel = $('select[name="date"]', form);
    if (sel) {
      var ok = false;
      $$('option', sel).forEach(function (o) { if (o.value === val) { o.selected = true; ok = true; } });
      if (!ok) { sel.value = 'autre'; var a = $('[name="date_autre"]', form); if (a) a.value = dateLongue(val); }
      majReveles(form);
      return true;
    }
    var texte = $('input[name="date"]', form);
    if (texte && !texte.value) { texte.value = /^\d{4}-\d{2}-\d{2}$/.test(val) ? 'à partir du ' + dateLongue(val) : val; return true; }
    return false;
  }

  /* ---------- verrou « changer » ---------- */
  function verrou(form) {
    var zone = $('.formulaire__verrou', form);
    if (!zone) return;
    var sel = $('select[name="voyage"]', zone), cache = $('input[type="hidden"][name="voyage"]', zone), btn = $('.formulaire__changer', zone);
    if (!sel || !btn) return;
    if (cache && !cache.value) cache.value = sel.value;
    btn.addEventListener('click', function () {
      sel.disabled = false;
      sel.removeAttribute('aria-describedby');
      if (cache) cache.parentNode.removeChild(cache);
      btn.setAttribute('hidden', '');
      sel.focus();
    });
  }

  /* ---------- erreurs ---------- */
  function conteneur(c) { return c.closest('.champ') || c.closest('fieldset') || c.parentNode; }
  function zoneErreur(form, c, creer) {
    var id = 'err-' + (c.name || c.id || 'champ');
    var p = $('#' + id, form);
    if (!p && creer) {
      p = document.createElement('p'); p.className = 'champ__erreur'; p.id = id;
      conteneur(c).appendChild(p);
    }
    return p;
  }
  function lierDescription(c, id, ajouter) {
    var ids = (c.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    var i = ids.indexOf(id);
    if (ajouter && i < 0) ids.push(id);
    if (!ajouter && i > -1) ids.splice(i, 1);
    if (ids.length) c.setAttribute('aria-describedby', ids.join(' ')); else c.removeAttribute('aria-describedby');
  }
  function poserErreur(form, c, message) {
    var p = zoneErreur(form, c, true);
    p.textContent = message;
    c.setAttribute('aria-invalid', 'true');
    lierDescription(c, p.id, true);
  }
  function effacerErreur(form, c) {
    var p = zoneErreur(form, c, false);
    if (p) { p.textContent = ''; lierDescription(c, p.id, false); }
    c.removeAttribute('aria-invalid');
    if (!$('[aria-invalid="true"]', form)) { var r = $('.formulaire__resume', form); if (r) r.textContent = ''; }
  }
  function valider(form) {
    var erreurs = [];
    $$('[required]', form).forEach(function (c) {
      if (c.disabled || c.type === 'hidden') return;
      var nom = c.name, vide = false;
      if (c.type === 'checkbox') vide = !c.checked;
      else if (c.type === 'radio') vide = !$('input[name="' + nom + '"]:checked', form);
      else vide = !c.value.trim();
      if (vide) { erreurs.push({ champ: c, message: MESSAGES[nom] || MESSAGES.defaut }); return; }
      if (nom === 'telephone' && (c.value.match(/\d/g) || []).length < 10) erreurs.push({ champ: c, message: MESSAGES.telephone });
      else if (c.type === 'email' && !c.validity.valid) erreurs.push({ champ: c, message: MESSAGES.email });
    });
    var tel = $('[name="telephone"]', form);
    if (tel && !tel.required && tel.value.trim() && (tel.value.match(/\d/g) || []).length < 10) erreurs.push({ champ: tel, message: MESSAGES.telephone });
    var em = $('[name="email"]', form);
    if (em && !em.required && em.value.trim() && !em.validity.valid) erreurs.push({ champ: em, message: MESSAGES.email });
    return erreurs;
  }
  function afficherErreurs(form, erreurs) {
    var resume = $('.formulaire__resume', form);
    $$('[aria-invalid="true"]', form).forEach(function (c) { effacerErreur(form, c); });
    if (!erreurs.length) { if (resume) resume.textContent = ''; return; }
    var noms = [];
    erreurs.forEach(function (e) {
      poserErreur(form, e.champ, e.message);
      var lib = LIBELLES_COURTS[e.champ.name] || texteLibelle($('label[for="' + e.champ.id + '"]', form) || $('.champ__libelle,legend', conteneur(e.champ))).toLowerCase() || e.champ.name;
      if (noms.indexOf(lib) < 0) noms.push(lib);
    });
    var n = noms.length;
    if (resume) resume.textContent = (NOMBRES[n] || n) + ' champ' + (n > 1 ? 's sont' : ' est') + ' à compléter' + NBSP + ': ' + noms.join(', ') + '.';
    if (!reduit()) {
      form.classList.remove('is-secoue'); void form.offsetWidth; form.classList.add('is-secoue');
      form.addEventListener('animationend', function fin() { form.classList.remove('is-secoue'); form.removeEventListener('animationend', fin); });
    }
    try { erreurs[0].champ.focus({ preventScroll: false }); } catch (e) { erreurs[0].champ.focus(); }
  }

  /* ---------- collecte : corps JSON, récapitulatif, texte du mailto ---------- */
  function libelleVoyage(form, val) {
    var sel = $('select[name="voyage"]', form);
    if (sel) { var o = sel.options[sel.selectedIndex]; if (o && (o.value === val || sel.disabled)) return o.textContent.trim(); }
    return VOYAGES[val] || val || 'Je ne sais pas encore';
  }
  function libelleDate(form, corps) {
    var radio = $('input[name="date"]:checked', form);
    if (radio) {
      if (radio.value === 'autre') return (corps.date_autre || '').trim();
      var lab = radio.closest('label') || $('label[for="' + radio.id + '"]', form);
      return lab ? texteLibelle(lab) : radio.value;
    }
    var sel = $('select[name="date"]', form);
    if (sel) {
      if (sel.value === 'autre') return (corps.date_autre || '').trim();
      var o = sel.options[sel.selectedIndex]; return o ? o.textContent.trim() : '';
    }
    return (corps.date || '').trim();
  }
  function lignesTexte(form) {
    var lignes = [];
    $$('.champ', form).forEach(function (ch) {
      if (ch.classList.contains('formulaire__honey')) return;
      if (ch.classList.contains('champ--revele') && !ch.classList.contains('is-visible') && !html.classList.contains('no-js')) return;
      var lib = texteLibelle($('.champ__libelle,legend', ch));
      var val = '';
      var radios = $$('input[type="radio"]', ch), cases = $$('input[type="checkbox"]', ch);
      if (radios.length) {
        var r = radios.filter(function (x) { return x.checked; })[0];
        val = r ? texteLibelle(r.closest('label') || $('label[for="' + r.id + '"]', ch)) : '';
      } else if (cases.length) {
        val = cases.filter(function (x) { return x.checked; }).map(function (x) { return texteLibelle(x.closest('label') || $('label[for="' + x.id + '"]', ch)); }).join(', ');
        if (cases.length === 1) val = cases[0].checked ? 'oui' : '';
      } else {
        var c = $('select,textarea,input', ch);
        if (!c) return;
        if (c.tagName === 'SELECT') { var o = c.options[c.selectedIndex]; val = o ? o.textContent.trim() : ''; }
        else val = c.value.trim();
      }
      if (lib && val) lignes.push(lib + NBSP + ': ' + val);
    });
    return lignes;
  }
  function collecter(form) {
    var fd = new FormData(form), corps = {};
    fd.forEach(function (v, k) { if (typeof v === 'string') corps[k] = v; });
    if (corps.date === 'autre' && corps.date_autre) corps.date = corps.date_autre;
    var voyageLib = libelleVoyage(form, corps.voyage || '');
    var dateLib = libelleDate(form, corps);
    var dateCourte = dateLib.split(' — ')[0];
    var n = corps.voyageurs || corps.participants || '';
    var nTexte = n === 'plus-de-10' ? 'plus de 10 voyageurs' : (n ? n + ' voyageur' + (parseInt(n, 10) > 1 ? 's' : '') : '');
    var src = form.getAttribute('data-src') || '';
    var sujet = 'Carnet ' + NUMERO + ' — Demande' + NBSP + ': ' + voyageLib + (dateCourte ? ' (' + dateCourte + ')' : '') + (nTexte ? ', ' + nTexte : '') + (src ? ' — via ' + src : '');
    corps._subject = sujet;
    if (corps.email) corps._replyto = corps.email;
    var lignes = lignesTexte(form);
    lignes.push('', 'Envoyé depuis ' + location.href);
    return {
      corps: corps, sujet: sujet, texte: lignes.join('\r\n'),
      recap: { nom: corps.nom || '', voyage: voyageLib, date: dateLib, voyageurs: nTexte, telephone: corps.telephone || '', email: corps.email || '' }
    };
  }

  /* ---------- états ---------- */
  function boutonDe(form) { return $('.formulaire__bouton', form) || $('button[type="submit"],input[type="submit"]', form); }
  function etatEnvoi(form, bouton, on) {
    form.classList.toggle('is-envoi', on);
    if (!bouton) return;
    if (on) {
      if (!bouton.__libelle) bouton.__libelle = bouton.textContent;
      bouton.disabled = true; bouton.setAttribute('aria-busy', 'true'); bouton.textContent = 'Envoi…';
    } else {
      bouton.disabled = false; bouton.removeAttribute('aria-busy');
    }
  }
  function attendre(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function echapper(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function succes(form, d) {
    try {
      sessionStorage.setItem('demande', JSON.stringify(d.recap));
      sessionStorage.setItem('demande-envoyee', String(Date.now()));
    } catch (e) { /* stockage indisponible */ }
    var root = form.getAttribute('data-root') || '';
    var panneau = document.createElement('div');
    panneau.className = 'formulaire__succes papier-blanc coupe';
    panneau.setAttribute('tabindex', '-1');
    var dl = '';
    [['Voyage', d.recap.voyage], ['Date', d.recap.date], ['Voyageurs', d.recap.voyageurs], ['Rappel au', d.recap.telephone]].forEach(function (l) {
      if (l[1]) dl += '<dt>' + l[0] + '</dt><dd>' + echapper(l[1]) + '</dd>';
    });
    panneau.innerHTML = '<span class="coupe__b" aria-hidden="true"></span>' +
      '<span class="tampon tampon--recu tampon--anime" aria-hidden="true">Reçu</span>' +
      '<h3 tabindex="-1">Votre demande est bien partie.</h3>' +
      (dl ? '<dl>' + dl + '</dl>' : '') +
      '<p>Une personne de l’agence vous rappelle ou vous écrit sous deux jours ouvrés. Pressé·e' + FINE + '? <a class="lien-tel" href="' + TEL_HREF + '">' + TEL.replace(/ /g, FINE) + '</a>.</p>' +
      '<p><a class="lien" href="' + root + 'voyages.html">Continuer la lecture → sommaire</a></p>';
    form.parentNode.insertBefore(panneau, form.nextSibling);
    var titre = panneau.querySelector('h3'), tampon = panneau.querySelector('.tampon--anime');
    if (reduit()) {
      form.classList.add('is-replie'); form.style.maxHeight = '0px';
      panneau.classList.add('is-visible'); tampon.classList.add('is-pose');
      titre.focus();
      return;
    }
    form.style.maxHeight = form.scrollHeight + 'px';
    void form.offsetHeight;
    form.classList.add('is-replie');
    requestAnimationFrame(function () { requestAnimationFrame(function () { panneau.classList.add('is-visible'); }); });
    setTimeout(function () { tampon.classList.add('is-pose'); }, 350);
    setTimeout(function () { titre.focus(); }, 500);
  }

  function echec(form, d, bouton) {
    var zone = $('.formulaire__echec', form);
    if (!zone) {
      zone = document.createElement('div');
      zone.className = 'formulaire__echec';
      zone.setAttribute('role', 'alert');
      zone.setAttribute('aria-live', 'assertive');
      if (bouton && bouton.parentNode === form) form.insertBefore(zone, bouton); else form.appendChild(zone);
    }
    var mailto = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(d.sujet) + '&body=' + encodeURIComponent(d.texte);
    zone.innerHTML = '<p><strong>L’envoi n’a pas abouti.</strong> Vous pouvez nous écrire directement' + NBSP + ': ' +
      '<a class="lien" href="' + mailto.replace(/"/g, '%22') + '" data-mailto>ouvrir votre messagerie avec la demande déjà rédigée →</a> — ou ' +
      '<button type="button" class="lien" data-copier>copier le message</button> et nous l’envoyer à <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>. ' +
      'Vous pouvez aussi nous appeler au <a class="lien-tel" href="' + TEL_HREF + '">' + TEL.replace(/ /g, FINE) + '</a>.</p>';
    var copier = zone.querySelector('[data-copier]');
    copier.addEventListener('click', function () {
      function fait() { copier.textContent = 'Copié ✓'; setTimeout(function () { copier.textContent = 'copier le message'; }, 2000); }
      function repli() {
        var ta = zone.querySelector('textarea');
        if (!ta) { ta = document.createElement('textarea'); ta.readOnly = true; ta.setAttribute('aria-label', 'Texte de votre demande à copier'); zone.appendChild(ta); }
        ta.value = d.texte; ta.focus(); ta.select();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(d.texte).then(fait, repli); else repli();
    });
    if (bouton) { bouton.textContent = 'Réessayer l’envoi'; bouton.disabled = false; bouton.removeAttribute('aria-busy'); }
    zone.focus && zone.setAttribute('tabindex', '-1');
  }
  function masquerEchec(form) { var z = $('.formulaire__echec', form); if (z) z.parentNode.removeChild(z); }

  /* ---------- envoi ---------- */
  function dejaEnvoye() {
    try { var t = parseInt(sessionStorage.getItem('demande-envoyee') || '0', 10); return t && (Date.now() - t) < 30 * 60 * 1000; } catch (e) { return false; }
  }
  async function soumettre(form) {
    var erreurs = valider(form);
    afficherErreurs(form, erreurs);
    if (erreurs.length) return;
    if (dejaEnvoye() && !form.__confirme) {
      if (!window.confirm('Vous avez déjà envoyé une demande il y a quelques minutes. Envoyer tout de même ?')) return;
      form.__confirme = true;
    }
    var honey = $('[name="_honey"]', form);
    var d = collecter(form);
    var bouton = boutonDe(form);
    masquerEchec(form);
    etatEnvoi(form, bouton, true);
    var ok = false;
    if (honey && honey.value) {
      await attendre(600); ok = true; /* pot de miel rempli : succès simulé, rien n’est envoyé */
    } else {
      try {
        var ctrl = new AbortController();
        var t = setTimeout(function () { ctrl.abort(); }, 10000);
        var r = await fetch('https://formsubmit.co/ajax/' + EMAIL, {
          method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(d.corps), signal: ctrl.signal
        });
        clearTimeout(t);
        var j = null;
        try { j = await r.json(); } catch (e) { j = null; }
        ok = r.ok && !(j && (j.success === 'false' || j.success === false));
      } catch (e) { ok = false; }
    }
    etatEnvoi(form, bouton, false);
    if (ok) { if (bouton && bouton.__libelle) bouton.textContent = bouton.__libelle; succes(form, d); }
    else echec(form, d, bouton);
  }

  /* ---------- « Demander cette date » depuis la table des dates ---------- */
  function demanderDate() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href*="#demande"],button[data-date]');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      var m = /[?&]date=([0-9A-Za-z-]+)/.exec(href);
      var date = (m && m[1]) || a.getAttribute('data-date');
      if (!date) return;
      var form = $('#demande form[data-formulaire]') || $('form[data-formulaire]');
      if (!form) return;
      e.preventDefault();
      choisirDate(form, date);
      var cible = document.getElementById('demande') || form;
      cible.scrollIntoView({ behavior: reduit() ? 'auto' : 'smooth', block: 'start' });
      var radio = $('input[name="date"]:checked', form);
      var groupe = radio ? radio.closest('.choix-groupe') : null;
      if (groupe) { groupe.classList.remove('is-surligne'); void groupe.offsetWidth; groupe.classList.add('is-surligne'); setTimeout(function () { groupe.classList.remove('is-surligne'); }, 1400); }
      setTimeout(function () { var f = radio || $('[name="date"],[name="date_autre"]', form); if (f && f.focus) f.focus({ preventScroll: true }); }, reduit() ? 0 : 650);
    });
  }

  /* ---------- merci.html : récapitulatif depuis sessionStorage ---------- */
  function recapMerci() {
    var zone = $('[data-recap-demande]');
    if (!zone) return;
    var recap = null;
    try { recap = JSON.parse(sessionStorage.getItem('demande') || 'null'); } catch (e) { recap = null; }
    if (!recap) { zone.setAttribute('hidden', ''); return; }
    var dl = '';
    [['Voyage', recap.voyage], ['Date', recap.date], ['Voyageurs', recap.voyageurs], ['Rappel au', recap.telephone]].forEach(function (l) { if (l[1]) dl += '<dt>' + l[0] + '</dt><dd>' + echapper(l[1]) + '</dd>'; });
    if (!dl) { zone.setAttribute('hidden', ''); return; }
    zone.innerHTML = '<dl>' + dl + '</dl>';
    zone.removeAttribute('hidden');
  }

  /* ---------- initialisation d’un formulaire ---------- */
  function initForm(form) {
    form.setAttribute('novalidate', '');
    var params = new URLSearchParams(location.search);
    var next = $('[name="_next"]', form);
    if (next && next.value) { try { next.value = new URL(next.value, location.href).href; } catch (e) { /* valeur relative conservée */ } }
    var ps = $('[name="page_source"]', form);
    if (ps) ps.value = location.href;
    var sujet = $('[name="_subject"]', form);
    if (sujet && !sujet.value) sujet.value = 'Carnet ' + NUMERO + ' — Demande via le site';
    verrou(form);
    var voyageSel = $('select[name="voyage"]', form), dateSel = $('select[name="date"][data-dependant]', form);
    if (dateSel) {
      remplirDates(dateSel, voyageSel ? voyageSel.value : '');
      if (voyageSel) voyageSel.addEventListener('change', function () { remplirDates(dateSel, voyageSel.value); majReveles(form); });
    }
    var pv = params.get('voyage'); if (pv) choisirVoyage(form, pv);
    var pd = params.get('date'); if (pd) choisirDate(form, pd);
    majReveles(form);
    form.addEventListener('change', function () { majReveles(form); });
    form.addEventListener('input', function (e) { var c = e.target; if (c && c.getAttribute && c.getAttribute('aria-invalid') === 'true') { var err = valider(form).filter(function (x) { return x.champ === c; }); if (!err.length) effacerErreur(form, c); } });
    form.addEventListener('submit', function (e) { e.preventDefault(); soumettre(form); });
  }

  function demarrer() {
    $$('form[data-formulaire]').forEach(initForm);
    demanderDate();
    recapMerci();
  }
  window.Formulaire = { choisirVoyage: choisirVoyage, choisirDate: choisirDate, remplirDates: remplirDates, prix: prix, plage: plage, dateIso: dateIso };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
