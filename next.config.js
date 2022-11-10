/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    fontLoaders: [
      { loader: "@next/font/google", options: { subsets: ["latin"] } },
    ],
  },
  env: {
    APP_NAME: `${process.env.APP_NAME}`,
    URL_HOST: `${process.env.API_HOST}`,
    API_HOST: `${process.env.API_HOST}/api/v1`,
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

module.exports = nextConfig;
