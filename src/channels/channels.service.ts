import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReceiverDetail } from '../notifications/interfaces/receiverDetail';
import { companyList } from "../mock-data/company"
import { userList } from "../mock-data/user"
import { notificationListTypes } from "../mock-data/notification-list"
import { Unsubscription, UnsubscriptionDocument } from "./../schemas/unsubscription.schema"
import { NotificationType, NotificationTypeDocument } from "./../schemas/notification-types.schema"
import { UserNotifications, UserNotificationsDocument } from "./../schemas/user-notifications"

@Injectable()
export class ChannelsService {
    constructor(
        @InjectModel(Unsubscription.name) private unSuscriptionModel: Model<UnsubscriptionDocument>,
        @InjectModel(NotificationType.name) private notificationTypeModel: Model<NotificationTypeDocument>,
        @InjectModel(UserNotifications.name) private userNotificationsModel: Model<UserNotificationsDocument>
    ) { }
    async isUnsubscribed(id: string, channelType: string, valuse?: boolean): Promise<boolean | string> {
        try {
            const receiverIsUnsubscribed = await this.unSuscriptionModel.findOne({ subscriberId: id, unsubscribed: true, channelName: channelType }).exec()
            if (receiverIsUnsubscribed) return true

        } catch (error) {
            return error.message;
        }

        return false;
    }
    async getUserNotifications(userId: string) {
        let notifications = [];
        try {
            notifications = await this.userNotificationsModel.find({ receiverId: userId })
        } catch (error) {
            console.log('UI notification was not saved due to error!')
            return notifications
        }
        return notifications
    }
    async findUser(userId: string) {

        let receiverDatail: ReceiverDetail = { receiverId: '', receiverName: '' };
        const user = userList.find(user => {
            return user.userId === userId
        });

        if (user) receiverDatail = { receiverId: user.userId, receiverName: user.userFullName }
        return receiverDatail
    }
    async findCompany(companyId: string) {
        let receiverDatail: ReceiverDetail = { receiverId: '', receiverName: '' }
        const company = companyList.find(company => company.companyId === companyId);
        if (company) receiverDatail = { receiverId: company.companyId, receiverName: company.companyName }
        return receiverDatail
    }
    async getChannelTypes(notificationsType: string): Promise<string[]> {

        let channels: string[] = [];

        const channelObjs = notificationListTypes.find((channel: any) => channel.type === notificationsType);

        if (channelObjs) return channelObjs['channels'];
        return channels
    }

    async saveNotification(notificationType: string, receiverDetail: ReceiverDetail, channel: string, content?: string,) {

        try {
            await this.userNotificationsModel.create({ receiverId: receiverDetail.receiverId, notificationType, notification: { content: content }, channelName: channel })

        } catch (error) {
            // console.log(error.message)
            //return false
        }

        return true
    }
}
