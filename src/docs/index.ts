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
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    // eslint-disable-next-line global-require
    ...require('./auth').default,
  },
};
