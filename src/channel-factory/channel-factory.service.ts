import { Injectable } from '@nestjs/common';
import { UiChannelService } from './../ui-channel/ui-channel.service';
import { EmailChannelService } from './../email-channel/email-channel.service';
import { ChannelsService } from '../channels/channels.service';
import { ResponseData } from './../notifications/interfaces/responseData.interface';
import { NotificationData } from 'src/notifications/interfaces/notification.interface';

@Injectable()
export class ChannelFactoryService {
    notificationData: any;
    constructor(private emailChannelService: EmailChannelService, private uiChannelService: UiChannelService, private notificationsService: ChannelsService) {

    }
    public async delegateChannel(data: NotificationData): Promise<ResponseData | (ResponseData | ResponseData[])[] | ResponseData> {
        this.notificationData = data;
        //console.log(data)

        let channels: string[]

        channels = await this.getChannelType(this.notificationData);
        if (!channels?.length) return { message: "The channel for this notification not found!", channel: "", notificationType: data.notificationType, statusCode: 400 }

        const channelSystems = channels.map(channel => {
            switch (channel.toLowerCase()) {
                case 'emailchannel':

                    return this.emailChannelService.send(this.notificationData);
                case 'uichannel':
                    //this.uiChannelService.constructor.name
                    return this.uiChannelService.send(this.notificationData);

                default:
                    return { message: "Notification channel not found!", channel, notificationType: data.notificationType, statusCode: 404 };

            }
        })


        const result = await Promise.all(channelSystems);
        return result


    }
    async getChannelType(notificationData: NotificationData) {
        if (!Object.keys(notificationData).length || !notificationData.notificationType) return []

        const subject = notificationData?.notification?.subject;
        const type = notificationData.notificationType ? notificationData.notificationType : subject ? subject.toLowerCase().split(' ').join('-') : null;

        if (!type) return [];

        const notificationChannel = await this.notificationsService.getChannelTypes(type)
        return notificationChannel



    }

}
