import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailDocument } from './schemas/email.schema';
import { ListLogsOptions } from './interfaces/email-log.interface';
export declare class EmailService {
    private readonly configService;
    private readonly emailModel;
    private transporter;
    private defaultFrom;
    constructor(configService: ConfigService, emailModel: Model<EmailDocument>);
    sendEmail(payload: SendEmailDto): Promise<{
        success: boolean;
        id: any;
        status: string;
        error?: undefined;
    } | {
        success: boolean;
        id: any;
        status: string;
        error: string | undefined;
    }>;
    listLogs(options: ListLogsOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
        items: (import("mongoose").FlattenMaps<EmailDocument> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
    }>;
}
