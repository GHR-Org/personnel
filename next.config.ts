/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [new URL(`${process.env.NEXT_PUBLIC_IMAGE_URL}`).hostname,  "192.168.1.139","192.168.1.141", "127.0.0.1", "ghr-backend.onrender.com"],
  },
  typescript: {
    // 🛑 AJOUTEZ/ASSUREZ-VOUS QUE CECI EST BIEN À TRUE 🛑
    // Avertissement : ceci ignore TOUTES les erreurs de type pendant la construction.
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
