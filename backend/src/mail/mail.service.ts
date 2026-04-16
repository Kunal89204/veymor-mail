import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  getHello() {
    return {
      message: 'Oi',
    };
  }
}
