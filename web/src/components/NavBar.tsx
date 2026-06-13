"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/image-diagnosis", label: "Image Diagnosis" },
  { href: "/text-diagnosis", label: "Text Diagnosis" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#121610]/95 backdrop-blur-md border-b border-cream-dark shadow-warm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="LeafSense home"
          >
            {/* Leaf icon — SVG, no emoji */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            >
              <path
                d="M4 24C4 24 6 12 14 8C22 4 24 4 24 4C24 4 24 6 20 14C16 22 4 24 4 24Z"
                fill="#6b7c3f"
                opacity="0.9"
              />
              <path
                d="M4 24C8 18 12 14 20 10"
                stroke="#3d2b1f"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-serif font-bold text-xl text-soil tracking-tight">
              Leaf<span className="text-sage">Sense</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-sage/10 text-sage font-semibold"
                      : "text-soil/70 hover:text-soil hover:bg-cream-dark"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/image-diagnosis"
              className="ml-3 btn-primary text-xs py-2 px-4"
              id="nav-cta-diagnose"
            >
              Diagnose Now
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            id="nav-mobile-menu-btn"
            className="md:hidden p-2 rounded-lg text-soil hover:bg-cream transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <nav
          className="md:hidden border-t border-cream-dark bg-[#121610] px-4 pb-4 pt-2 animate-fade-in"
          aria-label="Mobile navigation"
        >
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium my-0.5 transition-all ${
                  active
                    ? "bg-sage/10 text-sage font-semibold"
                    : "text-soil/70 hover:text-soil hover:bg-cream-dark"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/image-diagnosis"
            onClick={() => setMenuOpen(false)}
            className="btn-primary w-full mt-3 text-sm"
          >
            Diagnose Now
          </Link>
        </nav>
      )}
    </header>
  );
}
