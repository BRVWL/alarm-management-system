import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VisualizationsService } from './visualizations.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlarmsService } from 'src/alarms/alarms.service';
import { VisualizationResponseDto } from './dto/visualization-response.dto';
import { CreateVisualizationDto } from './dto/create-visualization.dto';

@ApiTags('Visualizations')
@ApiBearerAuth('access-token')
@Controller('visualizations')
export class VisualizationsController {
  constructor(
    private readonly visualizationsService: VisualizationsService,
    private readonly alarmsService: AlarmsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all visualizations' })
  @ApiResponse({
    status: 200,
    description: 'List of all visualizations',
    type: [VisualizationResponseDto],
  })
  findAll(): Promise<VisualizationResponseDto[]> {
    return this.visualizationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a visualization by ID' })
  @ApiResponse({
    status: 200,
    description: 'The visualization',
    type: VisualizationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Visualization not found' })
  findOne(@Param('id') id: string): Promise<VisualizationResponseDto> {
    return this.visualizationsService.findOne(id);
  }

  @Post(':alarmId')
  @ApiOperation({
    summary: 'Upload a visualization image for an alarm',
    description:
      'Upload an image file and associate it with the alarm specified by alarmId in the URL',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateVisualizationDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The visualization has been created successfully',
    type: VisualizationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Alarm not found' })
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('alarmId') alarmId: string,
  ): Promise<VisualizationResponseDto> {
    const alarm = await this.alarmsService.findOne(alarmId);

    if (!alarm) {
      throw new NotFoundException(`Alarm with ID ${alarmId} not found`);
    }

    return this.visualizationsService.create(
      alarmId,
      file.filename,
      `/uploads/visualizations/${file.filename}`,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a visualization by ID' })
  @ApiResponse({
    status: 200,
    description: 'The visualization has been deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Visualization not found' })
  delete(@Param('id') id: string) {
    return this.visualizationsService.delete(id);
  }
}
