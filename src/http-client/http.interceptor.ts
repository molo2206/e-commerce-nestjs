/* eslint-disable prettier/prettier */
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Observable, catchError } from 'rxjs';
  
  @Injectable()
  export class HttpErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        catchError((error) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          console.error('Erreur API externe:', error.message);
          throw new HttpException(
            'Erreur lors de la communication avec l’API externe',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      );
    }
  }
  