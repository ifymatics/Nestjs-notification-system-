import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelsService } from './channels.service';
import { Unsubscription, UnsubscriptionSchema } from "./../schemas/unsubscription.schema"
import { NotificationType, NotificationTypeSchema } from "./../schemas/notification-types.schema"
import { UserNotifications, UserNotificationsSchema } from "./../schemas/user-notifications"

@Module({
  providers: [ChannelsService],
  imports: [
    MongooseModule.forFeature([
      { name: Unsubscription.name, schema: UnsubscriptionSchema },
      { name: NotificationType.name, schema: NotificationTypeSchema },
      { name: UserNotifications.name, schema: UserNotificationsSchema }
    ])
  ],
  exports: [MongooseModule.forFeature([
    { name: Unsubscription.name, schema: UnsubscriptionSchema },
    { name: NotificationType.name, schema: NotificationTypeSchema },
    { name: UserNotifications.name, schema: UserNotificationsSchema }
  ]), ChannelsService]
})
export class ChannelsModule { }
