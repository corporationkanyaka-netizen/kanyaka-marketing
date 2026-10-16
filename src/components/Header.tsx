"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { companyInfo } from "@/data/company";
import Logo from "./Logo";
import { Phone, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

interface HeaderProps {
  onOpenQuote?: (productName?: string) => void;
}

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Industries", href: "/industries" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header({ onOpenQuote }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const tel = `tel:${companyInfo.contacts.phonePrimary.replace(/[^0-9+]/g, "")}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openQuote = () => (onOpenQuote ? onOpenQuote() : router.push("/contact"));
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Authorization strip */}
      <div className="bg-ink-950 text-slate-300">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-glow" />
            <span className="truncate">
              <span className="text-white">Authorised dealer</span>
              <span className="hidden sm:inline"> · Grasim Industries Ltd. &amp; Aditya Birla Chemicals</span>
            </span>
          </div>
          <a href={tel} className="hidden shrink-0 items-center gap-1.5 font-mono text-slate-200 transition-colors hover:text-white sm:flex">
            <Phone className="h-3 w-3 text-brand-400" />
            {companyInfo.contacts.phonePrimary}
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`border-b backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "border-line bg-paper/85 shadow-[0_8px_30px_-12px_rgba(11,22,38,0.18)]" : "border-transparent bg-paper/70"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center" aria-label="Kanyaka Corporation home">
            <Logo size="md" variant="light-bg" showTagline={false} />
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-white/70 p-1 ring-1 ring-line lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive(link.href) ? "bg-ink-900 text-white" : "text-slate-600 hover:bg-paper-2 hover:text-ink-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <button
              onClick={openQuote}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-600 py-2.5 pl-5 pr-4 text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(2,132,199,0.7)] transition-all hover:bg-brand-700"
            >
              Get a quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={openQuote}
              className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white sm:hidden"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-10 w-10 place-items-center rounded-full text-ink-900 ring-1 ring-line"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-line bg-paper px-4 pb-6 pt-3 lg:hidden">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between border-b border-line py-4 font-display text-2xl ${
                    isActive(link.href) ? "text-brand-700" : "text-ink-900"
                  }`}
                >
                  {link.name}
                  <ArrowRight className="h-5 w-5 opacity-40" />
                </Link>
              ))}
            </nav>
            <div className="mt-5 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openQuote();
                }}
                className="w-full rounded-full bg-ink-900 py-3.5 text-sm font-medium text-white"
              >
                Request a chemical quote
              </button>
              <a href={tel} className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-medium text-ink-900 ring-1 ring-line">
                <Phone className="h-4 w-4 text-brand-600" />
                {companyInfo.contacts.phonePrimary}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
