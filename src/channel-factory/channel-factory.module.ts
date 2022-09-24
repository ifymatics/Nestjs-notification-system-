import { Module } from '@nestjs/common';
import { ChannelsModule } from '../channels/channels.module';
import { ChannelsService } from '../channels/channels.service';
import { EmailChannelModule } from './../email-channel/email-channel.module';
import { UiChannelModule } from './../ui-channel/ui-channel.module';
import { ChannelFactoryService } from './channel-factory.service';

@Module({
  providers: [ChannelFactoryService, ChannelsService],
  imports: [EmailChannelModule, UiChannelModule, ChannelsModule],
  exports: [ChannelFactoryService, ChannelsService]
})
export class ChannelFactoryModule { }
