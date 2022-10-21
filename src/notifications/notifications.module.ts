import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';

import { ChannelFactoryModule } from './../channel-factory/channel-factory.module';


@Module({

  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest'), ChannelFactoryModule],

  controllers: [NotificationsController]
})
export class NotificationsModule { }
//mongodb://root:pass12345@mongodb:27017/notification-system?serverSelectionTimeoutMS=2000&authSource=admin
//mongodb://mongodb:27017/testDb?gssapiServiceName=mongodb
//mongodb://127.0.0.1:27017/nest
//mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/