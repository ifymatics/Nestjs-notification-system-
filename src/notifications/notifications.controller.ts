import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChannelFactoryService } from './../channel-factory/channel-factory.service';
import { ChannelsService } from "../channels/channels.service"

@Controller('notifications')
export class NotificationsController {
    constructor(private notificationsService: ChannelsService, private channelFactoryService: ChannelFactoryService) {

    }
    @Post()
    async sendNotifications(@Body() body: any) {

        const result = await this.channelFactoryService.delegateChannel(body)
        return result
    }
    @Get("/:userId")
    async getUserNotifications(@Param("userId") receiverId: string) {

        const userNotifications = await this.notificationsService.getUserNotifications(receiverId);
        return userNotifications;
    }

}
