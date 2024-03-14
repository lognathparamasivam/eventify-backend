import { DataSource } from "typeorm";
import logger from "../logger";
import properties from "../properties";

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

export const databaseConnect = async () => {
    await MysqlDataSource.initialize()
  .then(async () => {
    logger.info('Database connected !!!');
  })
  .catch((err) => logger.error(`Error in Database connection ${err}`));
  };