import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ConnectImapDto } from './dto/connect-imap.dto';

@Controller('mail')
@UseGuards(AuthGuard)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('connect')
  connect(@Body() body: ConnectImapDto) {
    return this.mailService.connectImap(body);
  }

  @Post('folders')
  folders(@Body() body: ConnectImapDto) {
    return this.mailService.getFolders(body);
  }

  @Post('emails')
  emails(@Body() body: any) {
    return this.mailService.getEmails(body);
  }

  @Post('email')
  email(@Body() body: any) {
    return this.mailService.getEmailDetail(body);
  }
}