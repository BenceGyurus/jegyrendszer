import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MailDTO } from 'src/dto/mail.dts';

@Schema()
export class Mail {
  @Prop({ required: true })
  created: Date;
  @Prop({ required: true, default: false })
  completed: boolean;
  @Prop({ required: false })
  jobId: number;
  @Prop({ required: false })
  mail: MailDTO;
}

export type MailDocument = HydratedDocument<Mail>;
export const MailSchema = SchemaFactory.createForClass(Mail);
