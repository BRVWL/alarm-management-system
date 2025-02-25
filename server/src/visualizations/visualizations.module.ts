import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visualization } from './entities/visualization.entity';
import { VisualizationsController } from './visualizations.controller';
import { VisualizationsService } from './visualizations.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiTags } from '@nestjs/swagger';
import { AlarmsModule } from '../alarms/alarms.module';

@ApiTags('Visualizations')
@Module({
  imports: [
    TypeOrmModule.forFeature([Visualization]),
    AlarmsModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/visualizations',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + uuidv4();
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  ],
  controllers: [VisualizationsController],
  providers: [VisualizationsService],
})
export class VisualizationsModule {}
