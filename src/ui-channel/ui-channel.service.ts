import { Injectable } from '@nestjs/common';
import { ResponseData } from './../notifications/interfaces/responseData.interface';
import { ChannelsService } from '../channels/channels.service';
import { NotificationData } from "./../notifications/interfaces/notification.interface"
import { receiverIdType } from "./../notifications/interfaces/notificationReceiverId"
import { ReceiverDetail } from "./../notifications/interfaces/receiverDetail"

@Injectable()
export class UiChannelService {
    constructor(private notificationsService: ChannelsService) {

    }
    async send({ userId, companyId, notification, notificationType }: NotificationData): Promise<ResponseData[] | ResponseData> {
        const content = notification?.content;
        let userUnsubscribed: boolean | string;
        let companyUnsubscribed: boolean | string;
        if (!notificationType || (!userId && !companyId)) return { message: "Error occurred, required fields cannot be empty!", channel: 'UIChannel', notificationType, statusCode: 400 };

        if (userId) {
            userUnsubscribed = await this.notificationsService.isUnsubscribed(userId, receiverIdType.USER);
        } else {
            companyUnsubscribed = await this.notificationsService.isUnsubscribed(companyId, receiverIdType.COMPANY);

        }


        if (companyUnsubscribed || companyUnsubscribed) return { message: "Receiver has unsubscribed", channel: 'UIChannel', notificationType, statusCode: 400 };
        if (typeof companyUnsubscribed === 'string' || typeof userUnsubscribed === 'string') return { message: "Error occurred, notification not sent through UIChannel!", channel: 'UIChannel', notificationType, statusCode: 500 };
        const receiverDatail = userId ? await this.notificationsService.findUser(userId) : await this.notificationsService.findCompany(companyId)
        if (!receiverDatail.receiverId) return { message: "Receiver not found!", channel: 'UIChannel', notificationType, statusCode: 404 };
        const storeNotification = await this.notificationsService.saveNotification(notificationType, receiverDatail, "UIChannel", content);

        if (!storeNotification) return { message: "Notification could not be sent,try later", channel: 'UIChannel', notificationType, statusCode: 500 }
        return { message: "Notification Sent successfully", channel: 'UIChannel', notificationType, statusCode: 200 }

    }

}
