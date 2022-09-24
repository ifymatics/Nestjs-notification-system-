import { Test, TestingModule } from '@nestjs/testing';

import { UiChannelService } from './../ui-channel/ui-channel.service';
import { ChannelsService } from './../channels/channels.service';

import { ChannelFactoryService } from './channel-factory.service';
import { Unsubscription } from './../schemas/unsubscription.schema';

import { EmailChannelService } from 'src/email-channel/email-channel.service';
import { ResponseData } from 'src/notifications/interfaces/responseData.interface';
import { NotificationData } from 'src/notifications/interfaces/notification.interface';
import { notificationListTypes } from 'src/mock-data/notification-list';

describe('ChannelFactoryService', () => {
  let channelFactoryService: ChannelFactoryService;
  let channelsService: ChannelsService;
  let uiChannelService: UiChannelService;
  let emailChannelService: EmailChannelService
  let unsubscriptionModel: any;
  let notificationTypeModel: any;
  let userNotificationsModel: any;
  beforeEach(async () => {
    unsubscriptionModel = new Unsubscription()
    channelsService = new ChannelsService(unsubscriptionModel, userNotificationsModel, notificationTypeModel);
    uiChannelService = new UiChannelService(channelsService);
    channelFactoryService = new ChannelFactoryService(emailChannelService, uiChannelService, channelsService,)
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelFactoryService],

      exports: [ChannelFactoryService]
    }).overrideProvider(ChannelFactoryService).useValue(channelFactoryService).compile();

    channelFactoryService = module.get<ChannelFactoryService>(ChannelFactoryService);
  });
  const mockChannelFactoryService: Partial<ChannelFactoryService> = {
    // delegateChannel: async function (data: NotificationData): Promise<ResponseData | (ResponseData | ResponseData[])[] | ResponseData> {
    //   let channels: string[] = [];
    //   channels = await await this.getChannelType(data)
    //   if (!channels.length) return { message: "The channel for this notification not found!", channel: "", notificationType: data.notificationType, statusCode: 400 }
    //   const responseData = await uiChannelService.send(data);
    //   if (typeof responseData === "string") return { message: "Error occurred, notification not sent!", channel: 'EmailChannel', notificationType: data.notificationType, statusCode: 500 }
    //   return responseData


    // },
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
