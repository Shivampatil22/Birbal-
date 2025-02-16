/** @type {import('next').NextConfig} */
const nextConfig = {
    outputFileTracingIncludes: {
        "api/": ["puppeteer-extra", "puppeteer-extra-plugin-stealth"],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'userpic.codeforces.org',
            },
        ],
    },
};

export default nextConfig;
