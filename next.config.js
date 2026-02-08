/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable server-side features for API routes
    experimental: {
        serverComponentsExternalPackages: ['mongoose']
    },
    // Disable strict mode for mongoose compatibility
    reactStrictMode: false,
};

module.exports = nextConfig;
