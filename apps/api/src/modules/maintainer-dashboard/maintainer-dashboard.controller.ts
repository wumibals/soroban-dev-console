import { Controller, Get, UseGuards } from "@nestjs/common";
import { OwnerKeyGuard } from "../../auth/owner-key.guard.js";
import { MaintainerDashboardService } from "./maintainer-dashboard.service.js";

@Controller("maintainer-dashboard")
@UseGuards(OwnerKeyGuard)
export class MaintainerDashboardController {
  constructor(private readonly service: MaintainerDashboardService) {}

  /** GET /maintainer-dashboard — full dashboard summary */
  @Get()
  getSummary() {
    return this.service.getSummary();
  }

  /** GET /maintainer-dashboard/triage-queue */
  @Get("triage-queue")
  getTriageQueue() {
    return this.service.getTriageQueue();
  }

  /** GET /maintainer-dashboard/appeals */
  @Get("appeals")
  getAppealList() {
    return this.service.getAppealList();
  }

  /** GET /maintainer-dashboard/verification-bottlenecks */
  @Get("verification-bottlenecks")
  getVerificationBottlenecks() {
    return this.service.getVerificationBottlenecks();
  }

  /** GET /maintainer-dashboard/budget */
  @Get("budget")
  getBudgetView() {
    return this.service.getBudgetView();
  }
}
