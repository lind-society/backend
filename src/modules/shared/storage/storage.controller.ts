import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { megabyteToByte } from 'src/common/helpers';
import { DeleteResponse } from '../dto/custom-responses';
import {
  DeleteFileDto,
  GetFileUrlDto,
  GetFileUrlSuccessResponse,
  UploadFileRequestDto,
  UploadFileSuccessResponse,
} from './dto';
import { StorageService } from './storage.service';

@Controller('storages')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('photos')
  @UseInterceptors(
    FilesInterceptor(
      'files',
      megabyteToByte(parseInt(process.env.PHOTOS_LIMIT_QUANTITY, 10)) |
        megabyteToByte(10),
      {
        limits: { fileSize: parseInt(process.env.PHOTOS_LIMIT_SIZE, 10) | 2 },
      },
    ),
  )
  async uploadPhotos(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() payload: UploadFileRequestDto,
  ) {
    const receivedFiles = this.storageService.mapFiles(files, payload.key);

    const result = await this.storageService.uploadFiles(receivedFiles);

    return new UploadFileSuccessResponse(result);
  }

  @Post('videos')
  @UseInterceptors(
    FilesInterceptor(
      'files',
      parseInt(process.env.VIDEOS_LIMIT_QUANTITY, 10) | 5,
      {
        limits: {
          fileSize:
            megabyteToByte(parseInt(process.env.VIDEOS_LIMIT_SIZE, 10)) |
            megabyteToByte(20),
        },
      },
    ),
  )
  async uploadVideos(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() payload: UploadFileRequestDto,
  ) {
    const receivedFiles = this.storageService.mapFiles(files, payload.key);

    const result = await this.storageService.uploadFiles(receivedFiles);

    return new UploadFileSuccessResponse(result);
  }

  @Post('video360s')
  @UseInterceptors(
    FilesInterceptor(
      'files',
      parseInt(process.env.VIDEO360S_LIMIT_QUANTITY, 10) | 5,
      {
        limits: {
          fileSize:
            megabyteToByte(parseInt(process.env.VIDEO360S_LIMIT_SIZE, 10)) |
            megabyteToByte(30),
        },
      },
    ),
  )
  async uploadVideo360s(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() payload: UploadFileRequestDto,
  ) {
    const receivedFiles = this.storageService.mapFiles(files, payload.key);

    const result = await this.storageService.uploadFiles(receivedFiles);

    return new UploadFileSuccessResponse(result);
  }

  @Get()
  getFileUrl(@Body() payload: GetFileUrlDto) {
    const result = this.storageService.getFileUrl(payload);

    return new GetFileUrlSuccessResponse(result);
  }

  @Delete()
  async deleteFile(@Body() payload: DeleteFileDto) {
    console.log({ payload });
    await this.storageService.deleteFile(payload);

    return new DeleteResponse('delete file success');
  }
}
