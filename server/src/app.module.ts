import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

// Modules
import { config } from './config/db.config';
import { AuthModule } from './auth/auth.module';
import { AlarmsModule } from './alarms/alarms.module';
import { VisualizationsModule } from './visualizations/visualizations.module';
import { MulterModule } from '@nestjs/platform-express';
import { SensorsModule } from './sensors/sensors.module';
import { GlobalAuthGuard } from './auth/guards/global-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    AuthModule,
    AlarmsModule,
    VisualizationsModule,
    MulterModule.register({
      dest: './uploads',
    }),
    SensorsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule {}
