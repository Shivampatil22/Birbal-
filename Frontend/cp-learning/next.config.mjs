/** @type {import('next').NextConfig} */
const nextConfig = {
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
