import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailDocument = Email & Document;

@Schema({ timestamps: true })
export class Email {
  @Prop({ required: true })
  to!: string;

  @Prop({ required: true })
  subject!: string;

  @Prop()
  text?: string;

  @Prop()
  html?: string;

  @Prop({ required: true, enum: ['sent', 'failed','draft'] })
  status!: 'sent' | 'failed' | 'draft';

  @Prop()
  error?: string;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
      