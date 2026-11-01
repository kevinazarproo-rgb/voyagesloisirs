/* Voyages Loisirs by Aya — comportements du site (sans bibliothèque) */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var EMAIL = 'reservation@ayavoyages.fr';

  /* barre : transparente sur la photo, bleu marine au défilement */
  var barre = $('.barre');
  var haut = $('.haut');
  function surDefilement() {
    var y = window.scrollY || 0;
    if (barre && !barre.classList.contains('barre--pleine')) barre.classList.toggle('is-pleine', y > 40);
    if (haut) haut.classList.toggle('is-visible', y > 700);
  }
  window.addEventListener('scroll', surDefilement, { passive: true });
  surDefilement();
  if (haut) haut.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduit ? 'auto' : 'smooth' }); });

  /* menu mobile */
  var menu = $('#menu-mobile');
  var boutonMenu = $('.barre__menu');
  function fermerMenu() {
    if (!menu) return;
    menu.classList.remove('is-ouvert'); document.body.classList.remove('menu-ouvert');
    menu.setAttribute('aria-hidden', 'true'); if (boutonMenu) { boutonMenu.setAttribute('aria-expanded', 'false'); boutonMenu.focus(); }
  }
  if (menu && boutonMenu) {
    boutonMenu.addEventListener('click', function () {
      menu.classList.add('is-ouvert'); document.body.classList.add('menu-ouvert');
      menu.setAttribute('aria-hidden', 'false'); boutonMenu.setAttribute('aria-expanded', 'true');
      var premier = $('a, button', menu); if (premier) premier.focus();
    });
    $$('[data-fermer-menu]', menu).forEach(function (b) { b.addEventListener('click', fermerMenu); });
    $$('nav a', menu).forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('is-ouvert'); document.body.classList.remove('menu-ouvert'); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-ouvert')) fermerMenu(); });
  }

  /* apparitions au défilement */
  var anim = $$('[data-anim]');
  if ('IntersectionObserver' in window && !reduit) {
    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-vu'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    anim.forEach(function (el) { io.observe(el); });
  } else anim.forEach(function (el) { el.classList.add('is-vu'); });

  /* héros : diaporama de destinations (photos, et vidéos sur grand écran) */
  var diaporama = $('[data-diaporama]');
  if (diaporama) {
    var diapos = $$('.diapo', diaporama);
    var videoOk = !reduit && !(navigator.connection && navigator.connection.saveData) && !window.matchMedia('(max-width: 699px)').matches;
    var actif = 0, tempo = null;
    var points = document.createElement('div');
    points.className = 'points-diapo';
    points.setAttribute('role', 'group'); points.setAttribute('aria-label', 'Choisir une destination');
    diapos.forEach(function (d, i) {
      var b = document.createElement('button'); b.type = 'button';
      b.setAttribute('aria-label', (d.querySelector('figcaption') || {}).textContent ? 'Afficher : ' + d.querySelector('figcaption').textContent.trim() : 'Diapositive ' + (i + 1));
      b.addEventListener('click', function () { aller(i); });
      points.appendChild(b);
    });
    diaporama.parentNode.appendChild(points);
    function jouer(d) {
      var v = d.querySelector('video');
      if (!v || !videoOk) return;
      if (!v.getAttribute('src')) { v.src = v.getAttribute('data-src'); v.addEventListener('canplay', function () { v.classList.add('is-pret'); }, { once: true }); }
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    }
    function aller(i) {
      var ancien = diapos[actif];
      actif = (i + diapos.length) % diapos.length;
      diapos.forEach(function (d, k) { d.classList.toggle('is-active', k === actif); });
      $$('button', points).forEach(function (b, k) { b.setAttribute('aria-current', k === actif ? 'true' : 'false'); });
      var v = ancien && ancien !== diapos[actif] && ancien.querySelector('video');
      if (v && v.pause) setTimeout(function () { v.pause(); }, 1600);
      jouer(diapos[actif]);
      clearTimeout(tempo);
      if (!reduit) tempo = setTimeout(function () { aller(actif + 1); }, diapos[actif].querySelector('video') && videoOk ? 9000 : 6000);
    }
    aller(0);
  }

  /* « Comment ça marche ? » : la section reste fixe et le défilement fait avancer les étapes */
  var etapier = $('[data-etapier]');
  if (etapier) {
    var etapes = $$('.etape', etapier);
    var gauches = $$('[data-etape-gauche]', etapier);
    var boutons = $$('.progression button');
    var section = etapier.closest('.etapes');
    var n = etapes.length, courant = -1;
    var epingle = section && section.classList.contains('etapes--epingle') && !reduit;
    function montrer(i) {
      i = Math.max(0, Math.min(n - 1, i));
      if (i === courant) return;
      var premier = courant === -1;
      courant = i;
      [etapes, gauches].forEach(function (liste) {
        liste.forEach(function (e, k) {
          e.hidden = k !== courant;
          if (k === courant && !premier) { e.classList.remove('is-entree'); void e.offsetWidth; e.classList.add('is-entree'); }
        });
      });
      boutons.forEach(function (b, k) { b.setAttribute('aria-current', k === courant ? 'step' : 'false'); if (!epingle) b.style.setProperty('--p', k <= courant ? 1 : 0); });
    }
    if (epingle) {
      var attente = false;
      var maj = function () {
        attente = false;
        var r = section.getBoundingClientRect();
        var total = r.height - window.innerHeight;
        var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
        var x = p * n;
        montrer(Math.floor(Math.min(x, n - 0.001)));
        boutons.forEach(function (b, k) { b.style.setProperty('--p', Math.min(1, Math.max(0, x - k))); });
      };
      window.addEventListener('scroll', function () { if (!attente) { attente = true; requestAnimationFrame(maj); } }, { passive: true });
      window.addEventListener('resize', maj);
      boutons.forEach(function (b, k) {
        b.addEventListener('click', function () {
          var debut = section.getBoundingClientRect().top + window.scrollY;
          var total = section.offsetHeight - window.innerHeight;
          window.scrollTo({ top: debut + total * (k + 0.5) / n, behavior: 'smooth' });
        });
      });
      maj();
    } else {
      boutons.forEach(function (b, k) { b.addEventListener('click', function () { montrer(k); }); });
      montrer(0);
    }
  }

  /* fenêtre « Être rappelé » */
  var modale = $('#rappel');
  $$('[data-rappel]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      if (!modale || typeof modale.showModal !== 'function') return; // sans support : le lien mène à contact.html
      e.preventDefault(); fermerMenu(); modale.showModal();
      var voyage = b.getAttribute('data-voyage'); var sel = $('select[name="voyage"]', modale);
      if (voyage && sel) sel.value = voyage;
      var champ = $('input[name="nom"]', modale); if (champ) champ.focus();
    });
  });
  if (modale) {
    $$('[data-fermer]', modale).forEach(function (b) { b.addEventListener('click', function () { modale.close(); }); });
    modale.addEventListener('click', function (e) { if (e.target === modale) modale.close(); });
  }

  /* pré-remplissage : ?voyage=crete&date=2027-10-08 */
  try {
    var params = new URLSearchParams(location.search);
    var v = params.get('voyage');
    if (v) $$('select[name="voyage"]').forEach(function (s) { if ($('option[value="' + CSS.escape(v) + '"]', s)) s.value = v; });
    var d = params.get('date');
    if (d) $$('input[name="date"]').forEach(function (i) { i.value = d.slice(0, 40); });
  } catch (e) {}
  $$('[data-date]').forEach(function (a) {
    a.addEventListener('click', function () { var i = $('#demande input[name="date"]'); if (i) i.value = a.getAttribute('data-date'); });
  });

  /* formulaires : validation simple puis envoi par FormSubmit, repli par e-mail */
  var MESSAGES = {
    nom: 'Indiquez votre nom et prénom.',
    telephone: 'Indiquez un numéro de téléphone (10 chiffres, ou +33…).',
    email: 'Indiquez une adresse e-mail valide.',
    consentement: 'Cochez cette case pour que l’agence puisse vous répondre.'
  };
  function valide(champ) {
    var n = champ.name, val = (champ.value || '').trim();
    if (champ.type === 'checkbox') return champ.checked || !champ.required;
    if (!champ.required && !val) return true;
    if (champ.required && !val) return false;
    if (n === 'telephone') return /^(?:\+|00)?[\d\s.\-()]{9,20}$/.test(val) && val.replace(/\D/g, '').length >= 9;
    if (champ.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
    return true;
  }
  function marquer(champ, ok) {
    var bloc = champ.closest('.champ') || champ.closest('.case');
    if (!bloc) return;
    var err = $('.champ__erreur', bloc);
    champ.setAttribute('aria-invalid', ok ? 'false' : 'true');
    bloc.classList.toggle('champ--erreur', !ok);
    if (!ok && !err) { err = document.createElement('span'); err.className = 'champ__erreur'; err.id = champ.id + '-erreur'; bloc.appendChild(err); champ.setAttribute('aria-describedby', err.id); }
    if (err) err.textContent = ok ? '' : (MESSAGES[champ.name] || 'Ce champ est à compléter.');
  }
  function resume(form) {
    var lignes = [];
    $$('input, select, textarea', form).forEach(function (c) {
      if (!c.name || c.name.charAt(0) === '_' || c.type === 'hidden' || c.name === 'site_web') return;
      if (c.type === 'checkbox') return;
      var val = c.tagName === 'SELECT' ? (c.options[c.selectedIndex] || {}).text : c.value;
      if (val && String(val).trim()) {
        var lab = form.querySelector('label[for="' + c.id + '"]');
        lignes.push((lab ? lab.textContent.replace('*', '').trim() : c.name) + ' : ' + String(val).trim());
      }
    });
    lignes.push('Page : ' + location.href);
    return lignes.join('\n');
  }
  $$('form[data-form]').forEach(function (form) {
    var champs = $$('[required]', form);
    champs.forEach(function (c) { c.addEventListener('blur', function () { if (c.value || c.type === 'checkbox') marquer(c, valide(c)); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var premier = null;
      champs.forEach(function (c) { var ok = valide(c); marquer(c, ok); if (!ok && !premier) premier = c; });
      if (premier) { premier.focus(); return; }
      if (form.site_web && form.site_web.value) return; // robot
      var retour = $('.form-retour', form.parentNode) || document.createElement('div');
      retour.className = 'form-retour'; retour.setAttribute('role', 'status'); retour.setAttribute('tabindex', '-1');
      var bouton = $('button[type="submit"]', form);
      var libelle = bouton ? bouton.innerHTML : '';
      if (bouton) { bouton.disabled = true; bouton.textContent = 'Envoi en cours…'; }
      var donnees = {};
      $$('input, select, textarea', form).forEach(function (c) {
        if (!c.name || c.name === 'site_web') return;
        if (c.type === 'checkbox') { donnees[c.name] = c.checked ? 'oui' : 'non'; return; }
        donnees[c.name] = c.tagName === 'SELECT' ? (c.options[c.selectedIndex] || {}).text : c.value;
      });
      donnees._subject = (form.getAttribute('data-sujet') || 'Demande via le site') + ' — ' + (donnees.nom || '');
      donnees._template = 'table'; donnees._captcha = 'false';
      if (donnees.email) donnees._replyto = donnees.email;
      var ctrl = 'AbortController' in window ? new AbortController() : null;
      var delai = setTimeout(function () { if (ctrl) ctrl.abort(); }, 10000);
      fetch('https://formsubmit.co/ajax/' + EMAIL, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(donnees), signal: ctrl ? ctrl.signal : undefined
      }).then(function (r) { return r.json().then(function (j) { if (!r.ok || String(j.success) !== 'true') throw new Error('refus'); }); })
        .then(function () {
          retour.className = 'form-retour form-retour--ok';
          retour.innerHTML = '<strong>Merci, votre demande est bien partie.</strong><br>Une personne de l’agence vous rappelle sous deux jours ouvrés. Pressé ? Appelez le <a href="tel:+33142686806">01 42 68 68 06</a>.';
          form.replaceWith(retour); retour.focus();
        })
        .catch(function () {
          var corps = resume(form);
          var lien = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(donnees._subject) + '&body=' + encodeURIComponent(corps);
          retour.className = 'form-retour form-retour--ko';
          retour.innerHTML = '<strong>L’envoi automatique n’a pas abouti.</strong><br>Votre demande n’est pas perdue : <a class="lien-mail">envoyez-la par e-mail en un clic</a>, ou appelez le <a href="tel:+33142686806">01 42 68 68 06</a>.';
          $('.lien-mail', retour).setAttribute('href', lien);
          if (!retour.parentNode) form.parentNode.insertBefore(retour, form);
          retour.focus();
        })
        .then(function () { clearTimeout(delai); if (bouton) { bouton.disabled = false; bouton.innerHTML = libelle; } });
    });
  });

  /* année du pied de page */
  $$('[data-annee]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
