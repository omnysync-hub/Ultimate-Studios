import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/cms/store";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/studio/", "/draft/", "/preview/"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}

