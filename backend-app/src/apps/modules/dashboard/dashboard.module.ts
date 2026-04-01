import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controllers';
import { DashboardService } from './dashboard.services';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
