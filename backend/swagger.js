const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Flashcard App',
    version: '1.0.0',
    description: 'Backend routes for flashcard app documentation',
  },
  servers: [
    {
      url: 'http://localhost:5000',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerDocument = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerDocument,
};
