import { Controller, Get, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @UseGuards(AuthGuard)
  @Get('connect')
  getHello() {
    return this.mailService.getHello();
  }
}
