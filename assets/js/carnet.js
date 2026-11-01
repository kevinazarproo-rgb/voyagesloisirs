/* ==========================================================================
   LE CARNET D’ITINÉRAIRES — carnet.js
   Un seul fichier, des modules internes. Chaque module vérifie la présence de
   ses éléments : le script est inoffensif sur une page qui n’a pas le composant.
   Tous les modules lisent prefers-reduced-motion et html.motion-off.
   API publique (pour les scripts de page) : window.Carnet
   ========================================================================== */
(function () {
  'use strict';
  var html = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var aIO = 'IntersectionObserver' in window;
  var mqReduit = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function reduit() { return !!(mqReduit.matches || html.classList.contains('motion-off')); }
  function duree(ms) { return reduit() ? 0 : ms; }
  function supporte(decl) { return !!(window.CSS && CSS.supports && CSS.supports(decl)); }
  function surChangement(mq, fn) { if (!mq) return; if (mq.addEventListener) mq.addEventListener('change', fn); else if (mq.addListener) mq.addListener(fn); }

  /* ---------- noJs ---------- */
  function noJs() { html.classList.remove('no-js'); }

  /* ---------- ticker rAF unique ---------- */
  var ticker = (function () {
    var fns = [], prevu = false;
    function executer() { prevu = false; for (var i = 0; i < fns.length; i++) { try { fns[i](); } catch (e) { /* un module ne doit pas bloquer les autres */ } } }
    function demander() { if (!prevu && fns.length) { prevu = true; requestAnimationFrame(executer); } }
    addEventListener('scroll', demander, { passive: true });
    addEventListener('resize', demander, { passive: true });
    return {
      add: function (fn) { if (fns.indexOf(fn) < 0) fns.push(fn); demander(); },
      remove: function (fn) { var i = fns.indexOf(fn); if (i > -1) fns.splice(i, 1); },
      demander: demander
    };
  })();

  /* ---------- IntersectionObserver partagés ---------- */
  var observateurs = {};
  function obtenirObservateur(opts) {
    var cle = JSON.stringify(opts);
    if (!observateurs[cle]) {
      observateurs[cle] = new IntersectionObserver(function (entrees, obs) {
        entrees.forEach(function (e) {
          var cbs = e.target.__carnetCb && e.target.__carnetCb[cle];
          if (cbs) cbs.slice().forEach(function (cb) { cb(e, obs); });
        });
      }, opts);
    }
    return observateurs[cle];
  }
  /* suivre : rappel à chaque changement ; cesser(el, opts) pour arrêter */
  function suivre(el, cb, opts) {
    opts = opts || {};
    if (!aIO) { cb({ isIntersecting: true, target: el, boundingClientRect: el.getBoundingClientRect() }); return; }
    var cle = JSON.stringify(opts);
    el.__carnetCb = el.__carnetCb || {};
    (el.__carnetCb[cle] = el.__carnetCb[cle] || []).push(cb);
    obtenirObservateur(opts).observe(el);
  }
  function cesser(el, opts) {
    if (!aIO) return;
    var cle = JSON.stringify(opts || {});
    if (el.__carnetCb) delete el.__carnetCb[cle];
    obtenirObservateur(opts || {}).unobserve(el);
  }
  /* uneFois : déclenche quand l’élément entre (ou s’il est déjà passé au-dessus), puis cesse d’observer */
  function uneFois(el, cb, opts) {
    opts = opts || {};
    suivre(el, function (e) {
      if (e.isIntersecting || e.boundingClientRect.bottom < 0) { cesser(el, opts); cb(e); }
    }, opts);
  }
  /* will-change posé juste avant l’animation, retiré après */
  function animer(el, max) {
    el.classList.add('will-change');
    var fini = false;
    function fin() { if (fini) return; fini = true; el.classList.remove('will-change'); el.removeEventListener('transitionend', fin); }
    el.addEventListener('transitionend', fin);
    setTimeout(fin, max || 2000);
  }
  function doubleRaf(fn) { requestAnimationFrame(function () { requestAnimationFrame(fn); }); }

  /* ---------- tout visible (reduced-motion, motion-off, repli) ---------- */
  function toutVisible() {
    $$('[data-reveal],[data-reveal-enfant],.lignes,.exergue,.horaire,.frise,.deroule,.plan,.filet--trace').forEach(function (el) { el.classList.add('is-vu'); });
    $$('.photo--developpe').forEach(function (el) { el.classList.add('is-developpe'); });
    $$('.tampon--anime').forEach(function (el) { el.classList.add('is-pose'); });
    $$('.jour').forEach(function (el) { el.classList.add('is-lu'); });
    $$('.appel').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- clavier : .clavier sur <html> au premier Tab ---------- */
  function clavier() {
    function surTouche(e) {
      if (e.key !== 'Tab') return;
      html.classList.add('clavier');
      var f = $('.titre-courant__folio');
      if (f) f.setAttribute('aria-live', 'polite');
      removeEventListener('keydown', surTouche);
    }
    addEventListener('keydown', surTouche);
  }

  /* ---------- barre : fondue puis posée (sentinelle à 64 px) ---------- */
  function barre() {
    var b = $('#barre') || $('.barre');
    if (!b || b.classList.contains('is-fixe')) return;
    var s = $('.sentinelle');
    function poser(on) { b.classList.toggle('is-set', !!on); }
    poser(window.scrollY > 64);
    if (s && aIO) {
      new IntersectionObserver(function (en) { en.forEach(function (e) { poser(!e.isIntersecting); }); }, { threshold: 0 }).observe(s);
    } else {
      addEventListener('scroll', function () { poser(window.scrollY > 64); }, { passive: true });
    }
  }

  /* ---------- overlay : sommaire mobile ---------- */
  function overlay() {
    var btn = $('.barre__sommaire'), ov = $('#sommaire-mobile');
    if (!btn || !ov) return;
    var fermerBtn = ov.querySelector('.sommaire-mobile__fermer');
    var inertes = [], ouvert = false, dernierFocus = null;
    $$('.sommaire-mobile__ligne', ov).forEach(function (l, i) { if (!l.style.getPropertyValue('--i')) l.style.setProperty('--i', i); });
    function focusables() {
      return $$('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', ov)
        .filter(function (el) { return el.offsetParent !== null || el === fermerBtn; });
    }
    function ouvrir() {
      if (ouvert) return;
      ouvert = true;
      dernierFocus = document.activeElement;
      var r = btn.getBoundingClientRect();
      ov.style.setProperty('--bx', Math.round(r.left + r.width / 2) + 'px');
      ov.style.setProperty('--by', Math.round(r.top + r.height / 2) + 'px');
      ov.classList.add('is-ouvert');
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('a-overlay');
      inertes = $$('main,footer,.appel,.titre-courant,.pagination');
      inertes.forEach(function (el) { el.inert = true; el.setAttribute('aria-hidden', 'true'); });
      addEventListener('keydown', surTouche);
      setTimeout(function () { var f = fermerBtn || focusables()[0]; if (f) f.focus(); }, duree(80));
    }
    function fermer() {
      if (!ouvert) return;
      ouvert = false;
      ov.classList.remove('is-ouvert');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('a-overlay');
      inertes.forEach(function (el) { el.inert = false; el.removeAttribute('aria-hidden'); });
      inertes = [];
      removeEventListener('keydown', surTouche);
      var cible = (dernierFocus && document.contains(dernierFocus)) ? dernierFocus : btn;
      if (cible && cible.focus) cible.focus({ preventScroll: true });
    }
    function surTouche(e) {
      if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); fermer(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var premier = f[0], dernier = f[f.length - 1];
      if (!ov.contains(document.activeElement)) { e.preventDefault(); premier.focus(); return; }
      if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
      else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
    }
    btn.addEventListener('click', function () { if (ouvert) fermer(); else ouvrir(); });
    if (fermerBtn) fermerBtn.addEventListener('click', fermer);
    ov.addEventListener('click', function (e) { if (e.target.closest('a[href]')) fermer(); });
    surChangement(matchMedia('(min-width: 900px)'), function (e) { if (e.matches) fermer(); });
    return { ouvrir: ouvrir, fermer: fermer };
  }

  /* ---------- revelations : [data-reveal] et [data-reveal-enfant] ---------- */
  function revelations() {
    var conteneurs = $$('[data-reveal]');
    conteneurs.forEach(function (c) {
      $$('[data-reveal-enfant]', c).forEach(function (e, i) { if (!e.style.getPropertyValue('--i')) e.style.setProperty('--i', i); });
    });
    var orphelins = $$('[data-reveal-enfant]').filter(function (e) { return !e.closest('[data-reveal]'); });
    orphelins.forEach(function (e, i) { if (!e.style.getPropertyValue('--i')) e.style.setProperty('--i', i); });
    if (reduit()) { toutVisible(); return; }
    conteneurs.forEach(function (c) {
      var mode = c.getAttribute('data-reveal');
      if (mode === 'chargement') { doubleRaf(function () { c.classList.add('is-vu'); }); return; }
      var seuil = parseFloat(c.getAttribute('data-seuil'));
      if (isNaN(seuil)) seuil = 0.15;
      uneFois(c, function () { if (mode !== 'conteneur') animer(c); c.classList.add('is-vu'); }, { threshold: seuil, rootMargin: '0px 0px -8% 0px' });
    });
    orphelins.forEach(function (e) {
      uneFois(e, function () { e.classList.add('is-vu'); }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    });
  }

  /* ---------- lignes : masque de ligne sur les titres .lignes ---------- */
  function lignes() {
    $$('.lignes').forEach(function (t) {
      var ls = $$('.ligne', t);
      if (!ls.length && /<br\s*\/?>/i.test(t.innerHTML)) {
        t.innerHTML = t.innerHTML.split(/<br\s*\/?>/i).map(function (p) { return '<span class="ligne">' + p.trim() + '</span>'; }).join(' ');
        ls = $$('.ligne', t);
      }
      ls.forEach(function (l, i) {
        if (!l.querySelector('.ligne__texte')) {
          var s = document.createElement('span');
          s.className = 'ligne__texte';
          while (l.firstChild) s.appendChild(l.firstChild);
          l.appendChild(s);
        }
        if (!l.style.getPropertyValue('--i')) l.style.setProperty('--i', i);
      });
      if (t.closest('[data-reveal]')) return; /* le conteneur déclenche */
      if (reduit()) { t.classList.add('is-vu'); return; }
      uneFois(t, function () { t.classList.add('is-vu'); }, { threshold: 0.2 });
    });
  }

  /* ---------- developpement : photos qui passent du gris à la couleur (3 max) ---------- */
  function developpement() {
    var figs = $$('.photo--developpe');
    if (!figs.length) return;
    var faible = innerWidth < 600 && (navigator.hardwareConcurrency || 8) <= 4;
    if (reduit() || faible) { figs.forEach(function (f) { f.classList.add('is-developpe'); }); return; }
    var actifs = 0, file = [];
    function quandPrete(f, cb) {
      var img = f.querySelector('img');
      if (!img || img.complete) { cb(); return; }
      var fait = false;
      function go() { if (fait) return; fait = true; cb(); }
      img.addEventListener('load', go); img.addEventListener('error', go);
      setTimeout(go, 3000);
    }
    function lancer(f) {
      actifs++;
      var img = f.querySelector('img');
      if (img) animer(img, duree(1300) + 400);
      f.classList.add('is-developpe');
      setTimeout(function () { actifs--; suivant(); }, duree(1300) + 100);
    }
    function suivant() { while (actifs < 3 && file.length) lancer(file.shift()); }
    function demander(f) {
      if (f.classList.contains('is-developpe') || f.__enFile) return;
      f.__enFile = true;
      quandPrete(f, function () { file.push(f); suivant(); });
    }
    figs.forEach(function (f) {
      if (f.getAttribute('data-developpe') === 'chargement') { demander(f); return; }
      uneFois(f, function () { demander(f); }, { threshold: 0.25 });
    });
  }

  /* ---------- fil : fil de lecture du récit (repli JS de animation-timeline) ---------- */
  function fil() {
    var jours = $$('.jour');
    if (!jours.length || !$('.jour .fil')) return;
    if (reduit()) { jours.forEach(function (j) { j.classList.add('is-lu'); }); return; }
    if (supporte('animation-timeline: view()')) return;
    jours.forEach(function (j) { uneFois(j, function () { j.classList.add('is-lu'); }, { rootMargin: '0px 0px -40% 0px', threshold: 0 }); });
  }

  /* ---------- folio : titre courant, pagination, barre d’appel (roulement du chiffre) ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function rouler(r, texte) {
    /* l’état courant est toujours le dernier span ; les spans précédents sont en train de sortir
       (défilement très rapide : plusieurs roulements à moins de 300 ms d’intervalle) */
    var spans = $$('span', r), ancien = spans.length ? spans[spans.length - 1] : null;
    if (!ancien) { r.textContent = ''; ancien = document.createElement('span'); r.appendChild(ancien); }
    if (ancien.textContent === texte) return;
    if (reduit()) { r.textContent = ''; ancien = document.createElement('span'); ancien.textContent = texte; r.appendChild(ancien); return; }
    spans.forEach(function (s) { if (s !== ancien && s.parentNode === r) r.removeChild(s); });
    var nouveau = document.createElement('span');
    nouveau.className = 'roulement__entrant';
    nouveau.textContent = texte;
    r.appendChild(nouveau);
    ancien.className = 'roulement__sortant';
    doubleRaf(function () { nouveau.classList.add('is-en-place'); });
    clearTimeout(r._roulement);
    r._roulement = setTimeout(function () {
      $$('span', r).forEach(function (s) { if (s !== nouveau) r.removeChild(s); });
      nouveau.className = '';
    }, duree(250) + 60);
  }
  function folio() {
    var jours = $$('.jour[data-jour]');
    if (!jours.length) return;
    var folioEl = $('.titre-courant__folio'), liens = $$('.pagination a[href^="#"]'), appel = $('.appel__folio');
    var recit = $('.recit');
    var total = parseInt((folioEl && folioEl.getAttribute('data-total')) || (recit && recit.getAttribute('data-total')) || jours.length, 10) || jours.length;
    var courant = null;
    function maj(j) {
      if (j === courant) return;
      courant = j;
      var n = parseInt(j.getAttribute('data-jour'), 10) || 0;
      liens.forEach(function (a) {
        if (a.getAttribute('href') === '#' + j.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      if (folioEl) {
        var r = folioEl.querySelector('.roulement');
        if (r) rouler(r, pad(n)); else folioEl.textContent = 'Jour ' + pad(n) + ' / ' + pad(total);
      }
      if (appel) appel.textContent = 'J' + n + ' / ' + total;
    }
    jours.forEach(function (j) { suivre(j, function (e) { if (e.isIntersecting) maj(j); }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 }); });
  }

  /* ---------- titreCourant : apparaît quand l’ouverture est sortie de l’écran ---------- */
  function titreCourant() {
    var tc = $('.titre-courant'), ouv = $('#ouverture');
    if (!tc || !ouv) return;
    suivre(ouv, function (e) { tc.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.bottom <= 0); }, { threshold: 0 });
  }

  /* ---------- parallaxe : ticker rAF, desktop et pointeur fin ---------- */
  function parallaxe() {
    var els = $$('[data-parallaxe]');
    if (!els.length) return;
    var mq = matchMedia('(min-width: 900px) and (pointer: fine)');
    if (reduit() || !mq.matches || supporte('animation-timeline: view()')) return;
    var visibles = [];
    function calc() {
      if (reduit()) { visibles.forEach(function (el) { el.__img.style.transform = ''; }); visibles = []; ticker.remove(calc); return; }
      var vh = innerHeight || 1;
      visibles.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var ratio = (r.top + r.height / 2 - vh / 2) / vh;
        var y = Math.max(-0.06, Math.min(0.06, ratio * -0.12)) * r.height;
        el.__img.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
      });
    }
    els.forEach(function (el) {
      var img = el.querySelector('img');
      if (!img) return;
      el.__img = img;
      suivre(el, function (e) {
        var i = visibles.indexOf(el);
        if (e.isIntersecting) { if (i < 0) visibles.push(el); ticker.add(calc); }
        else if (i > -1) visibles.splice(i, 1);
      }, { threshold: 0 });
    });
  }

  /* ---------- calendrier : frise focalisable seulement quand elle défile ---------- */
  function calendrier() {
    var d = $('.frise-defile');
    if (!d) return;
    function maj() {
      if (d.scrollWidth > d.clientWidth + 2) {
        d.setAttribute('tabindex', '0'); d.setAttribute('role', 'region');
        d.setAttribute('aria-label', 'Calendrier des départs 2027, défilement horizontal');
      } else { d.removeAttribute('tabindex'); d.removeAttribute('role'); d.removeAttribute('aria-label'); }
    }
    maj();
    addEventListener('resize', maj, { passive: true });
  }

  /* ---------- appelMobile : barre d’appel basse ---------- */
  function appelMobile() {
    var a = $('.appel');
    if (!a) return;
    setTimeout(function () { a.classList.add('is-visible'); }, duree(600));
    var visibles = [];
    $$('footer,.ours,.formulaire,.formulaire__succes').forEach(function (c) {
      suivre(c, function (e) {
        var i = visibles.indexOf(c);
        if (e.isIntersecting) { if (i < 0) visibles.push(c); } else if (i > -1) visibles.splice(i, 1);
        a.classList.toggle('is-cachee', visibles.length > 0);
      }, { threshold: 0 });
    });
  }

  /* ---------- options : agrandir le texte, réduire les animations ---------- */
  var defsOptions = { texte: { cls: 'texte-grand', cle: 'carnet-texte' }, animations: { cls: 'motion-off', cle: 'carnet-motion' } };
  function options() {
    function lire(cle) { try { return localStorage.getItem(cle) === '1'; } catch (e) { return false; } }
    function ecrire(cle, val) { try { if (val) localStorage.setItem(cle, '1'); else localStorage.removeItem(cle); } catch (e) { /* stockage indisponible */ } }
    Object.keys(defsOptions).forEach(function (k) { if (lire(defsOptions[k].cle)) html.classList.add(defsOptions[k].cls); });
    $$('.ours__options button[data-option], [data-option-carnet]').forEach(function (b) {
      var d = defsOptions[b.getAttribute('data-option') || b.getAttribute('data-option-carnet')];
      if (!d) return;
      b.setAttribute('aria-pressed', html.classList.contains(d.cls) ? 'true' : 'false');
      b.addEventListener('click', function () {
        var on = !html.classList.contains(d.cls);
        html.classList.toggle(d.cls, on);
        $$('[data-option="' + (b.getAttribute('data-option') || b.getAttribute('data-option-carnet')) + '"]').forEach(function (x) { x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        ecrire(d.cle, on);
        if (d.cls === 'motion-off') changementMouvement();
      });
    });
  }
  function changementMouvement() {
    if (reduit()) toutVisible();
    try { document.dispatchEvent(new CustomEvent('carnet:mouvement', { detail: { reduit: reduit() } })); } catch (e) { /* ancien navigateur */ }
  }

  /* ---------- details : accordéons animés ---------- */
  function details() {
    $$('details').forEach(function (d) {
      var s = d.querySelector('summary'), c = d.querySelector('.details__contenu');
      if (!s || !c) return;
      s.addEventListener('click', function (ev) {
        ev.preventDefault();
        if (d.classList.contains('is-animant') || d.classList.contains('is-fermant')) return;
        if (reduit()) { d.open = !d.open; return; }
        if (d.open) {
          d.classList.add('is-fermant');
          var t;
          var fin = function (e) {
            if (e && e.target !== c) return;
            c.removeEventListener('transitionend', fin); clearTimeout(t);
            d.open = false; d.classList.remove('is-fermant');
          };
          t = setTimeout(fin, 450);
          c.addEventListener('transitionend', fin);
        } else {
          d.classList.add('is-animant');
          d.open = true;
          void c.offsetHeight;
          doubleRaf(function () { d.classList.remove('is-animant'); });
        }
      });
    });
  }

  /* ---------- exergue : mot par mot, texte complet conservé en .sr-only ---------- */
  function exergue() {
    var ex = $$('.exergue');
    if (!ex.length || reduit()) return;
    ex.forEach(function (e) {
      if (e.closest('.jour--sobre') || e.querySelector('.mot') || e.hasAttribute('data-sans-decoupe')) return;
      var texte = e.textContent.replace(/\s+$/, '').replace(/^\s+/, '');
      var mots = texte.split(/ +/);
      if (mots.length < 2) return;
      var n = mots.length;
      var pas = Math.min(40, Math.floor(550 / Math.max(1, n - 1)));
      var sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = texte;
      var wrap = document.createElement('span'); wrap.className = 'exergue__mots'; wrap.setAttribute('aria-hidden', 'true');
      mots.forEach(function (m, i) {
        var s = document.createElement('span'); s.className = 'mot'; s.style.setProperty('--i', i); s.textContent = m;
        wrap.appendChild(s);
        if (i < n - 1) wrap.appendChild(document.createTextNode(' '));
      });
      e.style.setProperty('--pas-mot', pas + 'ms');
      e.textContent = '';
      e.appendChild(sr); e.appendChild(wrap);
      uneFois(e, function () { e.classList.add('is-vu'); }, { threshold: 0.4 });
    });
  }

  /* ---------- tampon : « dès 3 500 € », « REÇU » ---------- */
  function tampon() {
    $$('.tampon--anime').forEach(function (t) {
      if (t.classList.contains('is-pose')) return;
      if (reduit()) { t.classList.add('is-pose'); return; }
      if (t.closest('[data-reveal="chargement"]')) { doubleRaf(function () { t.classList.add('is-pose'); }); return; }
      uneFois(t, function () { t.classList.add('is-pose'); }, { threshold: 0.3 });
    });
  }

  /* ---------- filtrePeriode : sommaire complet (voyages.html), complète le filtre CSS :has() ---------- */
  function filtrePeriode() {
    var f = $('.filtre-periode');
    if (!f) return;
    var pages = $$('.double-page'), compte = $('.filtre-periode__compte');
    function maj() {
      var r = f.querySelector('input:checked');
      var val = r ? r.value : 'toutes';
      var n = 0;
      pages.forEach(function (p) {
        var ok = val === 'toutes' || (' ' + (p.getAttribute('data-periode') || '') + ' ').indexOf(' ' + val + ' ') > -1;
        if (ok) { n++; p.removeAttribute('aria-hidden'); } else p.setAttribute('aria-hidden', 'true');
      });
      if (compte) compte.textContent = n + ' chapitre' + (n > 1 ? 's' : '') + ' correspond' + (n > 1 ? 'ent' : '') + (val === 'toutes' ? '' : ' à cette période') + '.';
    }
    f.addEventListener('change', maj);
    maj();
  }

  /* ---------- impression : liens [data-imprimer] ---------- */
  function impression() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-imprimer]');
      if (!a) return;
      e.preventDefault();
      window.print();
    });
    /* les <details> fermés n’impriment pas leur contenu : on les ouvre le temps de l’impression */
    var ouverts = [];
    window.addEventListener('beforeprint', function () {
      ouverts = $$('details:not([open])');
      ouverts.forEach(function (d) { d.setAttribute('open', ''); d.setAttribute('data-ouvert-impression', ''); });
    });
    window.addEventListener('afterprint', function () {
      ouverts.forEach(function (d) { d.removeAttribute('open'); d.removeAttribute('data-ouvert-impression'); });
      ouverts = [];
    });
  }

  /* ---------- videos : interludes facultatifs (V2), chargement différé ---------- */
  function videos() {
    var vs = $$('video[data-src]');
    if (!vs.length) return;
    var economie = navigator.connection && navigator.connection.saveData;
    if (reduit() || economie || matchMedia('(max-width: 699px)').matches) return;
    vs.forEach(function (v) {
      suivre(v, function (e) {
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) { v.setAttribute('src', v.getAttribute('data-src')); v.load(); }
          if (v.play) { var p = v.play(); if (p && p.catch) p.catch(function () { /* lecture refusée : l’affiche reste */ }); }
        } else if (v.getAttribute('src') && v.pause) v.pause();
      }, { rootMargin: '200px' });
    });
  }

  /* ---------- démarrage ---------- */
  function demarrer() {
    noJs();
    clavier();
    barre();
    window.Carnet.overlay = overlay();
    lignes();
    exergue();
    revelations();
    developpement();
    fil();
    folio();
    titreCourant();
    parallaxe();
    calendrier();
    appelMobile();
    options();
    details();
    tampon();
    filtrePeriode();
    impression();
    videos();
    surChangement(mqReduit, changementMouvement);
  }
  window.Carnet = {
    reduit: reduit, duree: duree, ticker: ticker, suivre: suivre, cesser: cesser, uneFois: uneFois,
    animer: animer, rouler: rouler, toutVisible: toutVisible, pad: pad
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
