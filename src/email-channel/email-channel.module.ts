import { Module } from '@nestjs/common';
import { ChannelsModule } from '../channels/channels.module';
import { EmailChannelService } from './email-channel.service';

@Module({
  exports: [EmailChannelService],
  imports: [ChannelsModule],
  providers: [EmailChannelService,]
})
export class EmailChannelModule { }
