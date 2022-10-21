import { Test, TestingModule } from '@nestjs/testing';

import { UiChannelService } from './../ui-channel/ui-channel.service';


import { ChannelFactoryService } from './channel-factory.service';

import { NotificationData } from './../notifications/interfaces/notification.interface';

import { receiverIdType } from './../notifications/interfaces/notificationReceiverId';
import { ChannelsService } from '../channels/channels.service';
import { EmailChannelService } from '../email-channel/email-channel.service';


describe('ChannelFactoryService', () => {
  let channelFactoryService: ChannelFactoryService;
  //mocking uiChannelService
  const mockUiChannelService: Partial<UiChannelService> = {
    send: async function ({ notificationType, userId, companyId, notification }: NotificationData) {
      const content = notification?.content;
      let userUnsubscribed: boolean | string;
      let companyUnsubscribed: boolean | string;
      const isUnsubscribed = jest.fn().mockImplementation((userId, userType: string, status: boolean) => {
        if (status) return Promise.resolve(true)
        else return Promise.resolve(false)
      });
      const findUser = jest.fn().mockImplementation((userId, userType: string) => {

        if (userId) return Promise.resolve({ receiverId: userId })
        else return Promise.resolve({ receiverId: "" })
      })
      const findCompany = jest.fn().mockImplementation((userId, userType: string,) => {
        if (userId) return Promise.resolve({ receiverId: userId })
        else return Promise.resolve({ receiverId: "" })
      })
      const saveNotification = jest.fn().mockImplementation((userId, userType: string, status: boolean) => {
        if (status) return Promise.resolve(true)
        else return Promise.resolve(false)
      })
      if (!notificationType || (!userId && !companyId)) return { message: "Error occurred, required fields cannot be empty!", channel: 'UIChannel', notificationType, statusCode: 400 };

      if (userId) {
        userUnsubscribed = await isUnsubscribed(userId, receiverIdType.USER);
      } else {
        companyUnsubscribed = await isUnsubscribed(companyId, receiverIdType.COMPANY);

      }


      if (companyUnsubscribed || companyUnsubscribed) return { message: "Receiver has unsubscribed", channel: 'UIChannel', notificationType, statusCode: 400 };
      if (typeof companyUnsubscribed === 'string') return { message: "Error occurred, notification not sent through UIChannel!", channel: 'UIChannel', notificationType, statusCode: 500 };
      const receiverDatail = userId ? await findUser(userId) : await findCompany(companyId)
      if (!receiverDatail.receiverId) return { message: "Receiver not found!", channel: 'UIChannel', notificationType, statusCode: 404 };
      const storeNotification = await saveNotification(notificationType, receiverDatail, "UIChannel", content);

      if (!storeNotification) return { message: "Notification could not be sent,try later", channel: 'UIChannel', notificationType, statusCode: 500 }
      return { message: "Notification Sent successfully", channel: 'UIChannel', notificationType, statusCode: 200 }

    }
  };
  //mocking ChannelService
  const mockChannelService: Partial<ChannelsService> = {
    getChannelTypes: async function (data: string): Promise<string[] | []> {
      if (!Object.values(data).length || !data) return []
      let channels: string[] = [];
      if (data === "emergency-meeting") return ['WhatsappChannel']
      const channelObjs = [{ type: 'happy-birthday', channels: ['EmailChannel', 'UIChannel'] }].find((channel: any) => channel.type === data);

      if (channelObjs) return channelObjs['channels'];
      return channels


    }
  };
  //mocking emailChannelService
  const mockEmailChannelService: Partial<EmailChannelService> = {
    send: async function ({ notificationType, userId, companyId, notification }: NotificationData) {
      const content = notification?.content;
      let userUnsubscribed: boolean | string;
      let companyUnsubscribed: boolean | string;
      const isUnsubscribed = jest.fn().mockImplementation((userId, userType: string, status: boolean) => {
        if (status) return Promise.resolve(true)
        else return Promise.resolve(false)
      });
      const findUser = jest.fn().mockImplementation((userId, userType: string) => {

        if (userId) return Promise.resolve({ receiverId: userId })
        else return Promise.resolve({ receiverId: "" })
      })
      const findCompany = jest.fn().mockImplementation((userId, userType: string,) => {
        if (userId) return Promise.resolve({ receiverId: userId })
        else return Promise.resolve({ receiverId: "" })
      })
      const saveNotification = jest.fn().mockImplementation((userId, userType: string, status: boolean) => {
        if (status) return Promise.resolve(true)
        else return Promise.resolve(false)
      })
      if (!notificationType || (!userId && !companyId)) return { message: "Error occurred, required fields cannot be empty!", channel: 'UIChannel', notificationType, statusCode: 400 };

      if (userId) {
        userUnsubscribed = await isUnsubscribed(userId, receiverIdType.USER);
      } else {
        companyUnsubscribed = await isUnsubscribed(companyId, receiverIdType.COMPANY);

      }


      if (companyUnsubscribed || companyUnsubscribed) return { message: "Receiver has unsubscribed", channel: 'EmailChannel', notificationType, statusCode: 400 };
      if (typeof companyUnsubscribed === 'string') return { message: "Error occurred, notification not sent through EmailChannel!", channel: 'EmailChannel', notificationType, statusCode: 500 };
      const receiverDatail = userId ? await findUser(userId) : await findCompany(companyId)
      if (!receiverDatail.receiverId) return { message: "Receiver not found!", channel: 'EmailChannel', notificationType, statusCode: 404 };
      const storeNotification = await saveNotification(notificationType, receiverDatail, "EmailChannel", content);

      if (!storeNotification) return { message: "Notification could not be sent,try later", channel: 'EmailChannel', notificationType, statusCode: 500 }
      return { message: "Notification Sent successfully", channel: 'EmailChannel', notificationType, statusCode: 200 }

    }
  };



  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelFactoryService,
        { provide: ChannelsService, useValue: mockChannelService },
        { provide: EmailChannelService, useValue: mockEmailChannelService },
        { provide: UiChannelService, useValue: mockUiChannelService }
      ],
    }).compile();

    channelFactoryService = module.get<ChannelFactoryService>(ChannelFactoryService);
  });

  it('should be defined', () => {
    expect(channelFactoryService).toBeDefined();
  });

  describe("delegateChannel", () => {
    it("should return a response with statusCode 400 if it is called with  empty data or data without notificationType", async () => {
      const notificationData = {
        "userId": "6",
        "companyId": "3",

        "notificationType": null
      }
      expect(await channelFactoryService.delegateChannel(notificationData)).toMatchObject({ statusCode: 400 })
    });
    it("should return a response with statusCode 200 if it is called with  data that contains notificationType, userId,companyId and the user is not unsubscribed", async () => {
      const notificationData = {
        "userId": "6",
        "companyId": "3",

        "notificationType": "happy-birthday"
      }
      //const response = [{ "channel": "EmailChannel", "message": "Notification Sent successfully", "notificationType": "happy-birthday", "statusCode": 200 }, { "channel": "UIChannel", "message": "Notification Sent successfully", "notificationType": "happy-birthday", "statusCode": 200 }]
      expect((await channelFactoryService.delegateChannel(notificationData))[0]).toMatchObject({ statusCode: 200 })
    });
    it("should return a response with statusCode 404 if the channel for the notification is not found", async () => {
      const notificationData = {
        "userId": "6",
        "companyId": "3",

        "notificationType": "emergency-meeting"
      }
      //const response = [{ "channel": "WhatsappChannel", "message": "Notification channel not found!", "notificationType": "emergency-meeting", "statusCode": 404 }]
      expect((await channelFactoryService.delegateChannel(notificationData))[0]).toMatchObject({ statusCode: 404 })
    });
  })
  describe("getChannelType", () => {
    it("it should return empty list if empty object  or no notificationType is passed throgh it ", async () => {
      expect((await channelFactoryService.getChannelType({ companyId: "", userId: "", notificationType: "" })).length).toEqual(0)
    });
    it("it should return a list if object with valid key-value pairs is passed throgh it ", async () => {
      expect((await channelFactoryService.getChannelType({ companyId: "3", userId: "6", notificationType: "happy-birthday" })).length).toBeGreaterThan(0)
    })
  })
});
