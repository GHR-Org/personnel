/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [new URL(`${process.env.NEXT_PUBLIC_IMAGE_URL}`).hostname,  "192.168.1.139", "127.0.0.1", "ghr-backend.onrender.com"],
  },
}

module.exports = nextConfig
