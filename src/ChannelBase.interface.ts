import { NotificationData } from "./notifications/interfaces/notification.interface";


export interface ChannelBase {
    send(notification: NotificationData): Promise<any>
}