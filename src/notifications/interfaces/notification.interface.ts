
export interface Notification {
    subject?: string;
    content?: string;

}
export interface NotificationData {

    userId: string;
    companyId: string;
    notificationType: string
    notification?: Notification;
}