import NextBundleAnalyzer from "@next/bundle-analyzer";
import nextPWA from "next-pwa";

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  swSrc: "service-worker.js",
  disable: process.env.NODE_ENV === "development",
});

export default withPWA(
  withBundleAnalyzer({
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      });

      return config;
    },
    output: 'standalone',
    reactStrictMode: true,
    experimental: {
      runtime: 'edge',
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/my-drive',
          permanent: true,
        },
      ]
    },
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://teldrive.bhunter.in/api/:path*',
        },
      ]
    }
  })
);
