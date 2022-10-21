import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsService } from '../channels/channels.service';
import { ReceiverDetail } from './../notifications/interfaces/receiverDetail';
import { EmailChannelService } from './email-channel.service';

describe('EmailChannelService', () => {
  let emailChannelService: EmailChannelService;
  // let notificationService: ChannelsService;
  const mockChannelService: Partial<ChannelsService> = {
    getChannelTypes: async function (data: string): Promise<string[] | []> {
      if (!Object.values(data).length || !data) return []
      let channels: string[] = [];
      if (data === "emergency-meeting") return ['WhatsappChannel']
      const channelObjs = [{ type: 'happy-birthday', channels: ['EmailChannel', 'UIChannel'] }].find((channel: any) => channel.type === data);

      if (channelObjs) return channelObjs['channels'];
      return channels


    },
    isUnsubscribed: async function (id, channelType, valuse?) {
      const unsubscriptionDB = [

        { subscriberId: 6, channelId: 1, channelName: "emailchannel", unsubscribed: false },

        { subscriberId: 4, channelId: 2, channelName: "emailchannel", unsubscribed: true }
      ]
      const channel = unsubscriptionDB.find(channel => channel.subscriberId.toString() === id && channel.channelName === channelType.toLowerCase())
      if (channel && channel.unsubscribed) return Promise.resolve(true);

      return Promise.resolve(false)
    },
    findUser: async function (userId: string): Promise<ReceiverDetail> {
      const userDb = [{
        userId: "6",
        companyId: "3",
        companyName: "BrioHR",
        userFullName: "Nabil Oudghiri",
      },
      {
        userId: "4",
        companyId: "8",
        companyName: "Fantastic.ng",
        userFullName: "Okorie Ifeanyi",
      }
      ]
      const user = userDb.find(user => user.userId === userId);
      if (user) return { receiverId: user.userId, receiverName: user.userFullName }
      return { receiverId: '', receiverName: '' }
    }
  };
  // emailChannelService = new EmailChannelService(notificationService)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      providers: [EmailChannelService, { provide: ChannelsService, useValue: mockChannelService }],
    }).compile();

    emailChannelService = module.get<EmailChannelService>(EmailChannelService);
  });

  it(' emailChannelService should be defined', () => {
    expect(emailChannelService).toBeDefined();
  });
  describe("emailTemplate", () => {
    it(" should return empty string if object with no receiver's id or name is passed to it ", () => {
      expect(emailChannelService.emailTemplate({ receiverId: null, receiverName: null }, {}, 'EmailChannel')).toBe('')
    });
    it(" should return valid user name  string if object with  receiver's id or name is passed to it ", () => {
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
      expect(await emailChannelService.send(notification)).toMatchObject({ statusCode: 200 })
    });
    it(" should return a response with status code 400 if user has unsubscribed to the channel ", async () => {
      const notification = {
        "userId": "4",
        "companyId": "8",

        "notificationType": "happy-birthday"
      }
      expect(await emailChannelService.send(notification, true)).toMatchObject({ statusCode: 400 })
    })
  })
});
