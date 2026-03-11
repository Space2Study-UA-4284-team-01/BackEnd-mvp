const swaggerJsdoc = require('swagger-jsdoc')

const {
  config: { SERVER_PORT }
} = require('~/configs/config')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SpaceToStudy API',
      version: '1.0.0',
      description: 'API documentation for Space2Study'
    },
    servers: [
      {
        url: `http://localhost:${SERVER_PORT}`
      }
    ]
  },
  apis: ['./src/routes/*.js']
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec
