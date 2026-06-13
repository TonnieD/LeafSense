import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: {
    default: "LeafSense — AI Crop Disease Detection",
    template: "%s | LeafSense",
  },
  description:
    "AI-powered crop disease detection from leaf images and field descriptions. Identify plant diseases instantly and get targeted pesticide recommendations.",
  keywords: [
    "crop disease detection",
    "plant disease AI",
    "leaf diagnosis",
    "agricultural AI",
    "pesticide recommendation",
    "PlantVillage",
    "deep learning",
  ],
  authors: [
    { name: "Anthony Nganga Chege" },
    { name: "Diana Mayalo" },
  ],
  openGraph: {
    type: "website",
    siteName: "LeafSense",
    title: "LeafSense — AI Crop Disease Detection",
    description:
      "Identify crop diseases from leaf images or symptom descriptions. Powered by CNN and NLP.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex flex-col min-h-screen bg-cream text-soil font-sans">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-cream-dark bg-[#0c0e0a] py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-serif font-semibold text-soil text-lg">LeafSense</p>
                <p className="text-xs text-soil/50 mt-1">
                  AI-powered crop disease detection for farmers, agronomists, and researchers.
                </p>
              </div>
              <div className="text-xs text-soil/50 space-y-1 md:text-right">
                <p>Developed by Aluoch Phanela, Anthony Nganga Chege, Diana Mayalo, Lewis Mwaki, and Margaret Kariuki.</p>
                <p>Production migration by Anthony Nganga Chege.</p>
                <p className="mt-2 text-soil/30">
                  CNN + NLP &bull; PlantVillage Dataset &bull; 15 Disease Classes
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
