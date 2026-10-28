import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Voyages Loisirs by Aya | Des voyages qui ont du sens",
  description: "Découvrez les voyages organisés Voyages Loisirs by Aya : Chine, Pologne, Panama, Crète et escapades en France. Demandez votre réservation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><Header />{children}<Footer /></body></html>;
}
