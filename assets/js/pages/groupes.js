/* ==========================================================================
   LE CARNET D’ITINÉRAIRES — groupes.js
   Page « Groupes, associations et comités d’entreprise » :
   bouton « Copier ce texte » de l’encadré « Un mot aux présidents d’association ».
   Presse-papiers (navigator.clipboard) ; repli : un <textarea readonly> sélectionné.
   Chargé après carnet.js et formulaire.js ; inoffensif sans l’encadré.
   ========================================================================== */
(function () {
  'use strict';
  var boutons = Array.prototype.slice.call(document.querySelectorAll('[data-copier-texte]'));
  if (!boutons.length) return;

  function texteDe(source) {
    /* Texte brut, espaces normalisés, sans les insécables qui surprennent dans un courrier. */
    return source.textContent.replace(/[  ]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  boutons.forEach(function (bouton) {
    var cible = bouton.getAttribute('data-copier-texte');
    var source = cible ? document.querySelector(cible) : null;
    if (!source) return;
    var enveloppe = bouton.closest('.mot-copier__corps') || bouton.closest('.mot-copier') || bouton.parentNode;
    var etat = document.getElementById(bouton.getAttribute('aria-describedby') || '') || null;
    var libelle = bouton.textContent;
    var minuterie = 0;

    function dire(message, duree) {
      if (!etat) return;
      etat.textContent = message;
      clearTimeout(minuterie);
      if (duree) minuterie = setTimeout(function () { etat.textContent = ''; }, duree);
    }

    function fait() {
      bouton.textContent = 'Copié ✓';
      dire('Le texte est copié. Collez-le dans votre courrier ou votre e-mail.', 4000);
      clearTimeout(bouton.__retour);
      bouton.__retour = setTimeout(function () { bouton.textContent = libelle; }, 2000);
    }

    function repli(texte) {
      var ta = enveloppe.querySelector('.mot-copier__repli');
      if (!ta) {
        ta = document.createElement('textarea');
        ta.className = 'mot-copier__repli';
        ta.readOnly = true;
        ta.setAttribute('aria-label', 'Texte à copier');
        var actions = bouton.closest('.actions');
        if (actions && actions.parentNode === enveloppe) enveloppe.insertBefore(ta, actions.nextSibling); else enveloppe.appendChild(ta);
      }
      ta.value = texte;
      ta.focus();
      ta.select();
      dire('Le texte est sélectionné ci-dessous : copiez-le avec Ctrl + C (ou Cmd + C).');
    }

    bouton.addEventListener('click', function () {
      var texte = texteDe(source);
      if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext !== false) {
        navigator.clipboard.writeText(texte).then(fait, function () { repli(texte); });
      } else {
        repli(texte);
      }
    });
  });
})();
