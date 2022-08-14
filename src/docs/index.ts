export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Rest API',
    description: 'API Documentation.',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'PWA_LMS_AT',
      },
    },
  },
  paths: {
    // eslint-disable-next-line global-require
    ...require('./auth').default,
  },
};
