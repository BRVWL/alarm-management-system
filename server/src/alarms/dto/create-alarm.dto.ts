import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID, IsNotEmpty } from 'class-validator';
import { AlarmType } from '../entities/alarm.entity';

export class CreateAlarmDto {
  @ApiProperty({
    description: 'The type of alarm',
    enum: AlarmType,
    example: AlarmType.MOTION,
  })
  @IsEnum(AlarmType)
  type: AlarmType;

  @ApiProperty({
    description: 'The ID of the sensor that triggered this alarm',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  sensorId: string;
}
