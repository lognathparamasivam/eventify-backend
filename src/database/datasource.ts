import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import logger from "../logger";

dotenv.config();

export const MysqlDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Password@123",
  database: process.env.DB_DATABASE || "eventify",
  migrations: ["src/database/migrations/*.{js,ts}"],
  logging: process.env.ORM_LOGGING === "true",
  entities: ["core/data/entity/**/*.{js,ts}"],
  synchronize: false,
  subscribers: [],
});

const databaseConnect = async () => {
    MysqlDataSource.initialize()
  .then(async () => {
    logger.info('Database connected !!!');
  })
  .catch((err) => logger.error(`Error in Database connection ${err}`));
  };

export default databaseConnect;
