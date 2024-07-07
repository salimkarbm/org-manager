import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../../../modules/users/user.entity';
import { Organisation } from '../../../modules/organization/organization.entity';
import { dbConfig } from '../env.config';

export const datastore: DataSourceOptions = {
  // TypeORM PostgreSQL DB Drivers
  type: dbConfig.DB_DRIVER,
  url: dbConfig.DB_URL,
  //   host: dbConfig.DB_HOST,
  //   port: dbConfig.DB_PORT,
  //   username: dbConfig.DB_USERNAME,
  //   password: dbConfig.DB_PASSWORD,
  //   database: dbConfig.DB_DATABASE,
  // Synchronize database schema with entities
  synchronize: process.env.NODE_ENV !== 'production' ? true : false,

  logging: true,

  // TypeORM Entity
  entities: [User, Organisation],
  migrations: ['migrations/*.js'],
};

const dataSource = new DataSource(datastore);
export default dataSource;
