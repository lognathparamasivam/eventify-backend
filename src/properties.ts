import dotenv from "dotenv";
dotenv.config();

const properties = {
  env: process.env.NODE_ENV ?? "",
  port: 3000,
  logLevel: process.env.LOG_LEVEL ?? "",
};

export default properties;
