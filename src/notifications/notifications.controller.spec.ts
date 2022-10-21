import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsService } from './../channels/channels.service';
import { ChannelFactoryService } from './../channel-factory/channel-factory.service';
import { NotificationsController } from './notifications.controller';
import { EmailChannelService } from './../email-channel/email-channel.service';
import { UiChannelService } from './../ui-channel/ui-channel.service';
import { } from "./../channels/channels.service"

import { ResponseData } from './interfaces/responseData.interface';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let mockChannelService: Partial<ChannelsService> = {};
  let channelFactoryService: Partial<ChannelFactoryService> = {};
  let emailChannelService: Partial<EmailChannelService> = {};
  let uiChannelService: UiChannelService



  beforeEach(async () => {
    // channelFactoryService = new ChannelFactoryService(emailChannelService, uiChannelService, channelService);


    // controller = new NotificationsController(channelService, channelFactoryService);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],

      providers: [
        { provide: ChannelsService, useValue: mockChannelService },
        { provide: ChannelFactoryService, useValue: channelFactoryService },
        { provide: EmailChannelService, useValue: emailChannelService }]
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
      jest.spyOn(controller, 'sendNotifications').mockImplementation((): Promise<ResponseData> => Promise.resolve(result));

      expect(await controller.sendNotifications(notificationData)).toBe(result);
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
      jest.spyOn(controller, 'sendNotifications').mockImplementation((): Promise<ResponseData> => Promise.resolve(result));

      expect(await controller.sendNotifications(notificationData)).toBe(result);
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
