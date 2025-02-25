import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateSensorDto {
  @ApiProperty({
    description: 'The name of the sensor',
    example: 'Living Room Motion Sensor',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'The location of the sensor',
    example: 'Living Room - North Wall',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  location: string;
}
