/* eslint-disable prettier/prettier */
import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';
import * as multer from 'multer';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
          return cb(new BadRequestException('Seuls les fichiers Excel sont autorisés !'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    return this.excelService.validateAndSaveExcel(file);
  }
}
