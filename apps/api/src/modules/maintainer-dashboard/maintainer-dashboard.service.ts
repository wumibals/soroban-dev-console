import { Injectable } from "@nestjs/common";
import { IsOptional, IsString } from "class-validator";
import { PrismaService } from "../../lib/prisma.service.js";

export class DashboardQueryDto {
  @IsOptional()
  @IsString()
  network?: string;
}

@Injectable()
export class MaintainerDashboardService {
  constructor(private readonly prisma: PrismaService) {}
  private summaryCache: { refreshedAt: string; data: unknown } | null = null;

  /** Triage queue: open/in_progress tickets grouped by category and priority. */
  async getTriageQueue() {
    const tickets = await this.prisma.supportTicket.findMany({
      where: { status: { in: ["open", "in_progress"] } },
      select: {
        id: true,
        subject: true,
        category: true,
        priority: true,
        status: true,
        reporterKey: true,
        assigneeKey: true,
        createdAt: true,
      },
      orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    });

    const byCategory = tickets.reduce<Record<string, typeof tickets>>(
      (acc, t) => {
        (acc[t.category] ??= []).push(t);
        return acc;
      },
      {},
    );

    return { total: tickets.length, byCategory };
  }

  /** Appeal list: tickets with category=appeal, any status. */
  async getAppealList() {
    const tickets = await this.prisma.supportTicket.findMany({
      where: { category: "appeal" },
      select: {
        id: true,
        subject: true,
        status: true,
        priority: true,
        reporterKey: true,
        assigneeKey: true,
        createdAt: true,
        resolvedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { total: tickets.length, tickets };
  }

  /** Verification bottlenecks: open verification tickets older than 48 h. */
  async getVerificationBottlenecks() {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const tickets = await this.prisma.supportTicket.findMany({
      where: {
        category: "verification",
        status: { in: ["open", "in_progress"] },
        createdAt: { lt: cutoff },
      },
      select: {
        id: true,
        subject: true,
        status: true,
        priority: true,
        reporterKey: true,
        assigneeKey: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return { total: tickets.length, tickets };
  }

  /** Budget view: counts of tickets by status for capacity planning. */
  async getBudgetView() {
    const [open, inProgress, resolved, closed] = await Promise.all([
      this.prisma.supportTicket.count({ where: { status: "open" } }),
      this.prisma.supportTicket.count({ where: { status: "in_progress" } }),
      this.prisma.supportTicket.count({ where: { status: "resolved" } }),
      this.prisma.supportTicket.count({ where: { status: "closed" } }),
    ]);

    const byCategory = await this.prisma.supportTicket.groupBy({
      by: ["category"],
      _count: { id: true },
    });

    return {
      statusCounts: { open, inProgress, resolved, closed },
      byCategory: byCategory.map((r) => ({ category: r.category, count: r._count.id })),
    };
  }

  /** Summary: combines all read-model views into a single dashboard payload. */
  async getSummary() {
    if (this.summaryCache) {
      return this.summaryCache.data;
    }

    const [triageQueue, appealList, verificationBottlenecks, budgetView] =
      await Promise.all([
        this.getTriageQueue(),
        this.getAppealList(),
        this.getVerificationBottlenecks(),
        this.getBudgetView(),
      ]);

    const data = { triageQueue, appealList, verificationBottlenecks, budgetView };
    this.summaryCache = { refreshedAt: new Date().toISOString(), data };
    return data;
  }

  /** Refreshes the cached dashboard read-model in one pass. */
  async refreshSummary() {
    this.summaryCache = null;
    const data = await this.getSummary();
    const refreshedAt = new Date().toISOString();
    this.summaryCache = { refreshedAt, data };
    return { refreshedAt, data };
  }
}
