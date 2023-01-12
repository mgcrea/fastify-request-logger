import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import * as color from "kolorist";
import type pino from "pino";

export type FastifyRequestLoggerOptions = {
  logBody?: boolean;
  logResponseTime?: boolean;
  logBindings?: Record<string, unknown>;
  ignoredPaths?: Array<string | RegExp>;
  ignoredBindings?: Record<string, unknown>;
  ignore?: (request: FastifyRequest) => boolean;
};

export const plugin: FastifyPluginAsync<FastifyRequestLoggerOptions> = async (
  fastify,
  options = {}
): Promise<void> => {
  const supportsArt = color.options.supportLevel === 2; /* SupportLevel.ansi256 */
  const icons = { req: supportsArt ? "←" : "<", res: supportsArt ? "→" : ">" };

  const {
    logBody = true,
    logResponseTime = true,
    logBindings = { plugin: "fastify-request-logger" },
    ignoredPaths = [],
    ignore,
    ignoredBindings,
  } = options;

  const isIgnoredRequest = (request: FastifyRequest): boolean => {
    const { routerPath } = request;
    const isIgnoredPath = ignoredPaths.some((ignoredPath) => {
      if (typeof ignoredPath === "string") {
        return ignoredPath === routerPath;
      } else if (ignoredPath instanceof RegExp) {
        return ignoredPath.test(routerPath);
      }
      return false;
    });
    if (isIgnoredPath) {
      return true;
    }
    return ignore ? ignore(request) : false;
  };

  fastify.addHook("onRequest", async (request) => {
    if (isIgnoredRequest(request)) {
      if (ignoredBindings) {
        (request.log as pino.Logger).setBindings(ignoredBindings);
      }
      return;
    }
    const contentLength = request.headers["content-length"];
    request.log.info(
      logBindings,
      `${color.bold(color.yellow(icons.req))}${color.yellow(request.method)}:${color.green(
        request.url
      )} request from ip ${color.blue(request.ip)}${
        contentLength ? ` with a ${color.yellow(contentLength)}-length body` : ""
      }`
    );
    request.log.trace({ ...logBindings, req: request }, `Request trace`);
  });

  fastify.addHook("preHandler", async (request) => {
    if (isIgnoredRequest(request)) {
      return;
    }
    if (request.body && logBody) {
      request.log.debug({ ...logBindings, body: request.body }, `Request body`);
    }
  });

  fastify.addHook("onResponse", async (request, reply) => {
    if (isIgnoredRequest(request)) {
      return;
    }
    request.log.info(
      logBindings,
      `${color.bold(color.yellow(icons.res))}${color.yellow(request.method)}:${color.green(
        request.url
      )} response with a ${color.magenta(reply.statusCode)}-status${
        logResponseTime ? ` took ${color.magenta(reply.getResponseTime().toFixed(3))}ms` : ""
      }`
    );
  });
};
