import { Controller, Get } from '@nestjs/common';
import { DashboardService } from '../../application/dashboard_service';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('summary')
  async summary() {
    return await this.service.summary();
  }
}
