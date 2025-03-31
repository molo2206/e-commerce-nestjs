/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { ApiClientsService } from './api-clients.service';

@Controller('api-clients')
export class ApiClientsController {
  constructor(private readonly apiClientsService: ApiClientsService) { }

  @Get('alerts')
  async fetchAlerts() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.apiClientsService.getAlerts();
  }
}
