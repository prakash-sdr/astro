import swaggerJsdoc from 'swagger-jsdoc';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products Server',
      version: '1.0.0',
      description: 'API documentation for the Products service',
    },
    paths: {}
  },
  apis: ['src/docs/**/*.yaml'],
});

export default swaggerSpec;

