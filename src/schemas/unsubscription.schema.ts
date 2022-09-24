import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UnsubscriptionDocument = Unsubscription & Document;
@Schema()
export class Unsubscription {

    @Prop({ required: true })
    subscriberId: string;

    // @Prop({ required: true })
    channelId: string;

    @Prop({ required: true })
    channelName: string;

    @Prop({ default: false })
    unsubscribed: boolean;
}

export const UnsubscriptionSchema = SchemaFactory.createForClass(Unsubscription);