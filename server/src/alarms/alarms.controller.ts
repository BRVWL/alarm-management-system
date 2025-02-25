import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AlarmsService } from './alarms.service';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { AlarmResponseDto } from './dto/alarm-response.dto';

@ApiTags('Alarms')
@Controller('alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all alarms' })
  @ApiResponse({
    status: 200,
    description: 'List of all alarms',
    type: [AlarmResponseDto],
  })
  getAlarms(): Promise<AlarmResponseDto[]> {
    return this.alarmsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get alarm by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found alarm',
    type: AlarmResponseDto,
  })
  getAlarmById(@Param('id') id: string): Promise<AlarmResponseDto> {
    return this.alarmsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new alarm' })
  @ApiResponse({
    status: 201,
    description: 'The alarm has been successfully created',
    type: AlarmResponseDto,
  })
  createAlarm(
    @Body() createAlarmDto: CreateAlarmDto,
  ): Promise<AlarmResponseDto> {
    return this.alarmsService.create(createAlarmDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an alarm by ID' })
  @ApiResponse({
    status: 200,
    description: 'The alarm has been successfully deleted',
  })
  deleteAlarm(@Param('id') id: string): Promise<void> {
    return this.alarmsService.delete(id);
  }
}
