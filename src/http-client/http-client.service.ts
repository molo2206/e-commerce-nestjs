/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class HttpClientService {
  private axiosInstance: AxiosInstance;

  // Ajouter un intercepteur pour ajouter dynamiquement le token si nécessaire
  // constructor() {
  //   this.axiosInstance = axios.create({
  //     baseURL: process.env.BASE_URL_PRODUCTION || process.env.BASE_URL_LOCAL,
  //     timeout: 50000,
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       Authorization: process.env.TOKEN ? `Bearer ${process.env.TOKEN}` : '',
  //       'User-Agent': 'MyApp/1.0 (NestJS)',
  //       'X-Request-ID': Math.random().toString(36).substring(7), // ID unique par requête
  //       'Cache-Control': 'no-cache',
  //     },
  //   });
  
  //   // Ajouter un intercepteur pour ajouter dynamiquement le token si nécessaire
  //   this.axiosInstance.interceptors.request.use((config) => {
  //     const token = localStorage.getItem('TOKEN_OBJECT_NAME');
  //     if (token) {
  //       config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
  //     }
  //     return config;
  //   }, (error) => Promise.reject(error));
  // }

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.BASE_URL_PRODUCTION || process.env.BASE_URL_PRODUCTION,
      timeout: 50000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Interceptor pour les réponses
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      (error) => Promise.reject(error),
    );
  }

  async get(url: string) {
    return await this.axiosInstance.get(url);
  }

  async post(url: string, body: any, headers?: object) {
    return await this.axiosInstance.post(url, body, { headers });
  }

  async put(url: string, body: any, headers?: object) {
    return await this.axiosInstance.put(url, body, { headers });
  }

  async delete(url: string) {
    return await this.axiosInstance.delete(url);
  }
}
