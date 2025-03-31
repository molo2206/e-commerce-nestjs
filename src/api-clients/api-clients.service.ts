/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { HttpClientService } from '../http-client/http-client.service';

@Injectable()
export class ApiClientsService {
  constructor(private readonly httpClientService: HttpClientService) { }

  async getAlerts() {
    const response = await this.httpClientService.get('/alert/all/cumul?type=cases&province=99d9283b-3123-4c3d-8198-bf5f20a7a773');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data;
  }
}
