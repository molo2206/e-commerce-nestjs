/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as xlsx from 'xlsx';
import { ExcelEntity } from './entities/excel.entity';

@Injectable()
export class ExcelService {
  constructor(
    @InjectRepository(ExcelEntity)
    private excelRepository: Repository<ExcelEntity>,
  ) {}

  async validateAndSaveExcel(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni.');
    }

    // Lire le fichier Excel
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = xlsx.utils.sheet_to_json(worksheet);

    // Définir les colonnes requises
    const requiredColumns = ['name', 'price', 'category'];
    const errors: string[] = [];

    jsonData.forEach((row, index) => {
      requiredColumns.forEach((col) => {
        if (!row[col] || row[col].toString().trim() === '') {
          errors.push(`Ligne ${index + 2}: La colonne '${col}' est vide.`);
        }
      });
    });

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Le fichier contient des erreurs',
        details: errors,
      });
    }

    // Enregistrer dans la base de données
    const savedData = await this.excelRepository.save(jsonData);

    return { message: 'Données enregistrées avec succès', data: savedData };
  }
}
