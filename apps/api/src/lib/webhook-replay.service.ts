import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";

type WebhookReplayRequest = Request & {
  headers: Record<string, string | string[] | undefined>;
};

@Injectable()
export class WebhookReplayService {
  private readonly seenIds = new Set<string>();

  verify(request: WebhookReplayRequest): void {
    const webhookIdHeader = request.headers["x-webhook-id"] ?? request.headers["x-event-id"];
    const webhookId = Array.isArray(webhookIdHeader) ? webhookIdHeader[0] : webhookIdHeader;

    if (!webhookId) {
      throw new UnauthorizedException("Missing webhook replay identifier");
    }

    if (this.seenIds.has(webhookId)) {
      throw new UnauthorizedException("Replay detected for webhook event");
    }

    this.seenIds.add(webhookId);
  }
}
