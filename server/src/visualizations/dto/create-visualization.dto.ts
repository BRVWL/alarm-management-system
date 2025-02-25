import { ApiProperty } from '@nestjs/swagger';

export class CreateVisualizationDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The image file to upload (jpg, jpeg, or png)',
  })
  image: Express.Multer.File;
}
