import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, AuthModule, MenuModule, OrderModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath:
    process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env'
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
