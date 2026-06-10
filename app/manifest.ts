import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ForgeMancer Project Manager",
    short_name: "ForgeMancer",
    description: "AI-Powered Project Management & Workspace Organizer for Freelancers.",
    start_url: "/",
    display: "standalone",
    background_color: "#03020a",
    theme_color: "#7c3aed",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  }
}
