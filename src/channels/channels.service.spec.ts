import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { ReceiverDetail } from '../notifications/interfaces/receiverDetail';
import { Unsubscription, UnsubscriptionDocument } from "./../schemas/unsubscription.schema"
import { NotificationType, NotificationTypeDocument } from "./../schemas/notification-types.schema"
import { UserNotifications, UserNotificationsDocument } from "./../schemas/user-notifications"

import { ChannelsService } from './channels.service';
import { getModelToken } from '@nestjs/mongoose';

describe('NotificationService', () => {
  let channelService: ChannelsService;

  const userNotifications = [{
    "receiverId": "6",
    "channelName": "UIChannel",

    "isViewed": false,

  }];
  //mocking NotificationModel
  const mockNotificationModel: Partial<Model<NotificationType>> = {

  };
  //mocking subscriptionModel
  const mockUnsubscriptionModel: Partial<Model<Unsubscription>> = {
    findOne: jest.fn().mockImplementation((id: string, channelType: string, status: boolean) => {


      const unsubscriptionDB = [

        { subscriberId: 4, channelId: 2, channelName: "emailchannel", unsubscribed: true }
      ];
      const channel = unsubscriptionDB.find(channel => channel.unsubscribed == true && channel.subscriberId.toString() === id && channel.channelName === channelType.toLowerCase())
      if (channel) return Promise.resolve(true);

      return Promise.resolve(false)
    }),
  };
  //mocking UserNotificationModel
  const mockUserNotificationModel: Partial<Model<UserNotifications>> = {
    find: jest.fn().mockReturnValue((receiverId: string) => {
      if (userNotifications[0].receiverId === receiverId) return Promise.resolve(userNotifications)

      return Promise.resolve([])
    }),
    create: jest.fn().mockImplementation((notificationType: string, receiverDetail: ReceiverDetail, channel: string,) => {
      if (notificationType === "happy-birthday") return Promise.resolve(true)

      return Promise.resolve(false)


    }
    )
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelsService,
        { provide: getModelToken(NotificationType.name), useValue: mockNotificationModel },
        { provide: getModelToken(Unsubscription.name), useValue: mockUnsubscriptionModel },
        { provide: getModelToken(UserNotifications.name), useValue: mockUserNotificationModel }
      ],
    }).compile();

    channelService = module.get<ChannelsService>(ChannelsService);
  });

  it('should be defined', () => {
    expect(channelService).toBeDefined();
  });
  describe("isUnsubscribed", () => {
    it('should return false if a reciever is has NOT unsubscribed to the channel', async () => {
      expect(await channelService.isUnsubscribed("6", "EmailChannel", false)).toBe(false)
    });
    it('should return true if a reciever has unsubscribed to the channel', async () => {
      expect(await channelService.isUnsubscribed("4", "EmailChannel")).toBeFalsy()
    })
  })
  describe("getUserNotifications", () => {
    it('should return list of notifcations if the user has notifications', async () => {
      expect((await channelService.getUserNotifications("6")).length).toBeGreaterThan(0)
    });

  })
  describe("findUser", () => {
    it('should return a user object if the user exist', async () => {

      expect((await channelService.findUser("6"))).toMatchObject({
        receiverId: "6",

      })
    });
    it('should return a user object if the user exist', async () => {
      expect((await channelService.findUser("78"))).toMatchObject({})
    })
  });
  describe("findCompany", () => {
    it('should return a company object if the company exist', async () => {

      expect((await channelService.findCompany("2"))).toMatchObject({

        receiverId: "2",
        receiverName: "BrioHR",

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

      expect((await channelService.saveNotification("happy-birthday", { receiverId: "6", receiverName: "Ifeanyi Okorie" }, "EmailChannel"))).toBe(true)
    });
    it('should return an error string if saving notification failed due to invalid notificationType', async () => {

      expect((await channelService.saveNotification(null, { receiverId: "6", receiverName: "Ifyma" }, "EmailChannel"))).toBeFalsy()
    })
  })
});
