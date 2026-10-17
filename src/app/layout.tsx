import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";
import { companyInfo } from "@/data/company";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kanyaka Corporation | Authorised Grasim Industries Dealer, Hyderabad",
  description: "Authorised dealer of Grasim Industries Ltd. in Telangana & Andhra Pradesh. Caustic soda flakes, aluminium chloride, calcium chloride, thionyl chloride, sodium sulphate, acids and 27 chemicals in all — stocked at our 6,000 sq.ft. warehouse near Pashamylaram.",
  keywords: [
    "Caustic soda flakes dealer Hyderabad",
    "Grasim Industries authorised dealer Telangana",
    "Grasim aluminium chloride dealer Hyderabad",
    "Aluminium chloride supplier Hyderabad",
    "Sodium sulphate anhydrous supplier",
    "Calcium chloride granules supplier",
    "Caustic potash flakes supplier Hyderabad",
    "Thionyl chloride supplier Hyderabad",
    "Sodium nitrite supplier Telangana",
    "Sulphuric acid and HCl supplier Hyderabad",
    "Kanyaka Corporation Kukatpally"
  ],
  authors: [{ name: "Kanyaka Corporation" }],
  creator: "Kanyaka Corporation",
  publisher: "Kanyaka Corporation",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    title: "Kanyaka Corporation | Authorised Grasim Industries Dealer",
    description: "Genuine and quality products at reasonable price. Authorised dealer of Grasim Industries Ltd., with a 6,000 sq.ft. warehouse near Pashamylaram.",
    url: "https://kanyakacorporation.com",
    siteName: "Kanyaka Corporation",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org LocalBusiness JSON-LD markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "WholesaleStore"],
    "@id": "https://kanyakacorporation.com/#organization",
    name: "Kanyaka Corporation",
    legalName: "Kanyaka Corporation",
    url: "https://kanyakacorporation.com",
    logo: "https://kanyakacorporation.com/logo.png",
    description: "Authorised dealer of Grasim Industries Ltd. in Telangana & Andhra Pradesh. Caustic soda flakes, aluminium chloride, calcium chloride, thionyl chloride, sodium sulphate, acids and 27 chemicals in all — stocked at our 6,000 sq.ft. warehouse near Pashamylaram.",
    telephone: [companyInfo.contacts.phonePrimary, companyInfo.contacts.phoneSecondary],
    email: [companyInfo.contacts.emailDirector, companyInfo.contacts.emailSales],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "18:00",
      },
    ],
    slogan: companyInfo.motto,
    founder: {
      "@type": "Person",
      name: companyInfo.promoter.name,
      jobTitle: companyInfo.promoter.designation,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${companyInfo.addresses.registeredOffice.line1}, ${companyInfo.addresses.registeredOffice.line2}`,
      addressLocality: "Kukatpally, Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500085",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "17.489306",
      longitude: "78.395556",
    },
    areaServed: [
      { "@type": "State", name: "Telangana" },
      { "@type": "State", name: "Andhra Pradesh" },
    ],
    brand: [
      { "@type": "Brand", name: "Grasim Industries Ltd." },
      { "@type": "Brand", name: "Tata Chemicals" },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-[#0b1626] font-sans">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
