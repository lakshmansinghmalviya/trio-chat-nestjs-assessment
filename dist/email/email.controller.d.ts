import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './email.service';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    send(payload: SendEmailDto): Promise<{
        success: boolean;
        id: any;
        status: string;
    }>;
    list(page?: string, limit?: string, status?: string): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
        items: (import("mongoose").FlattenMaps<import("./schemas/email.schema").EmailDocument> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
    }>;
}
