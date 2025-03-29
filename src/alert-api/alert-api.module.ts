/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AlertApiService } from './alert-api.service';
import { AlertApiController } from './alert-api.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule], // Ajoutez HttpModule dans imports
  controllers: [AlertApiController],
  providers: [AlertApiService],
})
export class AlertApiModule { }
