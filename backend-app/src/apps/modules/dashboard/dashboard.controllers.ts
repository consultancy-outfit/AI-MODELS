import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { DashboardService } from './dashboard.services';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  overview(@Req() req: Request) {
    return this.dashboardService.overview(req);
  }

  @Get('history')
  history(@Req() req: Request) {
    return this.dashboardService.history(req);
  }

  @Get('settings')
  settings(@Req() req: Request) {
    return this.dashboardService.settings(req);
  }

  @Get('billing')
  billing(@Req() req: Request) {
    return this.dashboardService.billing(req);
  }
}
