import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertApiDto } from './create-alert-api.dto';

export class UpdateAlertApiDto extends PartialType(CreateAlertApiDto) {}
