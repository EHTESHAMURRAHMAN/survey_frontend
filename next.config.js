const path = require('path');

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Turbopack silence (Railway webpack use karega anyway)
    turbopack: {},

    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${API_BASE}/api/:path*`,
            },
        ];
    },

    // Webpack alias: Always apply (server/client dono pe)
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, 'src'),
        };
        return config;
    },
};

module.exports = nextConfig;