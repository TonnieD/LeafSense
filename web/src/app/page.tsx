import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LeafSense — AI Crop Disease Detection",
  description:
    "AI-powered crop disease detection from leaf images and field descriptions. Identify plant diseases instantly and get targeted pesticide recommendations.",
};

const features = [
  {
    id: "feature-image",
    title: "Convolutional Neural Network",
    description:
      "A custom CNN trained on 20,000+ PlantVillage images achieves 94–95% accuracy across 15 disease classes.",
  },
  {
    id: "feature-nlp",
    title: "NLP Text Classification",
    description:
      "Multinomial Naive Bayes with TF-IDF vectorization classifies crop symptoms described in plain language.",
  },
  {
    id: "feature-rec",
    title: "Pesticide Recommendations",
    description:
      "Every diagnosis is paired with a targeted treatment recommendation from a curated agronomic reference.",
  },
];

const ctaCards = [
  {
    id: "cta-image-diagnosis",
    href: "/image-diagnosis",
    label: "Diagnose from Image",
    description:
      "Upload a leaf photo or take one with your camera. Our CNN model identifies the disease within seconds.",
    accent: "sage",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="3" y="7" width="26" height="20" rx="3" stroke="#6b7c3f" strokeWidth="2" />
        <circle cx="16" cy="17" r="5" stroke="#6b7c3f" strokeWidth="2" />
        <path d="M11 7V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" stroke="#6b7c3f" strokeWidth="2" />
        <circle cx="24.5" cy="11.5" r="1.5" fill="#6b7c3f" />
      </svg>
    ),
  },
  {
    id: "cta-text-diagnosis",
    href: "/text-diagnosis",
    label: "Diagnose from Description",
    description:
      "Describe what you observe on the crop in plain language. Our NLP model interprets your symptoms.",
    accent: "wheat",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="24" height="28" rx="3" stroke="#c9a84c" strokeWidth="2" />
        <line x1="9" y1="11" x2="23" y2="11" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" />
        <line x1="9" y1="16" x2="23" y2="16" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" />
        <line x1="9" y1="21" x2="17" y2="21" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-soil via-soil-light to-sage py-24 md:py-32"
        aria-labelledby="hero-heading"
      >
        {/* Decorative background grain */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label text-wheat/80 mb-4">
            Agricultural Intelligence Platform
          </p>
          <h1
            id="hero-heading"
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-cream leading-tight mb-6"
          >
            Detect Crop Disease <br className="hidden sm:block" />
            <span className="text-wheat">Before It Spreads</span>
          </h1>
          <p className="max-w-2xl mx-auto text-cream/75 text-lg md:text-xl leading-relaxed mb-10 font-sans">
            LeafSense uses deep learning and natural language processing to identify
            plant diseases from leaf images and field descriptions, giving farmers,
            agronomists, and researchers instant, actionable diagnoses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              id="hero-cta-image"
              href="/image-diagnosis"
              className="btn-wheat text-base px-8 py-3.5"
            >
              Diagnose from Image
            </Link>
            <Link
              id="hero-cta-text"
              href="/text-diagnosis"
              className="btn-secondary border-cream/30 text-cream hover:bg-cream/10 hover:border-cream/50 text-base px-8 py-3.5"
            >
              Diagnose from Description
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { value: "15", label: "Disease Classes" },
              { value: "94–95%", label: "Model Accuracy" },
              { value: "3", label: "Crop Types" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-3xl font-bold text-wheat">{stat.value}</p>
                <p className="text-cream/60 text-xs mt-1 font-sans">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA Cards ---- */}
      <section
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10"
        aria-labelledby="cta-heading"
      >
        <h2 id="cta-heading" className="sr-only">
          Diagnosis options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ctaCards.map((card) => (
            <Link
              key={card.id}
              id={card.id}
              href={card.href}
              className="group card hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cream flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-soil mb-1">
                    {card.label}
                  </h3>
                  <p className="text-soil/65 text-sm leading-relaxed font-sans">
                    {card.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-sage group-hover:gap-3 transition-all duration-200 mt-auto pt-2 border-t border-cream-dark">
                <span>Get started</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        aria-labelledby="features-heading"
      >
        <div className="text-center mb-12">
          <p className="section-label mb-2">Technology</p>
          <h2 id="features-heading" className="font-serif text-3xl md:text-4xl font-bold text-soil">
            Powered by Machine Learning
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={f.id} id={f.id} className="card-cream text-center">
              <div className="w-10 h-10 rounded-full bg-soil flex items-center justify-center mx-auto mb-4">
                <span className="font-serif font-bold text-wheat text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-soil mb-2">
                {f.title}
              </h3>
              <p className="text-soil/65 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Audience ---- */}
      <section className="bg-white border-y border-cream-dark py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Who It Serves</p>
            <h2 className="font-serif text-3xl font-bold text-soil">
              Built for the Agricultural Community
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                id: "audience-farmers",
                title: "Farmers",
                desc: "Identify diseases early and apply the correct treatment before yield loss escalates.",
              },
              {
                id: "audience-agronomists",
                title: "Agronomists",
                desc: "Complement field inspections with AI-driven analysis for faster, more confident recommendations.",
              },
              {
                id: "audience-researchers",
                title: "Researchers",
                desc: "Explore model behaviour across PlantVillage classes and benchmark against new datasets.",
              },
            ].map((item) => (
              <div key={item.id} id={item.id}>
                <div className="w-12 h-1 bg-wheat rounded-full mx-auto mb-4" aria-hidden="true" />
                <h3 className="font-serif text-lg font-semibold text-soil mb-2">{item.title}</h3>
                <p className="text-soil/65 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Credits ---- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="section-label mb-4">Credits</p>
        <h2 className="font-serif text-2xl font-bold text-soil mb-3">Group Seven</h2>
        <p className="text-soil/65 text-sm max-w-lg mx-auto leading-relaxed">
          Developed by Diana Mayalo, Anthony Nganga Chege, and Group Seven collaborators as part of a data science capstone project.
          Migrated to production by Anthony Nganga Chege.
        </p>
      </section>
    </>
  );
}
