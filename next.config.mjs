/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["mdx", "tsx", "ts"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.spreadshirtmedia.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
