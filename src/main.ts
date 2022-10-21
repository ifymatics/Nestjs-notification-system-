import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications/notifications.module';
import { ValidationPipe } from "@nestjs/common"
async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
