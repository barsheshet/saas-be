import fp from 'fastify-plugin';
import fastifySwagger, { FastifySwaggerOptions } from 'fastify-swagger';

export default fp<FastifySwaggerOptions>(async (fastify) => {
  fastify.register(fastifySwagger, {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Backend SAAS',
        description: 'bla bla',
        version: '0.0.1',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      host: 'localhost:3000',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [{ name: 'Listings', description: 'Listings related end-points' }],
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
    exposeRoute: true,
  });
});
