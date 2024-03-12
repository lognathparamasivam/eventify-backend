import dotenv from "dotenv";
dotenv.config();

const properties = {
  env: process.env.NODE_ENV ?? "dev",
  port: 3000,
  logLevel: process.env.LOG_LEVEL ?? "",
  secretKey: process.env.SECRET_KEY ?? "",
  googleClientID: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  dbHost: process.env.DB_HOST ?? "",
  dbPort: Number(process.env.DB_PORT) ?? 0,
  dbUser: process.env.DB_USER ?? "",
  dbPassword: process.env.DB_PASSWORD ?? "",
  dbDatabase: process.env.DB_DATABASE ?? "",
  ormLogging: Boolean(process.env.ORM_LOGGING) || true,
  jwtExpiry: process.env.JWT_TOKEN_EXPIRY
};

export default properties;
