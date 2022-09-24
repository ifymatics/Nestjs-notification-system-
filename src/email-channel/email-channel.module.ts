import { Module } from '@nestjs/common';
import { ChannelsModule } from '../channels/channels.module';
import { ChannelsService } from 'src/channels/channels.service';
import { EmailChannelService } from './email-channel.service';

@Module({
  exports: [EmailChannelService],
  imports: [ChannelsModule],
  providers: [EmailChannelService,]
})
export class EmailChannelModule { }
