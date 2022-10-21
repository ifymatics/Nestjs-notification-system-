import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChannelFactoryService } from './../channel-factory/channel-factory.service';
import { ChannelsService } from "../channels/channels.service";
import { SendNotifications } from "./dtos/send-notifications.dto"

@Controller('notifications')
export class NotificationsController {
    constructor(private notificationsService: ChannelsService, private channelFactoryService: ChannelFactoryService) {

    }
    @Post()
    async sendNotifications(@Body() body: SendNotifications) {

        const result = await this.channelFactoryService.delegateChannel(body)
        return result
    }
    @Get("/:receiverId")
    async getUserNotifications(@Param("receiverId") receiverId: string) {

        const userNotifications = await this.notificationsService.getUserNotifications(receiverId);
        return userNotifications;
    }

}
