import { Injectable } from '@nestjs/common';
import { receiverIdType } from './../notifications/interfaces/notificationReceiverId';
import { ReceiverDetail } from './../notifications/interfaces/receiverDetail';
import { NotificationData } from './../notifications/interfaces/notification.interface';
import { ChannelsService } from '../channels/channels.service';
import { Notification } from "./../notifications/interfaces/notification.interface"
import { ResponseData } from 'src/notifications/interfaces/responseData.interface';

@Injectable()
export class EmailChannelService {
    constructor(private notificationsService: ChannelsService) {

    }
    async send({ userId, companyId, notification, notificationType, }: NotificationData, status?: boolean): Promise<ResponseData[] | ResponseData> {

        let userUnsubscribed: boolean | string;
        let companyUnsubscribed: boolean | string;
        if (!notificationType || (!userId && !companyId)) return { message: "Error occurred, required fields cannot be empty!", channel: 'EmailChannel', notificationType, statusCode: 400 };

        if (userId) {
            userUnsubscribed = await this.notificationsService.isUnsubscribed(userId, "EmailChannel");
        } else {
            companyUnsubscribed = await this.notificationsService.isUnsubscribed(companyId, "EmailChannel");

        }


        if (userUnsubscribed || companyUnsubscribed) return { message: "Receiver has unsubscribed", channel: 'EmailChannel', notificationType, statusCode: 400 };

        if (typeof companyUnsubscribed === 'string') return { message: "Error occurred, notification not sent!", channel: 'EmailChannel', notificationType, statusCode: 500 };
        const receiverDatail = userId ? await this.notificationsService.findUser(userId) : await this.notificationsService.findCompany(companyId)

        if (!receiverDatail.receiverId) return { message: "Receiver not found!", channel: 'UIChannel', notificationType, statusCode: 404 };//const storeNotification = await this.notificationsService.saveNotification(content, receiverDatail);
        console.log(this.emailTemplate(receiverDatail, notification, notificationType));

        return { message: "Notification Sent successfully", channel: 'EmailChannel', notificationType, statusCode: 200 }

    }
    public emailTemplate(receiver: ReceiverDetail, notification: Notification, notificationType: string): string {
        if (!receiver) return ""
        if (notification)
            return `${notification?.subject} ${notification?.subject?.toLowerCase()?.includes('happy birthday') ? receiver.receiverName : ''} 
        \n${notification?.content}`
        return notificationType === "happy-birthday" ? `${notificationType.split("-").join(" ")} ${receiver.receiverName}` : notificationType.split("-").join(" ")
    }
}
