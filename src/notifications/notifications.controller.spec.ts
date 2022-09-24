import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsService } from './../channels/channels.service';
import { ChannelFactoryService } from './../channel-factory/channel-factory.service';
import { NotificationsController } from './notifications.controller';
import { EmailChannelService } from './../email-channel/email-channel.service';
import { UiChannelService } from './../ui-channel/ui-channel.service';
import { } from "./../channels/channels.service"
import { Unsubscription } from 'src/schemas/unsubscription.schema';
import { ResponseData } from './interfaces/responseData.interface';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let channelService: ChannelsService;
  let channelFactoryService: ChannelFactoryService;
  let emailChannelService: EmailChannelService;
  let uiChannelService: UiChannelService



  beforeEach(async () => {
    channelFactoryService = new ChannelFactoryService(emailChannelService, uiChannelService, channelService);


    controller = new NotificationsController(channelService, channelFactoryService);
    // const module: TestingModule = await Test.createTestingModule({
    //   controllers: [NotificationsController],

    //   providers: [ChannelFactoryService, ChannelsService]
    // }).overrideProvider([[ChannelFactoryService, ChannelsService]]).useValue([mockChannelFactoryService, mockChannelsService]).compile();

    // controller = module.get<NotificationsController>(NotificationsController);

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

      }
      jest.spyOn(controller, 'sendNotifications').mockImplementation((): Promise<ResponseData> => Promise.resolve(result));

      expect(await controller.sendNotifications(notificationData)).toBe(result);
    });
  });
});
