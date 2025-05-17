import { Module } from '@nestjs/common';
import { rabbitmqProvider } from './rabbitmq.provider';
import { AppService } from './app.service';

@Module({
  providers: [AppService, rabbitmqProvider],
})
export class AppModule {}
