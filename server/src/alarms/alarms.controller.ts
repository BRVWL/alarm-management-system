import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Alarm } from './entities/alarm.entity';
import { AlarmsService } from './alarms.service';

@ApiTags('Alarms')
@Controller('alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all alarms' })
  getAlarms(): Promise<Alarm[]> {
    return this.alarmsService.findAll();
  }
}
