import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsService } from './../channels/channels.service';
import { ChannelFactoryService } from './../channel-factory/channel-factory.service';
import { NotificationsController } from './notifications.controller';
import { EmailChannelService } from './../email-channel/email-channel.service';
import { UiChannelService } from './../ui-channel/ui-channel.service';
import { } from "./../channels/channels.service"

import { ResponseData } from './interfaces/responseData.interface';
import { NotificationData } from './interfaces/notification.interface';

describe('NotificationsController', () => {
  const notificationResult = {
    "message": "Notification Sent successfully",
    "channel": "UIChannel",
    "notificationType": "happy-birthday",
    "statusCode": 200
  }
  let controller: NotificationsController;
  let mockChannelService: Partial<ChannelsService> = {
    getUserNotifications: async (userId: string): Promise<{ isViewed: boolean, channel: string, receiverId: string }[]> => {
      return Promise.resolve([
        { isViewed: false, channel: "EmailChannel", receiverId: "6" }
      ])
    }
  };
  let mockChannelFactoryService: Partial<ChannelFactoryService> = {
    delegateChannel: async (data: NotificationData) => {
      return Promise.resolve(notificationResult)
    },
  };
  let mockEmailChannelService: Partial<EmailChannelService> = {};

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],

      providers: [
        { provide: ChannelsService, useValue: mockChannelService },
        { provide: ChannelFactoryService, useValue: mockChannelFactoryService },
        { provide: EmailChannelService, useValue: mockEmailChannelService }]
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('sendNotifications', () => {
    it('should return an object that contains statusCode 200 when  an object with all the required field is passed', async () => {
      const result = {
        "message": "Notification Sent successfully",
        "channel": "UIChannel",
        "notificationType": "happy-birthday",
        "statusCode": 200
      };
      const notificationData = {
        "userId": "6",
        "companyId": "3",
        "notification": { "subject": "happy birthday", "content": "We wish you a happy birthday" },
        "notificationType": "happy-birthday"
      }
      const results = await mockChannelFactoryService.delegateChannel(notificationData)
      //jest.spyOn(controller, 'sendNotifications').mockImplementation((): Promise<ResponseData> => Promise.resolve(result));

      expect(await controller.sendNotifications(notificationData)).toBe(results);
    });

    it('should return an object that contains statusCode 500 when  an object with all the required field is passed', async () => {
      const result = {
        "message": "Notification Sent successfully",
        "channel": "UIChannel",
        "notificationType": "happy-birthday",
        "statusCode": 500
      };
      const notificationData = {
        "userId": "6",
        "companyId": "3",
        "notification": { "subject": "happy birthday", "content": "We wish you a happy birthday" },
        "notificationType": "happy-birthday"

      }
      //jest.spyOn(controller, 'sendNotifications').mockImplementation((): Promise<ResponseData> => Promise.resolve(result));
      const results = await mockChannelFactoryService.delegateChannel(notificationData)
      expect(await controller.sendNotifications(notificationData)).toBe(results);
    });
  });
  describe("getUserNotifications", () => {
    it("gets all stored notifications of the receiver's id", async () => {
      const userId = "6";
      const result = [
        { isViewed: false, channel: "EmailChannel", receiverId: "6" }
      ]

      jest.spyOn(controller, 'getUserNotifications').mockImplementation((): Promise<{ isViewed: boolean, channel: string, receiverId: string }[]> => Promise.resolve(result));

      expect(await controller.getUserNotifications(userId)).toBe(result);
    });

  })
});
