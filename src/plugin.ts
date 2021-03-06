import chalk from 'chalk';
import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import type { Bindings } from 'pino';

export type FastifyRequestLoggerOptions = {
  logBody?: boolean;
  logBindings?: Record<string, unknown>;
  ignoredPaths?: Array<string>;
  ignoredBindings?: Record<string, unknown>;
  ignore?: (request: FastifyRequest) => boolean;
};

export const plugin: FastifyPluginAsync<FastifyRequestLoggerOptions> = async (fastify, options = {}): Promise<void> => {
  const {
    logBody = true,
    logBindings = { plugin: 'fastify-request-logger' },
    ignoredPaths = [],
    ignore,
    ignoredBindings,
  } = options;

  const isIgnoredRequest = (request: FastifyRequest): boolean => {
    const { routerPath } = request;
    if (ignoredPaths.includes(routerPath)) {
      return true;
    }
    return ignore ? ignore(request) : false;
  };

  fastify.addHook('onRequest', async (request) => {
    if (isIgnoredRequest(request)) {
      if (ignoredBindings) {
        request.log.setBindings(ignoredBindings);
      }
      return;
    }
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
    if (isIgnoredRequest(request)) {
      return;
    }
    if (request.body && logBody) {
      request.log.debug({ ...logBindings, body: request.body }, `Request body`);
    }
  });

  fastify.addHook('onResponse', async (request, reply) => {
    if (isIgnoredRequest(request)) {
      return;
    }
    request.log.info(
      logBindings,
      `${chalk.bold.yellow('→')}${chalk.yellow(request.method)}:${chalk.green(
        request.url
      )} response with a ${chalk.magenta(reply.statusCode)}-status`
    );
  });
};

declare module 'fastify' {
  interface FastifyLoggerInstance {
    setBindings(bindings: Bindings): void;
  }
}
