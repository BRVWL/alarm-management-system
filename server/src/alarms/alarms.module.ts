import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmsController } from './alarms.controller';
import { AlarmsService } from './alarms.service';
import { Alarm } from './entities/alarm.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Alarms')
@Module({
  imports: [TypeOrmModule.forFeature([Alarm])],
  controllers: [AlarmsController],
  providers: [AlarmsService],
})
export class AlarmsModule {}
