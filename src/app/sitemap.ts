import type { MetadataRoute } from "next";
import { sitemapPages, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPages.map((route) => ({
    url: `${siteConfig.url}${route.href}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
