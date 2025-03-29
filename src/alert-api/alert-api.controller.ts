/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlertApiService } from './alert-api.service';
import { UpdateAlertApiDto } from './dto/update-alert-api.dto';

@Controller('alerts')
export class AlertApiController {
  constructor(private readonly alertApiService: AlertApiService) { }

  @Post()
  async create() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return await this.alertApiService.getAlertData();
  }

  @Get('external-data')
  async findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.alertApiService.getAlertData();
  }
  // @Get()
  // findAll() {
  //   return this.alertApiService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertApiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertApiDto: UpdateAlertApiDto) {
    return this.alertApiService.update(+id, updateAlertApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertApiService.remove(+id);
  }
}
