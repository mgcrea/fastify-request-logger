import createFastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import fastifyRequestLogger, { FastifyRequestLoggerOptions } from 'src/index';

type BuilfFastifyOptions = FastifyServerOptions & { requestLogger?: FastifyRequestLoggerOptions };

const logger: FastifyServerOptions['logger'] = {
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss.l',
      ignore: 'pid,hostname',
      levelFirst: true,
    },
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

  fastify.get('/healthz', (request, reply) => {
    reply.send({ ok: 1 });
  });

  fastify.get('/users/:user', (request, reply) => {
    reply.send({ ok: 1 });
  });

  return fastify;
};
