import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/try", "/login", "/signup"],
      disallow: [
        "/dashboard",
        "/dashboard/",
        "/onboarding",
        "/forgot-password",
        "/reset-password",
        "/api/",
        "/auth/",
      ],
    },
    sitemap: "https://forgemancer.vercel.app/sitemap.xml",
  }
}
