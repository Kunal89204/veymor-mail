import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SuccessResponse } from './common/dto/response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('health-check')
  getHealth() {
    const data = this.appService.getHealthStatus();

    return new SuccessResponse(
      'Veymor Mail backend is healthy and operational',
      data,
    );
  }
}
