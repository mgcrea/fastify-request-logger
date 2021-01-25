# FastifyRequestLogger

[![npm version](https://img.shields.io/npm/v/@mgcrea/fastify-request-logger.svg)](https://github.com/mgcrea/fastify-request-logger/releases)
[![license](https://img.shields.io/npm/l/@mgcrea/fastify-request-logger)](https://tldrlegal.com/license/mit-license)
[![build status](https://img.shields.io/github/workflow/status/mgcrea/fastify-request-logger/ci)](https://github.com/mgcrea/fastify-request-logger/actions)
[![dependencies status](https://img.shields.io/david/mgcrea/fastify-request-logger)](https://david-dm.org/mgcrea/fastify-request-logger)
[![devDependencies status](https://img.shields.io/david/dev/mgcrea/fastify-request-logger)](https://david-dm.org/mgcrea/fastify-request-logger?type=dev)

Compact request logger plugin for [fastify](https://github.com/fastify/fastify).

- Relies on [chalk](https://github.com/chalk/chalk) for the coloring.

- Usually used along [@mgcrea/pino-pretty-compact](https://github.com/mgcrea/pino-pretty-compact) to prettify logs.

- Built with [TypeScript](https://www.typescriptlang.org/) for static type checking with exported types along the
  library.

## Preview

<p align="left">
  <img src="https://raw.githubusercontent.com/mgcrea/fastify-request-logger/master/docs/preview.png" alt="Preview" />
</p>

## Usage

```bash
npm install fastify-cookie @mgcrea/fastify-request-logger --save
# or
yarn add fastify-cookie @mgcrea/fastify-request-logger
```

You probably want to disable fastify own request logging using the `disableRequestLogging` option.

```ts
import createFastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import fastifyRequestLogger from '@mgcrea/fastify-request-logger';

export const buildFastify = (options: FastifyServerOptions = {}): FastifyInstance => {
  const fastify = createFastify({ disableRequestLogging: true, ...options });

  fastify.register(fastifyRequestLogger);

  return fastify;
};
```

## Authors

- [Olivier Louvignes](https://github.com/mgcrea) <<olivier@mgcrea.io>>

## License

```
The MIT License

Copyright (c) 2020 Olivier Louvignes <olivier@mgcrea.io>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
