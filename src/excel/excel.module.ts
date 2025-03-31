/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExcelEntity } from './entities/excel.entity';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExcelEntity])],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
