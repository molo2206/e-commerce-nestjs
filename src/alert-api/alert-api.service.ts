/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlertApiDto } from './dto/create-alert-api.dto';
import { UpdateAlertApiDto } from './dto/update-alert-api.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map, Observable, throwError } from 'rxjs';

@Injectable()
export class AlertApiService {
  constructor(private readonly httpService: HttpService) { }

  async createResource(data: any): Promise<any> {
    const apiUrl = `${process.env.EXTERNAL_API_URL}/endpoint`; // Remplacez par l'URL de l'API externe

    try {
      const response = await lastValueFrom(
        this.httpService.post(apiUrl, data, {
          headers: {
            'Content-Type': 'application/json',
            // Ajoutez d'autres en-têtes si nécessaire
          },
        }).pipe(
          map(resp => resp.data),
          catchError((error) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error('Erreur lors de l’appel POST à l’API externe:', error.response || error.message);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            return throwError(() => new HttpException('Erreur lors de l’appel à l’API externe', HttpStatus.BAD_GATEWAY));
          })
        )
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  async getAlertData(): Promise<any> {
    const apiUrl = `${process.env.APIURL_LOCAL}/alert/all/cumul?type=cases&province=99d9283b-3123-4c3d-8198-bf5f20a7a773`;

    try {
      const response = await lastValueFrom(
        this.httpService.get(apiUrl).pipe(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          map(resp => resp.data),
          catchError((error) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error('Erreur lors de la récupération des données:', error.response || error.message);
            return throwError(() => new Error('Erreur lors de la récupération des données'));
          })
        )
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  findAll() {
    return `This action returns all alertApi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alertApi`;
  }

  update(id: number, updateAlertApiDto: UpdateAlertApiDto) {
    return `This action updates a #${id} alertApi`;
  }

  remove(id: number) {
    return `This action removes a #${id} alertApi`;
  }
}
