/* =========================================================
   Voyages Loisirs — Interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Header au scroll ---------- */
  const header = document.querySelector(".header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector(".nav__toggle");
  if (toggle) {
    toggle.addEventListener("click", () => document.body.classList.toggle("nav-open"));
    document.querySelectorAll(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => document.body.classList.remove("nav-open"))
    );
  }

  /* ---------- Apparition au scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 90 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* =========================================================
     Données destinations
     ========================================================= */
  const IMG = {
    santorini: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
    bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
    maldives: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80",
    marrakech: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=80",
    tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
    newyork: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80",
    dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
    kenya: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80",
    reunion: "https://images.unsplash.com/photo-1589979481223-deb893043163?auto=format&fit=crop&w=900&q=80",
  };

  // Les 6 destinations de l'année — une sélection unique, renouvelée chaque année
  const DESTINATIONS = [
    { id: "marrakech", title: "Marrakech", country: "Maroc", price: 540, nights: 4, rating: 4.7, badge: "Janv. – Févr.", img: IMG.marrakech, desc: "Souks colorés, riads raffinés et portes du désert à quelques heures de la France." },
    { id: "tokyo", title: "Tokyo", country: "Japon", price: 1590, nights: 9, rating: 4.9, badge: "Mars – Avril", img: IMG.tokyo, desc: "Mégalopole électrique entre traditions millénaires et modernité fascinante." },
    { id: "santorini", title: "Santorin", country: "Grèce", price: 890, nights: 7, rating: 4.9, badge: "Mai – Juin", img: IMG.santorini, desc: "Villages blancs suspendus au-dessus de la mer Égée et couchers de soleil légendaires." },
    { id: "bali", title: "Bali", country: "Indonésie", price: 1290, nights: 10, rating: 4.8, badge: "Juil. – Août", img: IMG.bali, desc: "Rizières émeraude, temples sacrés et plages de rêve au cœur de l'île des dieux." },
    { id: "kenya", title: "Safari Kenya", country: "Kenya", price: 2450, nights: 8, rating: 5.0, badge: "Sept. – Oct.", img: IMG.kenya, desc: "Safari inoubliable dans le Masaï Mara à la rencontre des Big Five." },
    { id: "maldives", title: "Maldives", country: "Océan Indien", price: 2190, nights: 7, rating: 5.0, badge: "Nov. – Déc.", img: IMG.maldives, desc: "Villas sur pilotis, lagons turquoise et fonds marins parmi les plus beaux du monde." },
  ];

  window.VL_DATA = { DESTINATIONS };

  /* ---------- SVG helpers ---------- */
  const iPin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  const iStar = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 17.8 5.4 21.2 6.7 14.2 1.7 9.4l7-.9z"/></svg>';
  const iHeart = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
  const iArrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const iMoon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function cardHTML(d) {
    return (
      '<article class="dest-card reveal">' +
      (d.badge ? '<span class="dest-card__badge">' + d.badge + "</span>" : "") +
      '<button class="dest-card__fav" aria-label="Ajouter aux favoris">' + iHeart + "</button>" +
      '<img src="' + d.img + '" alt="' + d.title + '" loading="lazy">' +
      '<div class="dest-card__body">' +
      '<span class="dest-card__loc">' + iPin + d.country + "</span>" +
      '<h3 class="dest-card__title">' + d.title + "</h3>" +
      '<span class="rating">' + iStar + d.rating.toFixed(1) + ' · ' + d.nights + ' nuits ' + iMoon + "</span>" +
      '<div class="dest-card__meta">' +
      '<div class="dest-card__price">À partir de<b>' + d.price + " €</b></div>" +
      '<a class="dest-card__arrow" href="reservation.html?dest=' + d.id + '" aria-label="Réserver ' + d.title + '">' + iArrow + "</a>" +
      "</div></div></article>"
    );
  }

  /* ---------- Rendu grille (accueil + destinations) ---------- */
  const homeGrid = document.querySelector("[data-dest-home]");
  if (homeGrid) {
    homeGrid.innerHTML = DESTINATIONS.slice(0, 6).map(cardHTML).join("");
    // Les cartes sont injectées après le lancement de l'observateur : on les révèle directement.
    homeGrid.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }

  const fullGrid = document.querySelector("[data-dest-grid]");
  if (fullGrid) {
    const render = (list) => {
      fullGrid.innerHTML = list.length
        ? list.map(cardHTML).join("")
        : '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted)">Aucune destination pour ce filtre.</p>';
      // re-observer les nouvelles cartes
      fullGrid.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    };
    render(DESTINATIONS);

    document.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const f = chip.dataset.filter;
        render(f === "all" ? DESTINATIONS : DESTINATIONS.filter((d) => d.continent === f));
      });
    });
  }

  /* ---------- Barre de recherche (accueil) ---------- */
  const searchForm = document.querySelector("[data-search]");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const dest = searchForm.querySelector("[name=destination]").value;
      window.location.href = dest ? "reservation.html?dest=" + dest : "destinations.html";
    });
  }

  /* =========================================================
     Page réservation
     ========================================================= */
  const bookingRoot = document.querySelector("[data-booking]");
  if (bookingRoot) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("dest") || "santorini";
    const dest = DESTINATIONS.find((d) => d.id === id) || DESTINATIONS[0];

    // Remplir le récapitulatif
    const set = (sel, val) => { const el = bookingRoot.querySelector(sel); if (el) el.textContent = val; };
    const img = bookingRoot.querySelector("[data-sum-img]");
    if (img) { img.src = dest.img; img.alt = dest.title; }
    set("[data-sum-title]", dest.title);
    set("[data-sum-loc]", dest.country + " · " + dest.nights + " nuits");
    set("[data-sum-nights]", dest.nights + " nuits");

    const pricePerPerson = dest.price;
    const travelersInput = bookingRoot.querySelector("[name=travelers]");
    const rowBase = bookingRoot.querySelector("[data-row-base]");
    const rowFees = bookingRoot.querySelector("[data-row-fees]");
    const totalEl = bookingRoot.querySelector("[data-total]");
    const monthlyEl = bookingRoot.querySelector("[data-monthly]");
    const FEES = 49;

    const euro = (n) => n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €";
    function recalc() {
      const n = Math.max(1, parseInt(travelersInput ? travelersInput.value : "2", 10) || 1);
      const total = pricePerPerson * n + FEES;
      const instInput = bookingRoot.querySelector("[name=installments]:checked");
      const inst = instInput ? parseInt(instInput.value, 10) : 1;
      if (rowBase) rowBase.textContent = euro(pricePerPerson) + " × " + n;
      if (rowFees) rowFees.textContent = euro(FEES);
      if (totalEl) totalEl.textContent = euro(total);
      if (monthlyEl) {
        monthlyEl.textContent = inst > 1
          ? "soit " + inst + " × " + euro(Math.ceil(total / inst)) + " sans frais"
          : "en une seule fois";
      }
    }
    if (travelersInput) travelersInput.addEventListener("input", recalc);
    bookingRoot.querySelectorAll("[name=installments]").forEach((r) => r.addEventListener("change", recalc));
    recalc();

    // Soumission
    const form = bookingRoot.querySelector("[data-booking-form]");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const method = form.querySelector("[name=payment]:checked");
        const instChecked = form.querySelector("[name=installments]:checked");
        const instTxt = instChecked && instChecked.value !== "1" ? " en " + instChecked.value + " fois sans frais" : "";
        const btn = form.querySelector("[data-submit]");
        if (btn) {
          btn.disabled = true;
          btn.textContent = "Traitement sécurisé…";
          setTimeout(() => {
            bookingRoot.innerHTML =
              '<div class="booking-card text-center" style="max-width:560px;margin:0 auto">' +
              '<div style="width:80px;height:80px;margin:0 auto 1.5rem;border-radius:50%;background:linear-gradient(135deg,#3fa3c0,#7fd3d8);display:grid;place-items:center">' +
              '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#fff" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg></div>' +
              "<h2>Demande envoyée !</h2>" +
              "<p style=\"color:var(--text-muted)\">Merci pour votre confiance. Un conseiller Voyages Loisirs vous contacte sous 24h pour finaliser votre voyage à <b>" +
              dest.title + "</b> et sécuriser le paiement par <b>" +
              (method ? method.value : "carte bancaire") + instTxt + "</b>.</p>" +
              '<a class="btn btn--primary" href="index.html" style="margin-top:1rem">Retour à l\'accueil</a></div>';
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 1400);
        }
      });
    }
  }

  /* ---------- Newsletter / faux formulaires ---------- */
  document.querySelectorAll("[data-notify]").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = f.querySelector("button");
      if (btn) { btn.textContent = "Merci ! ✓"; btn.disabled = true; }
    });
  });

  /* ---------- Année footer ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
