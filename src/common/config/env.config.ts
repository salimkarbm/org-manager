import { config } from 'dotenv';

config();

export const dbConfig = {
  DB_DRIVER: process.env.DB_DRIVER as 'postgres',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
};

export const envConfig = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
};
