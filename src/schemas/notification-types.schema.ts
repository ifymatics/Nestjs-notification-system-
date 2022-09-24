import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationTypeDocument = NotificationType & Document;
@Schema()
export class NotificationType {

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    channels: string[];


}

export const NotificationTypeSchema = SchemaFactory.createForClass(NotificationType);