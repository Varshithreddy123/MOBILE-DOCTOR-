module.exports = ({ env }) => ({
  settings: {
    cors: {
      enabled: true,
      origin: env('CORS_ORIGINS', ['https://yourdomain.com', 'https://anotherdomain.com']), // Replace with allowed domains
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      headers: ['Content-Type', 'Authorization'],
      credentials: true, // Allow cookies & auth headers
    },
    security: {
      enabled: true,
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'", 'https:'],
          'connect-src': ["'self'", 'https://res.cloudinary.com', 'https://api.yourbackend.com'], // API & Cloudinary access
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'res.cloudinary.com', // Allow Cloudinary images
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'res.cloudinary.com', // Allow Cloudinary videos & other media
          ],
          'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://trusted-scripts.com'], // Reduce `unsafe-inline` if possible
          'frame-src': ["'self'", 'https://trusted-iframe.com'], // Only allow trusted iframes
          'font-src': ["'self'", 'https://fonts.gstatic.com'], // Allow external fonts
          'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], // Allow inline styles + Google Fonts
        },
      },
    },
  },
  middlewares: [
    'strapi::logger',
    'strapi::errors',
    'strapi::cors', // CORS should come early
    'strapi::security', // Ensure security settings are enforced
    'strapi::poweredBy',
    'strapi::query',
    'strapi::session', // Session should be before body parsing
    'strapi::body',
    'strapi::favicon',
    'strapi::public',
  ],
});
