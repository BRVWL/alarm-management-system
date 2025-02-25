import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmsController } from './alarms.controller';
import { AlarmsService } from './alarms.service';
import { Alarm } from './entities/alarm.entity';
import { ApiTags } from '@nestjs/swagger';
import { Sensor } from '../sensors/entities/sensor.entity';

@ApiTags('Alarms')
@Module({
  imports: [TypeOrmModule.forFeature([Alarm, Sensor])],
  controllers: [AlarmsController],
  providers: [AlarmsService],
  exports: [AlarmsService],
})
export class AlarmsModule {}
