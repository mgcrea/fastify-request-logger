import createFastify, { FastifyInstance, FastifyLoggerOptions, FastifyServerOptions } from 'fastify';
import fastifyRequestLogger, { FastifyRequestLoggerOptions } from 'src/index';

type BuilfFastifyOptions = FastifyServerOptions & { requestLogger?: FastifyRequestLoggerOptions };

const logger: FastifyLoggerOptions = {
  level: 'debug',
  prettyPrint: {
    colorize: true,
    ignore: 'pid,hostname',
    translateTime: 'yyyy-mm-dd HH:MM:ss.l',
    levelFirst: true,
  },
};

export const buildFastify = (options: BuilfFastifyOptions = {}): FastifyInstance => {
  const { requestLogger: requestLoggerOptions, ...fastifyOptions } = options;
  const fastify = createFastify({ logger, disableRequestLogging: true, ...fastifyOptions });

  fastify.register(fastifyRequestLogger, requestLoggerOptions);

  fastify.get('/', (request, reply) => {
    reply.send({ hello: 'world', method: request.method });
  });

  fastify.post('/', (request, reply) => {
    reply.send({ hello: 'world', method: request.method });
  });

  return fastify;
};
