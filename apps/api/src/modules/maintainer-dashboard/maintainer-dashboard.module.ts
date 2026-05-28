import { Module } from "@nestjs/common";
import { PrismaService } from "../../lib/prisma.service.js";
import { MaintainerDashboardController } from "./maintainer-dashboard.controller.js";
import { MaintainerDashboardService } from "./maintainer-dashboard.service.js";

@Module({
  controllers: [MaintainerDashboardController],
  providers: [MaintainerDashboardService, PrismaService],
  exports: [MaintainerDashboardService],
})
export class MaintainerDashboardModule {}
