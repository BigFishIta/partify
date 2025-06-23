// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';         // ✅ import corretto
//   ↑ oppure:  import nodemailer from 'nodemailer'
//              …e in tsconfig.json metti  "esModuleInterop": true

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: false,                               // STARTTLS (≠465)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendVerification(to: string, link: string) {
    await this.transporter.sendMail({
      from: '"Partify" <no-reply@partify.com>',
      to,
      subject: 'Verify your e-mail',
      html:    `Click <a href="${link}">here</a> to verify your account.`,
    });
  }
}