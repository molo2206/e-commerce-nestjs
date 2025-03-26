/* eslint-disable prettier/prettier */
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();
export const dataSourceOptions: DataSourceOptions = {
  // type: "mysql",
  // host: process.env.DB_HOST,
  // port: Number(process.env.DB_PORT),
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_DATABASE,
  // entities: ['dist/**/*.entity{.ts,.js}'],
  // migrations: [],
  // logging: false,
  // synchronize: true
  type: 'mysql',
  host: '127.0.0.1', // ✅ Remplace localhost par cette adresse
  port: 3306,
  username: 'root',
  password: '',
  database: 'nest',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  logging: false,
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
