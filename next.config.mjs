/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
        {
            protocol: "https",
            hostname: "example.com", // Replace with your domain
            pathname: "/**",        // Allow all paths under this domain
        },
        {
            protocol: "https",
            hostname: "anotherdomain.com", // Add more domains if needed
            pathname: "/**",
        },
        ],
        domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;
