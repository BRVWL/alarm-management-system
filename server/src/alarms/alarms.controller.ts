import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AlarmsService } from './alarms.service';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { AlarmResponseDto } from './dto/alarm-response.dto';
import { GetAlarmsQueryDto } from './dto/get-alarms-query.dto';

@ApiTags('Alarms')
@Controller('alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all alarms',
    description:
      'Get alarms with pagination, sorting by timestamp (newest first), and optional type filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'List of alarms with pagination metadata',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/AlarmResponseDto' },
        },
        total: {
          type: 'number',
          description: 'Total number of alarms matching the filter',
        },
      },
    },
  })
  getAlarms(
    @Query() query: GetAlarmsQueryDto,
  ): Promise<{ data: AlarmResponseDto[]; total: number }> {
    return this.alarmsService.findAll(query);
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
