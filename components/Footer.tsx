import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#102b67] text-white">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="text-xl font-extrabold tracking-[.12em]">VOYAGES <span className="text-[#f47716]">LOISIRS</span></div>
          <div className="mt-1 text-sm tracking-[.25em] text-blue-100">BY AYA</div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100">Des voyages organisés pour découvrir le monde autrement, avec le plaisir de voyager ensemble.</p>
        </div>
        <div>
          <h3 className="font-bold">Contact réservation</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-blue-100">
            <a href="tel:+33142686806">01 42 68 68 06</a>
            <a href="mailto:reservation@ayavoyages.fr">reservation@ayavoyages.fr</a>
            <span>49 rue des Mathurins, 75008 Paris</span>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Informations</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-blue-100">
            <Link href="/#voyages">Tous les voyages</Link>
            <Link href="/#contact">Demander une réservation</Link>
            <a href="https://www.ayavoyages.com/" target="_blank" rel="noreferrer">Mentions légales et cookies ↗</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container flex flex-col gap-2 py-5 text-xs text-blue-100 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Voyages Loisirs by Aya</span>
          <span>Dates et tarifs à confirmer auprès de l’agence.</span>
        </div>
      </div>
    </footer>
  );
}
