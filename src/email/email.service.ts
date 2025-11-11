import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from './dto/send-email.dto';
import { Email, EmailDocument } from './schemas/email.schema';
import { ListLogsOptions } from './interfaces/email-log.interface';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { from } from 'rxjs';

@Injectable()
export class EmailService {

  private transporter: nodemailer.Transporter;
  private defaultFrom: string;

  constructor(private readonly configService: ConfigService, @InjectModel(Email.name) private readonly emailModel: Model<EmailDocument>,) {

    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<number>('SMTP_PORT')) || 587;
    const secure = this.configService.get<boolean>('SMTP_SECURE') === true;
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    this.defaultFrom = this.configService.get<string>('DEFAULT_FROM') || '"No Reply" <lslakshman@gmail.com>';

    // ✅ Use SMTPOptions directly for type safety
    const smtpOptions: SMTPTransport.Options = { host, port, secure, auth: user && pass ? { user, pass } : undefined, };
    this.transporter = nodemailer.createTransport(smtpOptions);
  }

  async sendEmail(payload: SendEmailDto) {
       console.log("The payload coming liek this "+ JSON.stringify(payload))
       
    const mailOptions: nodemailer.SendMailOptions = {
      from: payload.from || this.defaultFrom,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    };

    const log = new this.emailModel({
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
      status: 'sent',
      from : mailOptions.from
    });

    try {
      const info = await this.transporter.sendMail(mailOptions);
      log.status = 'sent';

      (log as any).meta = { messageId: info.messageId, response: info.response, };

      // throw new Error(" Custorm error thrown ");   // uncomment to check the failed status and logs store in the db
      
      const saved = await log.save();

      Logger.log(`✅ Email sent successfully: ${info.messageId}`);
      return { success: true, id: saved._id, status: 'sent' };
    } catch (err: any) {
      log.status = 'failed';
      log.error = err?.message || String(err);

      const saved = await log.save();

      Logger.error(`❌ Email failed: ${log.error}`);
      return {
        success: false,
        id: saved._id,
        status: 'failed',
        error: log.error,
      };
    }
  }

  async listLogs(options: ListLogsOptions) {
    const { page = 1, limit = 10, status } = options;
    const filter: Record<string, any> = {};

    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.emailModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.emailModel.countDocuments(filter),
    ]);

    return {
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      items,
    };
  }
}
