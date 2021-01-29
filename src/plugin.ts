import chalk from 'chalk';
import type { FastifyPluginAsync } from 'fastify';

export type FastifyRequestLoggerOptions = {
  logBody?: boolean;
  logBindings?: Record<string, unknown>;
};

export const plugin: FastifyPluginAsync<FastifyRequestLoggerOptions> = async (fastify, options = {}): Promise<void> => {
  const { logBody = true, logBindings = { plugin: 'fastify-request-logger' } } = options;

  fastify.addHook('onRequest', async (request) => {
    const contentLength = request.headers['content-length'];
    request.log.info(
      logBindings,
      `${chalk.bold.yellow('←')}${chalk.yellow(request.method)}:${chalk.green(
        request.url
      )} request from ip ${chalk.blue(request.ip)}${
        contentLength ? ` with a ${chalk.yellow(contentLength)}-length body` : ''
      }`
    );
    request.log.trace({ ...logBindings, req: request }, `Request trace`);
  });

  fastify.addHook('preHandler', async (request) => {
    if (request.body && logBody) {
      request.log.debug({ ...logBindings, body: request.body }, `Request body`);
    }
  });

  fastify.addHook('onResponse', async (request, reply) => {
    request.log.info(
      logBindings,
      `${chalk.bold.yellow('→')}${chalk.yellow(request.method)}:${chalk.green(
        request.url
      )} response with a ${chalk.magenta(reply.statusCode)}-status`
    );
  });
};
