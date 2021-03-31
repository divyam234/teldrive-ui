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
    reactStrictMode: false,
    output: 'standalone',
    async redirects() {
      return [
        {
          source: '/',
          destination: '/my-drive',
          permanent: true,
        },
      ]
    }
  })
);
