import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './email.service';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async send(@Body() payload: SendEmailDto) {
    
    const result = await this.emailService.sendEmail(payload);
    return { success: result.success, id: result.id, status: result.status };
  }

  @Get()
  async list(@Query('page') page = '1', @Query('limit') limit = '20', @Query('status') status?: string,) {

    const p = parseInt(page, 10);
    const l = Math.min(parseInt(limit, 10) || 20, 100);
    return this.emailService.listLogs({ page: p, limit: l, status });

  }
}
