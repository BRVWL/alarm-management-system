import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { config } from './config/db.config';
import { AuthModule } from './auth/auth.module';
import { AlarmsModule } from './alarms/alarms.module';
import { VisualizationsModule } from './visualizations/visualizations.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    AuthModule,
    AlarmsModule,
    VisualizationsModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
