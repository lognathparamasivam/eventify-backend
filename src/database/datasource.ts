import { DataSource } from "typeorm";
import properties from "../properties";
import logger from "../logger";

export const MysqlDataSource = new DataSource({
  type: "mysql",
  host: properties.dbHost,
  port: properties.dbPort,
  username: properties.dbUser,
  password: properties.dbPassword,
  database: properties.dbDatabase,
  logging: properties.ormLogging,
  entities: ["src/entities/**/*.{js,ts}"],
  synchronize: false,
  subscribers: [],
});

export async function databaseConnect() {
  await MysqlDataSource.initialize();
}
export async function databaseClose() {
  MysqlDataSource.isInitialized ? await MysqlDataSource.destroy() : logger.info('No Connection to Close')
}

export async function databaseExist() {
  return MysqlDataSource.isInitialized
}