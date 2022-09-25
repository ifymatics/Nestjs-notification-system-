import { Test, TestingModule } from '@nestjs/testing';

import { UiChannelService } from './../ui-channel/ui-channel.service';
import { ChannelsService } from './../channels/channels.service';

import { ChannelFactoryService } from './channel-factory.service';
import { Unsubscription } from './../schemas/unsubscription.schema';

import { EmailChannelService } from 'src/email-channel/email-channel.service';
import { ResponseData } from 'src/notifications/interfaces/responseData.interface';
import { NotificationData } from './../notifications/interfaces/notification.interface';
import { notificationListTypes } from 'src/mock-data/notification-list';
import { receiverIdType } from './../notifications/interfaces/notificationReceiverId';

describe('ChannelFactoryService', () => {
  let channelFactoryService: ChannelFactoryService;
  let uiChannelService: Partial<UiChannelService> = {
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

  const mockChannelFactoryService: Partial<ChannelFactoryService> = {

    delegateChannel: jest.fn().mockImplementation(async function (data: NotificationData) {
      // this.notifcationsDta = data?data:{};
      let channels: string[];
      channels = await this.getChannelType(data)
      if (channels.includes("WhatsappChannel")) return { message: "The channel for this notification not found!", channel: "WhatsappChannel", notificationType: data.notificationType, statusCode: 404 }
      if (!channels.length) return { message: "The channel for this notification not found!", channel: "", notificationType: data.notificationType, statusCode: 400 }
      const responseData = await uiChannelService.send(data);

      if (typeof responseData === "string") return { message: "Error occurred, notification not sent!", channel: 'EmailChannel', notificationType: data.notificationType, statusCode: 500 }
      return responseData
    }),
    getChannelType: async function (data: NotificationData): Promise<string[] | []> {
      if (!Object.values(data).length || !data.notificationType) return []
      let channels: string[] = [];
      if (data.notificationType === "emergency-meeting") return ['WhatsappChannel']
      const channelObjs = [{ type: 'happy-birthday', channels: ['EmailChannel', 'UIChannel'] }].find((channel: any) => channel.type === data.notificationType);

      if (channelObjs) return channelObjs['channels'];
      return channels


    }
  }

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelFactoryService],

      exports: [ChannelFactoryService]
    }).overrideProvider(ChannelFactoryService).useValue(mockChannelFactoryService).compile();

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
      expect(await mockChannelFactoryService.delegateChannel(notificationData)).toMatchObject({ statusCode: 400 })
    });
    it("should return a response with statusCode 200 if it is called with  data that contains notificationType, userId,companyId and the user is not unsubscribed", async () => {
      const notificationData = {
        "userId": "6",
        "companyId": "3",

        "notificationType": "happy-birthday"
      }
      expect(await mockChannelFactoryService.delegateChannel(notificationData)).toMatchObject({ statusCode: 200 })
    });
    it("should return a response with statusCode 404 if the channel for the notification is not found", async () => {
      const notificationData = {
        "userId": "6",
        "companyId": "3",

        "notificationType": "emergency-meeting"
      }
      expect(await mockChannelFactoryService.delegateChannel(notificationData)).toMatchObject({ statusCode: 404 })
    });
  })
  describe("getChannelType", () => {
    it("it should return empty list if empty object  or no notificationType is passed throgh it ", async () => {
      expect(await (await mockChannelFactoryService.getChannelType({ companyId: "", userId: "", notificationType: "" })).length).toEqual(0)
    });
    it("it should return a list if object with valid key-value pairs is passed throgh it ", async () => {
      expect(await (await mockChannelFactoryService.getChannelType({ companyId: "3", userId: "6", notificationType: "happy-birthday" })).length).toBeGreaterThan(0)
    })
  })
});
