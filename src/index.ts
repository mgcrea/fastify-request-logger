import fastifyPlugin from "fastify-plugin";
import { plugin } from "./plugin";

export { FastifyRequestLoggerOptions } from "./plugin";

export default fastifyPlugin(plugin, {
  fastify: "4.x",
  name: "fastify-request-logger",
});
