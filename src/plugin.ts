/* eslint-disable @typescript-eslint/require-await */
import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import * as color from "kolorist";
import type pino from "pino";

export type FastifyRequestLoggerOptions = {
  logBody?: boolean;
  logResponseTime?: boolean;
  logBindings?: Record<string, unknown>;
  ignoredPaths?: (string | RegExp)[];
  ignoredBindings?: Record<string, unknown>;
  ignore?: (request: FastifyRequest) => boolean;
  supportsArt?: boolean;
};

const IS_WINDOWS = process.platform === "win32";
const IS_POWERSHELL = IS_WINDOWS && Boolean(process.env["PSModulePath"] ?? process.env["PSHOME"]);

export const plugin: FastifyPluginAsync<FastifyRequestLoggerOptions> = async (
  fastify,
  options = {},
): Promise<void> => {
  const {
    logBody = true,
    logResponseTime = true,
    logBindings = { plugin: "fastify-request-logger" },
    ignoredPaths = [],
    ignore,
    ignoredBindings,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    supportsArt = !IS_POWERSHELL && color.options.supportLevel >= 2 /* SupportLevel.ansi256 */,
  } = options;

  const icons = { req: supportsArt ? "←" : "<", res: supportsArt ? "→" : ">" };

  const isIgnoredRequest = (request: FastifyRequest): boolean => {
    const { url } = request.routeOptions;
    const isIgnoredPath = ignoredPaths.some((ignoredPath) => {
      if (typeof ignoredPath === "string") {
        return ignoredPath === url;
      } else if (ignoredPath instanceof RegExp) {
        return ignoredPath.test(url ?? "");
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
        request.url,
      )} request from ip ${color.blue(request.ip)}${
        contentLength ? ` with a ${color.yellow(contentLength)}-length body` : ""
      }`,
    );
    request.log.trace({ ...logBindings, req: request }, `Request trace`);
  });

  fastify.addHook("preHandler", async (request) => {
    if (isIgnoredRequest(request)) {
      return;
    }
    const isJson = request.headers["content-type"]?.includes("application/json");
    if (request.body && logBody) {
      if (Buffer.isBuffer(request.body)) {
        request.log.debug({ ...logBindings, body: `<Buffer ${request.body.length} bytes>` }, `Request body`);
      } else if (isJson) {
        request.log.debug({ ...logBindings, body: request.body }, `Request body`);
      }
    }
  });

  fastify.addHook("onResponse", async (request, reply) => {
    if (isIgnoredRequest(request)) {
      return;
    }
    const message = `${color.bold(color.yellow(icons.res))}${color.yellow(request.method)}:${color.green(
      request.url,
    )} response with a ${color.magenta(reply.statusCode)}-status${
      logResponseTime ? ` took ${color.magenta(reply.elapsedTime.toFixed(3))}ms` : ""
    }`;
    if (reply.statusCode && reply.statusCode >= 500) {
      request.log.error(logBindings, message);
    } else if (reply.statusCode && reply.statusCode >= 400) {
      request.log.warn(logBindings, message);
    } else {
      request.log.info(logBindings, message);
    }
  });

  fastify.addHook("onError", async (request, reply, error) => {
    if (isIgnoredRequest(request)) {
      return;
    }

    if (error.statusCode && error.statusCode >= 500) {
      request.log.error({ ...logBindings, req: request, res: reply, err: error }, error?.message);
    } else if (reply.statusCode && reply.statusCode >= 400) {
      request.log.warn({ ...logBindings, res: reply, err: error }, error?.message);
    } else {
      request.log.info({ ...logBindings, res: reply, err: error }, error?.message);
    }
  });
};
