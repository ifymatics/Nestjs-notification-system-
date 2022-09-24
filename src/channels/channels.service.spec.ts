import { Test, TestingModule } from '@nestjs/testing';
import { ReceiverDetail } from 'src/notifications/interfaces/receiverDetail';
import { ChannelsService } from './channels.service';

describe('NotificationService', () => {
  let channelService: ChannelsService;
  const users = [{
    userId: "6",
    companyId: "3",
    companyName: "Fantastic Tech",
    userFullName: "Kennethy Simon",
  }]
  const companies = [{

    companyId: "2",
    companyName: "BrioHR",

  }]
  const userNotifications = [{
    "receiverId": "6",
    "channelName": "UIChannel",

    "isViewed": false,

  }];
  const channelTypeLists = [{ type: 'happy-birthday', channels: ['EmailChannel', 'UIChannel'] },]
  const mockChannelService: Partial<ChannelsService> = {
    isUnsubscribed: jest.fn().mockImplementation((id: string, channelType: string, status: boolean) => {
      if (status) return Promise.resolve(true)
      return Promise.resolve(false)
    }),

    getUserNotifications: jest.fn().mockImplementation((receiverId: string) => {
      if (userNotifications[0]['receiverId'] !== receiverId) return Promise.resolve([])

      return Promise.resolve(userNotifications)
    }),
    findUser: jest.fn().mockImplementation((userId: string) => {
      if (users[0].userId === userId) return Promise.resolve(users[0])
      return Promise.resolve({})
    }
    ),
    findCompany: jest.fn().mockImplementation((companyId: string) => {
      if (companies[0].companyId === companyId) return Promise.resolve(companies[0])
      return Promise.resolve({})
    }
    ),
    getChannelTypes: jest.fn().mockImplementation((notificationType: string) => {
      if (channelTypeLists[0].type === notificationType) return Promise.resolve(channelTypeLists[0].channels)
      return Promise.resolve([])
    }),
    saveNotification: jest.fn().mockImplementation((notificationType: string, receiverDetail: ReceiverDetail, channel: string,) => {
      if (notificationType === "happy-birthday") return Promise.resolve(true)

      return Promise.resolve('')


    }
    )
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelsService,],
    }).overrideProvider(ChannelsService).useValue(mockChannelService).compile();

    channelService = module.get<ChannelsService>(ChannelsService);
  });

  it('should be defined', () => {
    expect(channelService).toBeDefined();
  });
  describe("isUnsubscribed", () => {
    it('should return false if a reciever is has NOT unsubscribed to the channel', async () => {
      expect(await channelService.isUnsubscribed("6", "EmailChannel", false)).toBe(false)
    });
    it('should return true if a reciever is has unsubscribed to the channel', async () => {
      expect(await channelService.isUnsubscribed("6", "EmailChannel", true)).toBe(true)
    })
  })
  describe("getUserNotifications", () => {
    it('should return list of notifcations if the user has notifications', async () => {
      expect((await channelService.getUserNotifications("6")).length).toBeGreaterThan(0)
    });
    it('should return empty list if a user does not have nay stored notification', async () => {
      expect((await channelService.getUserNotifications("78")).length).toEqual(0)
    })
  })
  describe("findUser", () => {
    it('should return a user object if the user exist', async () => {

      expect((await channelService.findUser("6"))).toMatchObject({
        userId: "6",

      })
    });
    it('should return a user object if the user exist', async () => {
      expect((await channelService.findUser("78"))).toMatchObject({})
    })
  });
  describe("findCompany", () => {
    it('should return a company object if the company exist', async () => {

      expect((await channelService.findCompany("2"))).toMatchObject({

        companyId: "2",
        companyName: "BrioHR",

      })

    });
    it('should return a user object if the user exist', async () => {
      expect((await channelService.findCompany("78"))).toMatchObject({})
    })
  });
  describe("getChannelTypes", () => {
    it('should return list of channels if list of channels for the particular notificationType exists', async () => {

      expect((await channelService.getChannelTypes("happy-birthday")).length).toBeGreaterThan(0)
    });
    it('should return empty list  if list of channels for the particular notificationType exists does not exist', async () => {
      expect((await channelService.getChannelTypes("happy-mothers-day")).length).toEqual(0)
    })
  })
  describe("saveNotification", () => {
    it('should return true if notification is saved', async () => {

      expect((await channelService.saveNotification("happy-birthday", { receiverId: "6", receiverName: "Ifyma" }, "EmailChannel"))).toBe(true)
    });
    it('should return an error string if saving notification failed due to invalid notificationType', async () => {

      expect((await channelService.saveNotification('', { receiverId: "6", receiverName: "Ifyma" }, "EmailChannel"))).toBe('')
    })
  })
});
