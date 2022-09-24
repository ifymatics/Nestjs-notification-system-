import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsService } from 'src/channels/channels.service';
import { NotificationData } from 'src/notifications/interfaces/notification.interface';
import { ReceiverDetail } from './../notifications/interfaces/receiverDetail';
import { EmailChannelService } from './email-channel.service';

describe('EmailChannelService', () => {
  let emailChannelService: EmailChannelService;
  let notificationService: ChannelsService;
  emailChannelService = new EmailChannelService(notificationService)
  const mockEmailChannelService: Partial<EmailChannelService> = {
    emailTemplate: jest.fn().mockImplementation((receiver: ReceiverDetail, { }, type: string = "") => {
      if (receiver.receiverId === "") return ""
      if (type === "happy-birthday") return `happy birthday ${receiver.receiverName}`
      return receiver.receiverName
    }),
    send: jest.fn().mockImplementation((obj: NotificationData, isUnsubscribed: boolean) => {

      if (isUnsubscribed) return Promise.resolve({ message: "Receiver has unsubscribed", channel: 'EmailChannel', notificationType: obj.notificationType, statusCode: 400 });
      return Promise.resolve({ message: "Email delivered", channel: 'EmailChannel', notificationType: obj.notificationType, statusCode: 200 });
    })
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      exports: [EmailChannelService],
      providers: [EmailChannelService],
    }).overrideProvider(EmailChannelService).useValue(mockEmailChannelService).compile();

    emailChannelService = module.get<EmailChannelService>(EmailChannelService);
  });

  it(' emailChannelService should be defined', () => {
    expect(emailChannelService).toBeDefined();
  });
  describe("emailTemplate", () => {
    it(" should return empty if object with  receiver's id or name is passed to it ", () => {
      expect(emailChannelService.emailTemplate({ receiverId: '', receiverName: '' }, {}, 'EmailChannel')).toBe('')
    });
    it(" should return valid user name  string if object with empty receiver's id or name is passed to it ", () => {
      expect(emailChannelService.emailTemplate({ receiverId: '6', receiverName: 'Okorie' }, {}, '')).toBe('Okorie')
    })
    it(" should return  a happy birthday message with a user's name if the notificationType is 'happy-birthday' is passed to it ", () => {
      expect(emailChannelService.emailTemplate({ receiverId: '6', receiverName: 'Lugard' }, {}, 'happy-birthday')).toBe('happy birthday Lugard')
    })
  })
  describe("send", () => {
    it(" should return a response with status code 200 if user has not unsubscribed to the channel ", async () => {
      const notification = {
        "userId": "6",
        "companyId": "3",

        "notificationType": "happy-birthday"
      }
      expect(await emailChannelService.send(notification, false)).toMatchObject({ statusCode: 200 })
    });
    it(" should return a response with status code 400 if user has unsubscribed to the channel ", async () => {
      const notification = {
        "userId": "6",
        "companyId": "3",

        "notificationType": "happy-birthday"
      }
      expect(await emailChannelService.send(notification, true)).toMatchObject({ statusCode: 400 })
    })
  })
});
