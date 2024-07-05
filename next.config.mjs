/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true
    images: {
        remotePatterns: [
            {
                hostname: "placekitten.com"
            }
        ]
    }
};

export default nextConfig;
