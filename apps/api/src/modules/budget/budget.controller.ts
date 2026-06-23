import { Controller, Get, Post, Body, Param, Query, UseGuards } from "@nestjs/common";
import { OwnerKeyGuard } from "../../auth/owner-key.guard.js";
import { BudgetService } from "./budget.service.js";
import {
  type BudgetMetrics,
  type GetBudgetMetricsQuery,
  type SetOrganizationBudgetPayload,
  type ReservePointsPayload,
  type ReleaseReservationPayload,
  type ReconcileBudgetPayload,
} from "@devconsole/api-contracts";

@Controller("budget")
@UseGuards(OwnerKeyGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get("metrics")
  async getBudgetMetrics(@Query() query: GetBudgetMetricsQuery): Promise<BudgetMetrics> {
    return this.budgetService.getBudgetMetrics(query);
  }

  @Post("organizations/:organizationId/cap")
  async setOrganizationBudget(
    @Param("organizationId") organizationId: string,
    @Body() payload: SetOrganizationBudgetPayload
  ) {
    if (payload.organizationId !== organizationId) {
      throw new Error("organizationId in path and payload must match");
    }
    return this.budgetService.setOrganizationBudget(payload);
  }

  @Post("reservations")
  async reservePoints(@Body() payload: ReservePointsPayload) {
    return this.budgetService.reservePoints(payload);
  }

  @Post("reservations/:reservationId/release")
  async releaseReservation(
    @Param("reservationId") reservationId: string
  ) {
    return this.budgetService.releaseReservation({ reservationId });
  }

  @Post("reconcile")
  async reconcileBudget(@Body() payload: ReconcileBudgetPayload) {
    return this.budgetService.reconcileBudget(payload);
  }
}
