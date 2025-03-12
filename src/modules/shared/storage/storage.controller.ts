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
import { DeleteResponse } from '../dto';
import { DeleteFileDto } from './dto/delete-file.dto';
import {
  GetFileUrlDto,
  GetFileUrlSuccessResponse,
} from './dto/get-file-url.dto';
import {
  UploadFileRequestDto,
  UploadFileSuccessResponse,
} from './dto/upload-file.dto';
import { IReceivedFile } from './interfaces/file-detail.interface';
import { StorageService } from './storage.service';

@Controller('storages')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() payload: UploadFileRequestDto,
  ) {
    const receivedFiles: IReceivedFile[] = files.map((file) => ({
      key: payload.key,
      file: file.buffer,
      mimeType: file.mimetype,
      originalName: file.originalname,
    }));

    const result = await this.storageService.uploadFile(receivedFiles);

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
