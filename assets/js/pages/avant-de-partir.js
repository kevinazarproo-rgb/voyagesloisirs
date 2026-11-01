/* ==========================================================================
   LE CARNET D’ITINÉRAIRES — avant-de-partir.js
   Page « Questions » : ouvre l’accordéon visé par l’ancre de l’URL (#q-visa…)
   ou par un lien interne, pour qu’une question partagée arrive déjà dépliée.
   Les accordéons eux-mêmes (animation, « + ») sont gérés par carnet.js.
   ========================================================================== */
(function () {
  'use strict';
  function ouvrir(hash) {
    if (!hash || hash.length < 2) return;
    var el = null;
    try { el = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { el = null; }
    if (!el || el.tagName !== 'DETAILS' || el.open) return;
    el.open = true;
  }
  ouvrir(location.hash);
  window.addEventListener('hashchange', function () { ouvrir(location.hash); });
})();
