/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    webpack: (config) => {
        config.resolve.fallback = {
          fs: false,
          child_process: false,
          net: false,
          tls: false,
        };
    
        return config;
      }
}

module.exports = nextConfig