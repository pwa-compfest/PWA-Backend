import { createRequire } from "module";

export const swaggerDocument = {
    openapi: '3.0.1',
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
      ...require('./user/').default,
    },
};