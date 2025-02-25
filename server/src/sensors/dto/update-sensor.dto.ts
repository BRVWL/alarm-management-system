import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateSensorDto {
  @ApiProperty({
    description: 'The name of the sensor',
    example: 'Living Room Motion Sensor',
    minLength: 3,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  name?: string;

  @ApiProperty({
    description: 'The location of the sensor',
    example: 'Living Room - North Wall',
    minLength: 3,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  location?: string;
}
