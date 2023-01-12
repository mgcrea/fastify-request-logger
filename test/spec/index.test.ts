import { describe, expect, test } from "vitest";

describe("module", () => {
  test("src exports", async () => {
    const module = await import("../../src");
    expect(Object.keys(module)).toMatchInlineSnapshot(`
      [
        "FastifyRequestLoggerOptions",
        "default",
      ]
    `);
  });
  test("dist exports", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const module = await import("../../dist");
    expect(Object.keys(module)).toMatchInlineSnapshot(`
      [
        "default",
      ]
    `);
  });
});
