module.exports = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    DEVELOPMENT: process.env.DEVELOPMENT,
    PRODUCTION: process.env.PRODUCTION,
    LOCALHOST: process.env.LOCALHOST,
    CURRENT_STATE: process.env.CURRENT_STATE,
  },
  typescript: {
    ignoreBuildErrors: true, // This line disables strict type checking
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
};
