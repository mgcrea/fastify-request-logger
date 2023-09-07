import { fsyncSync } from "node:fs";
import { buildFastify } from "test/fixtures";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let fastify: ReturnType<typeof buildFastify>;
beforeAll(() => {
  fastify = buildFastify({ requestLogger: { ignoredPaths: ["/healthz"] } });
});
afterAll(() => {
  fastify.close();
  fsyncSync(1);
});

describe("with fastify path", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context = new Map<string, any>([
    ["payload", { foo: "bar" }],
    ["token", "abc"],
  ]);
  it("should properly log a GET request", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/",
      headers: {
        authorization: `Bearer ${context.get("token")}`,
      },
    });
    expect(response.statusCode).toBe(200);
  });
  it("should properly log a POST request", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/",
      payload: context.get("payload"),
    });
    expect(response.statusCode).toBe(200);
  });
  it("should properly ignore a specified request", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/healthz",
      headers: {
        authorization: `Bearer ${context.get("token")}`,
      },
    });
    expect(response.statusCode).toBe(200);
  });
  it("should properly support request with params", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/users/1",
      headers: {
        authorization: `Bearer ${context.get("token")}`,
      },
    });
    expect(response.statusCode).toBe(200);
  });
});
