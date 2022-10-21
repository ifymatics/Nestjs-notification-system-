import { Test, TestingModule } from '@nestjs/testing';
import { ReceiverDetail } from '../notifications/interfaces/receiverDetail';
import { ChannelsService } from '../channels/channels.service';
import { UiChannelService } from './ui-channel.service';

describe('UiChannelService', () => {
  let uiChannelService: UiChannelService;
  //mocking ChannelService
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

        { subscriberId: "6", channelId: 1, channelName: "uichannel", unsubscribed: false },

        { subscriberId: "4", channelId: 2, channelName: "uichannel", unsubscribed: true }
      ]
      const channel = unsubscriptionDB.find(channel => channel.subscriberId.toString() === id && channel.channelName === channelType.toLowerCase())
      if (channel && channel.unsubscribed) return Promise.resolve(true);

      return Promise.resolve(false)
    },
    saveNotification: async (notificationType: string, receiverDatail: { receiverId: string, receiverName: string }, channel: string,) => {
      if (!notificationType) return false;
      return Promise.resolve(true)
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
  };;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UiChannelService, { provide: ChannelsService, useValue: mockChannelService }],

    }).compile();

    uiChannelService = module.get<UiChannelService>(UiChannelService);
  });

  it('should be defined', () => {
    expect(uiChannelService).toBeDefined();
  });
  describe("send", () => {
    it(" should return a response with status code 200 if user has not unsubscribed to the channel ", async () => {
      const notification = {
        "userId": "6",
        "companyId": "3",

        "notificationType": "happy-birthday"
      };

      expect(await uiChannelService.send(notification)).toMatchObject({ statusCode: 200 })
    });

  })
});
