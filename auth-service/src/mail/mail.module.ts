import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],   // <-- serve per poterlo importare in altri moduli
})
export class MailModule {}