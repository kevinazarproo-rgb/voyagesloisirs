"use client";

import { useState } from "react";

export default function RequestForm({ tripTitle }: { tripTitle?: string }) {
  const [sent, setSent] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone") || "Non renseigné",
      trip: form.get("trip"),
      departure: form.get("departure") || "Flexible",
      people: form.get("people"),
      message: form.get("message") || "Aucun message",
    };
    const subject = encodeURIComponent(`Demande de réservation — ${values.trip}`);
    const body = encodeURIComponent(
      `Bonjour Aya Voyages,\n\nNom : ${values.name}\nE-mail : ${values.email}\nTéléphone : ${values.phone}\nVoyage : ${values.trip}\nDate souhaitée : ${values.departure}\nVoyageurs : ${values.people}\nMessage : ${values.message}\n\nMerci.`,
    );
    window.location.href = `mailto:reservation@ayavoyages.fr?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-bold text-slate-700">
        Nom et prénom *
        <input className="field mt-2" name="name" autoComplete="name" required placeholder="Votre nom" />
      </label>
      <label className="text-sm font-bold text-slate-700">
        Adresse e-mail *
        <input className="field mt-2" name="email" type="email" autoComplete="email" required placeholder="vous@exemple.fr" />
      </label>
      <label className="text-sm font-bold text-slate-700">
        Téléphone
        <input className="field mt-2" name="phone" type="tel" autoComplete="tel" placeholder="Votre numéro" />
      </label>
      <label className="text-sm font-bold text-slate-700">
        Voyage souhaité *
        <input className="field mt-2" name="trip" required defaultValue={tripTitle || ""} placeholder="Choisissez une destination" />
      </label>
      <label className="text-sm font-bold text-slate-700">
        Date de départ souhaitée
        <input className="field mt-2" name="departure" placeholder="Ex. octobre 2027" />
      </label>
      <label className="text-sm font-bold text-slate-700">
        Nombre de voyageurs *
        <select className="field mt-2" name="people" defaultValue="2" required>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
            <option key={count} value={count}>{count} {count === 1 ? "personne" : "personnes"}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-bold text-slate-700 sm:col-span-2">
        Votre message
        <textarea className="field mt-2 min-h-28 resize-y" name="message" placeholder="Précisez vos questions ou préférences…" />
      </label>
      <div className="sm:col-span-2">
        <button className="btn-primary w-full sm:w-auto" type="submit">Préparer ma demande <span aria-hidden>→</span></button>
        <p className="mt-3 text-xs leading-5 text-slate-500">Votre demande n’est pas une réservation confirmée. L’agence doit confirmer les disponibilités et le tarif.</p>
        {sent && <p role="status" className="mt-3 rounded-xl bg-orange-50 p-3 text-sm text-[#102b67]">Votre logiciel de messagerie va préparer un e-mail pour reservation@ayavoyages.fr.</p>}
      </div>
    </form>
  );
}
