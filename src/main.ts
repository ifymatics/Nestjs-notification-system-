import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications/notifications.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  await app.listen(3000);
}
bootstrap();
