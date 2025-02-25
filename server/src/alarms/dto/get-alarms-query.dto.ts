import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsInt, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { AlarmType } from '../entities/alarm.entity';

export class GetAlarmsQueryDto {
  @ApiProperty({
    description: 'Filter alarms by type',
    enum: AlarmType,
    required: false,
  })
  @IsOptional()
  @IsEnum(AlarmType)
  type?: AlarmType;

  @ApiProperty({
    description: 'Filter alarms by sensor ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  sensorId?: string;

  @ApiProperty({
    description: 'Page number (1-based)',
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
