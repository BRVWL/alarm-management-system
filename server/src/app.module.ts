import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { AuthModule } from './auth/auth.module';
import { AlarmsModule } from './alarms/alarms.module';
import { config } from './config/db.config';

@Module({
  imports: [AuthModule, AlarmsModule, TypeOrmModule.forRoot(config)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
