import {
  FLOOR_PLANS_CONFIG,
  PHOTOS_CONFIG,
  VIDEO_360S_CONFIG,
  VIDEOS_CONFIG,
} from '@apps/main/common/constants';
import { Public } from '@apps/main/common/decorators';
import {
  imageFileFilter,
  videoFileFilter,
} from '@apps/main/common/validations/file-allowed.validation';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards';
import { DeleteResponse } from '../dto/custom-responses';
import {
  DeleteFileDto,
  GetFileUrlDto,
  GetFileUrlSuccessResponse,
  UploadFileRequestDto,
  UploadFileSuccessResponse,
} from './dto';
import { StorageService } from './storage.service';

@UseGuards(JwtAuthGuard)
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
  async getFileUrl(@Body() payload: GetFileUrlDto) {
    const result = await this.storageService.getFileUrl(payload);

    return new GetFileUrlSuccessResponse(result);
  }

  // Only reachable when the active provider implements getFileStream (S3 /
  // Garage) — see the comment on IStorageProvider.getFileStream for why this
  // route exists: it lets one storage backend with no public URL of its own
  // be served through this app's own (already-public) origin instead of
  // needing a second tunnel just for files.
  @Public()
  @Get('files/*key')
  async getFile(
    @Param('key') key: string | string[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // path-to-regexp gives wildcard segments as an array in some Express/Nest
    // versions and a single slash-joined string in others — handle both.
    const resolvedKey = Array.isArray(key)
      ? key.join('/')
      : key || req.params[0];

    const { stream, contentType, contentLength } =
      await this.storageService.getFileStream(resolvedKey);

    if (contentType) res.setHeader('Content-Type', contentType);
    if (contentLength) res.setHeader('Content-Length', contentLength);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    stream.pipe(res);
  }

  @Post()
  async deleteFile(@Body() payload: DeleteFileDto) {
    await this.storageService.deleteFile(payload);

    return new DeleteResponse('delete file success');
  }
}
