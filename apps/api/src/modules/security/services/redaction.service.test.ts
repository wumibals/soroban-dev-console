import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { redactJsonValue, redactText } from "./redaction.service.js";

describe("redaction service", () => {
  it("redacts emails, tokens, ips, and long hex secrets from text", () => {
    const input =
      "user alice@example.com from 10.0.0.8 used eyJabc.def.ghi and deadbeef".repeat(1);

    const output = redactText(input);

    assert.match(output, /\[REDACTED_EMAIL\]/);
    assert.match(output, /\[REDACTED_TOKEN\]/);
    assert.match(output, /\[REDACTED_IP\]/);
    assert.match(
      redactText("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"),
      /\[REDACTED_SECRET\]/,
    );
  });

  it("redacts nested strings in JSON-like values", () => {
    const value = {
      summary: "contact alice@example.com",
      nested: ["192.168.1.20", { token: "eyJabc.def.ghi" }],
    };

    assert.deepEqual(redactJsonValue(value), {
      summary: "contact [REDACTED_EMAIL]",
      nested: ["[REDACTED_IP]", { token: "[REDACTED_TOKEN]" }],
    });
  });
});
