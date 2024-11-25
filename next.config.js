
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
require('dotenv').config()

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    trailingSlash: false,
    reactStrictMode: false,
    webpack: (config, { isServer }) => {
        if (isServer) {
            require('./scripts/sitemap-generator')
        }
        config.resolve.alias = {
            ...config.resolve.alias,
            apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
        }
        return config
    }
}

module.exports = nextConfig

