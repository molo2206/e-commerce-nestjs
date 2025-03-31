import { PartialType } from '@nestjs/mapped-types';
import { CreateHttpClientDto } from './create-http-client.dto';

export class UpdateHttpClientDto extends PartialType(CreateHttpClientDto) {}
