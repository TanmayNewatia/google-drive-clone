/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: "/api/:path*",
          destination:
            "https://google-drive-clone-cz0l.onrender.com/api/:path*",
        },
      ];
    }
    return [];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
