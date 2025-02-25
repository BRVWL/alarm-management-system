import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AlarmType } from '../entities/alarm.entity';

export class CreateAlarmDto {
  @ApiProperty({
    description: 'The type of alarm',
    enum: AlarmType,
    example: AlarmType.MOTION,
  })
  @IsEnum(AlarmType)
  type: AlarmType;
}
