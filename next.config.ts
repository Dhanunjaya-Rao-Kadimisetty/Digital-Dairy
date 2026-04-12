import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL(".", import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: appRoot,
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co"
      },
      {
        // Allow ngrok tunnels for local sharing
        protocol: "https",
        hostname: "**.ngrok-free.app"
      },
      {
        protocol: "https",
        hostname: "**.ngrok.io"
      }
    ]
  },
  // Allow ngrok tunnel host as a valid host
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "ngrok-skip-browser-warning",
            value: "true"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
