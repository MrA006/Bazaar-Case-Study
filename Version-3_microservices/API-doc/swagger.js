import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bazaar Inventory API',
      version: '1.0.0',
      description: 'API documentation for the Bazaar Inventory authentication system',
    },
    servers: [{ url: `http://localhost:${process.env.SWAGGER_PORT}` }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
