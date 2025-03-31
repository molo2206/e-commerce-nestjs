/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ApiClientsController } from './api-clients.controller';
import { ApiClientsService } from './api-clients.service';
import { HttpClientModule } from '../http-client/http-client.module';

@Module({
  imports: [HttpClientModule], // Import du module HttpClient pour les requêtes externes
  controllers: [ApiClientsController],
  providers: [ApiClientsService],
  exports: [ApiClientsService],
})
export class ApiClientsModule { }
