"use client";

import React, { useState, createContext, useContext } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";
import QuoteModal from "./QuoteModal";
import BrochureModal from "./BrochureModal";

interface ModalContextType {
  openQuote: (productName?: string) => void;
  openBrochure: () => void;
}

const ModalContext = createContext<ModalContextType>({
  openQuote: () => {},
  openBrochure: () => {},
});

export const useModals = () => useContext(ModalContext);

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);

  const openQuote = (productName?: string) => {
    setSelectedProduct(productName);
    setQuoteOpen(true);
  };

  const openBrochure = () => {
    setBrochureOpen(true);
  };

  return (
    <ModalContext.Provider value={{ openQuote, openBrochure }}>
      <div className="min-h-screen flex flex-col bg-paper text-[#0b1626]">
        <Header onOpenQuote={openQuote} />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <QuoteModal
          isOpen={quoteOpen}
          onClose={() => setQuoteOpen(false)}
          initialProduct={selectedProduct}
        />
        <BrochureModal
          isOpen={brochureOpen}
          onClose={() => setBrochureOpen(false)}
        />
      </div>
    </ModalContext.Provider>
  );
}
