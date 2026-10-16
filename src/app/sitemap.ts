import { MetadataRoute } from "next";
import { productsData } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kanyakacorporation.com";

  // Static core routes
  const routes = ["", "/products", "/industries", "/about", "/contact"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1.0 : 0.8,
    })
  );

  // Dynamic product routes
  const productRoutes = productsData.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: product.isFeatured ? 0.9 : 0.7,
  }));

  return [...routes, ...productRoutes];
}
