/** @type {import('next').NextConfig} */

// getConfig().publicRuntimeConfig utiliser ca à la palce de process.env pour la variable procahine 
//

const NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE = process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE
//utiliser next conifg pour autoriser les images de ghost

const imagesDomains = ['static.data.gouv.fr']
if (NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE) {
  imagesDomains.push(NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE)
}

const nextConfig = {
  images: {
    remotePatterns: imagesDomains.map(domain => ({
      protocol: 'https',
      hostname: domain,
      port: '',
      pathname: '/**',
    })),
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.woff2$/,
      type: 'asset/resource',
    })
    return config
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
}

export default nextConfig
