import { Module } from '@nestjs/common';
import { ChannelsModule } from '../channels/channels.module';
import { ChannelsService } from 'src/channels/channels.service';
import { UiChannelService } from './ui-channel.service';

@Module({
  exports: [UiChannelService],
  imports: [ChannelsModule],
  providers: [UiChannelService]
})
export class UiChannelModule { }
