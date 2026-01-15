import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
        remotePatterns: [
            // {
            //     protocol: 'https',
            //     hostname: 'giukqbonzinrabejotuk.supabase.co',
            //     port: '',
            //     pathname: '/**',
            //     search: '',
            // },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            }
        ],
        qualities: [85 ,90, 95],
    },
    async rewrites() {
        return [
            // {
            //     source: '/api/:path*',
            //     destination: 'http://localhost:5001/api/:path*',
            // },
      
            {
                source: '/api/:path*',
                destination: 'https://api.tonmame.store/api/:path*',
            },

        ]
    },
};

export default nextConfig;
