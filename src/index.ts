import fastifyPlugin from 'fastify-plugin';
import { plugin } from './plugin';

export { FastifyRequestLoggerOptions } from './plugin';

export default fastifyPlugin(plugin, {
  fastify: '3.x',
  name: 'fastify-request-logger',
});
