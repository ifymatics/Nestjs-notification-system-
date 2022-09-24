// userId: {
//     type: String,
//         require: true
// },
// channelId: {
//     type: String,
//         require: true
// },
// notification: {
//     type: {
//         subject: String,
//             content: { type: String, require: true }
//     }
// },
// isViewed: {
//     type: Boolean,
//         default: false
// }
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message {
    subject?: string;

    content?: string;
}
export type UserNotificationsDocument = UserNotifications & Document;
@Schema()
export class UserNotifications {

    @Prop({ required: true })
    receiverId: string;

    @Prop()
    channelId: string;


    @Prop({ required: true })
    channelName: string;

    @Prop({ required: true })
    notificationType: string;

    @Prop({ type: Message, required: true })
    notification: Message

    @Prop({ default: false })
    isViewed: boolean;
}

export const UserNotificationsSchema = SchemaFactory.createForClass(UserNotifications);