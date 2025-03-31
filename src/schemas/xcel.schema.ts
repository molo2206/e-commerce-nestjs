/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Excel extends Document {
  @Prop({ required: true })
  columnName: string;

  @Prop({ required: true })
  value: string;
}

export const ExcelSchema = SchemaFactory.createForClass(Excel);
