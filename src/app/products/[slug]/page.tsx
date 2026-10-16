import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productsData } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return productsData.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = productsData.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found | Kanyaka Corporation",
    };
  }

  const brand = product.manufacturer;
  const dealerNote = product.isGrasimAuthorized
    ? "Authorised Grasim Industries Ltd. dealer."
    : product.manufacturer === "Aditya Birla Chemicals"
      ? "Authorised Aditya Birla Chemicals dealer."
      : `Make: ${product.manufacturer}.`;
  const stockNote = product.fromGodown
    ? "Held in godown stock near Pashamylaram, Telangana."
    : "Supplied against order.";

  return {
    title: `${product.name} Supplier & Dealer Hyderabad | ${brand} - Kanyaka Corporation`,
    description: `${product.name} (${product.grade}) from Kanyaka Corporation, Hyderabad. ${dealerNote} ${stockNote} Enquire for price and availability.`,
    keywords: [
      `${product.name} dealer Hyderabad`,
      `${product.name} supplier Telangana`,
      `${product.name} ${product.manufacturer}`,
      `${product.chemicalFormula} supplier India`,
      ...(product.isGrasimAuthorized ? [`${product.name} Grasim dealer`] : []),
    ],
    openGraph: {
      title: `${product.name} (${product.grade}) | Kanyaka Corporation`,
      description: product.shortDescription,
      url: `https://kanyakacorporation.com/products/${product.slug}`,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = productsData.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Schema.org Product markup
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: "https://kanyakacorporation.com/logo.png",
    description: product.detailedDescription,
    ...(product.manufacturer !== "Godown stock" && {
      brand: {
        "@type": "Brand",
        name: product.manufacturer,
      },
    }),
    sku: `KC-${product.casNumber}`,
    mpn: product.casNumber,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      ...(product.fromGodown && { availability: "https://schema.org/InStock" }),
      seller: {
        "@type": "Organization",
        name: "Kanyaka Corporation",
      },
    },
  };

  const relatedProducts = productsData
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
