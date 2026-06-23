import { Injectable } from "@nestjs/common";
import { AuditService } from "./audit.service.js";

@Injectable()
export class WebhookAuditService {
  constructor(private readonly audit: AuditService) {}

  async accepted(provider: string, webhookId: string): Promise<void> {
    await this.audit.log({
      actor: `webhook:${provider}`,
      action: "webhook.accepted",
      resourceType: "webhook",
      resourceId: webhookId,
      summary: `Accepted webhook ${webhookId} from ${provider}`,
    });
  }

  async rejected(provider: string, webhookId: string, reason: string): Promise<void> {
    await this.audit.log({
      actor: `webhook:${provider}`,
      action: "webhook.rejected",
      resourceType: "webhook",
      resourceId: webhookId,
      summary: `Rejected webhook ${webhookId} from ${provider}: ${reason}`,
    });
  }
}
