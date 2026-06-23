import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { Request } from "express";

type WebhookRequest = Request & {
  rawBody?: Buffer | string;
  headers: Record<string, string | string[] | undefined>;
};

@Injectable()
export class WebhookSignatureService {
  private readonly webhookSecret = process.env.WEBHOOK_SECRET ?? "";

  verify(request: WebhookRequest): void {
    const signatureHeader = request.headers["x-webhook-signature"];
    const signature = Array.isArray(signatureHeader)
      ? signatureHeader[0]
      : signatureHeader;

    if (!signature) {
      throw new UnauthorizedException("Missing webhook signature");
    }

    if (!this.webhookSecret) {
      throw new UnauthorizedException("Webhook secret is not configured");
    }

    const rawBody = request.rawBody ?? JSON.stringify(request.body ?? {});
    const bodyBuffer =
      typeof rawBody === "string" ? Buffer.from(rawBody) : Buffer.from(rawBody);
    const expected = createHmac("sha256", this.webhookSecret).update(bodyBuffer).digest("hex");

    if (signature.length !== expected.length) {
      throw new UnauthorizedException("Invalid webhook signature");
    }

    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      throw new UnauthorizedException("Invalid webhook signature");
    }
  }
}
