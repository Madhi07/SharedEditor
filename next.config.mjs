import { withSentryConfig } from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    qualities: [25, 50, 75, 100],
  },
  env: {
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    API_URL: process.env.API_URL,
    WEB_URL: process.env.WEB_URL,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    RAZORPAY_STARTER_PLANID: process.env.RAZORPAY_STARTER_PLANID,
    RAZORPAY_GROWTH_PLANID: process.env.RAZORPAY_GROWTH_PLANID,
    RAZORPAY_PRO_PLANID: process.env.RAZORPAY_PRO_PLANID,
    RAZORPAY_ENTERPRISE_PLANID: process.env.RAZORPAY_ENTERPRISE_PLANID,
    WIDGET_SCRIPT_URL: process.env.WIDGET_SCRIPT_URL,
    WIDGET_AGENT_ID: process.env.WIDGET_AGENT_ID,
    WIDGET_BASE_URL: process.env.WIDGET_BASE_URL,
    BASE_WS_DOMAIN: process.env.BASE_WS_DOMAIN,
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/tngss",
  //       permanent: false,
  //     },
  //   ];
  // }
};


const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "agentzee-ai",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
}


export default process.env.NODE_ENV === "production" ?
  withSentryConfig(nextConfig, sentryWebpackPluginOptions) :
  nextConfig;