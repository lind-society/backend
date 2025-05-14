import {
  FLOOR_PLANS_CONFIG,
  PHOTOS_CONFIG,
  VIDEO_360S_CONFIG,
  VIDEOS_CONFIG,
} from '@apps/main/common/constants';
import {
  imageFileFilter,
  videoFileFilter,
} from '@apps/main/common/validations/file-allowed.validation';
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
    FilesInterceptor('files', PHOTOS_CONFIG.quantity, {
      limits: {
        files: PHOTOS_CONFIG.quantity,
        fileSize: PHOTOS_CONFIG.size,
      },
      fileFilter: imageFileFilter,
    }),
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
    FilesInterceptor('files', VIDEOS_CONFIG.quantity, {
      limits: {
        files: VIDEOS_CONFIG.quantity,
        fileSize: VIDEOS_CONFIG.size,
      },
      fileFilter: videoFileFilter,
    }),
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
    FilesInterceptor('files', VIDEO_360S_CONFIG.quantity, {
      limits: {
        files: VIDEO_360S_CONFIG.quantity,
        fileSize: VIDEO_360S_CONFIG.size,
      },
      fileFilter: videoFileFilter,
    }),
  )
  async uploadVideo360s(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() payload: UploadFileRequestDto,
  ) {
    const receivedFiles = this.storageService.mapFiles(files, payload.key);

    const result = await this.storageService.uploadFiles(receivedFiles);

    return new UploadFileSuccessResponse(result);
  }

  @Post('floor-plans')
  @UseInterceptors(
    FilesInterceptor('files', FLOOR_PLANS_CONFIG.quantity, {
      limits: {
        files: FLOOR_PLANS_CONFIG.quantity,
        fileSize: FLOOR_PLANS_CONFIG.size,
      },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadFloorPlans(
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

  @Post()
  async deleteFile(@Body() payload: DeleteFileDto) {
    await this.storageService.deleteFile(payload);

    return new DeleteResponse('delete file success');
  }
}
