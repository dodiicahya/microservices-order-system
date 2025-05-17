import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { rabbitmqProvider } from './rabbitmq.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './app.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://postgres:postgres@postgres:5432',
      entities: [Inventory],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Inventory]),
  ],
  providers: [AppService, rabbitmqProvider],
})
export class AppModule {}
