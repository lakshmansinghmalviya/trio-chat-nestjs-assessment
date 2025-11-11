import { Document } from 'mongoose';
export type EmailDocument = Email & Document;
export declare class Email {
    to: string;
    from: string;
    subject: string;
    text?: string;
    html?: string;
    status: 'sent' | 'failed' | 'draft';
    error?: string;
}
export declare const EmailSchema: import("mongoose").Schema<Email, import("mongoose").Model<Email, any, any, any, Document<unknown, any, Email> & Email & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Email, Document<unknown, {}, import("mongoose").FlatRecord<Email>> & import("mongoose").FlatRecord<Email> & {
    _id: import("mongoose").Types.ObjectId;
}>;
