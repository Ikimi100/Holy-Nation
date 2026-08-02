import { imageHosts } from './image-hosts.config.mjs';

/**
 * The ministry pages are static HTML living in public/. These rewrites let them
 * be reached at clean URLs (/apostolic-house rather than /apostolic-house.html).
 *
 * NOTE: these are "afterFiles" rewrites, so they run *after* filesystem routes.
 * Any matching route added under app/ would therefore shadow the static page
 * of the same name — worth remembering before creating a route here.
 */
const staticPages = [
  'about',
  'apostolic-house',
  'compassion',
  'connect',
  'country-development',
  'give',
  'global-college',
  'holy-nation',
  'holy-nation-australia',
  'holy-nation-canada',
  'holy-nation-congo',
  'holy-nation-ghana',
  'holy-nation-kenya',
  'holy-nation-philippines',
  'holy-nation-rwanda',
  'holy-nation-south-africa',
  'holy-nation-uganda',
  'holy-nation-uk',
  'holy-nation-us',
  'holy-nation-zambia',
  'kingdom-operations',
  'networks',
  'prayers-mission',
  'thykingdomcome',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return staticPages.map((slug) => ({
      source: `/${slug}`,
      destination: `/${slug}.html`,
    }));
  },
  productionBrowserSourceMaps: true,
  distDir: process.env.DIST_DIR || '.next',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: imageHosts,
    minimumCacheTTL: 60,
    qualities: [75, 85, 100],
  },
  webpack(
    config,
    {
      dev: dev
    }
  ) {
    config.module.rules.push({
      test: /\.(jsx|tsx)$/,
      exclude: [/node_modules/],
      use: [{
        loader: '@dhiwise/component-tagger/nextLoader',
      }],
    });
    if (dev) {
      const ignoredPaths = (process.env.WATCH_IGNORED_PATHS || '')
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      config.watchOptions = {
        ignored: ignoredPaths.length
          ? ignoredPaths.map((p) => `**/${p.replace(/^\/+|\/+$/g, '')}/**`)
          : undefined,
      };
    }
    return config;
  },
};
export default nextConfig;