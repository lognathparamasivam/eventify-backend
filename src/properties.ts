import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' :
                 process.env.NODE_ENV === 'test' ? '.env.test' : '.env.dev';
dotenv.config({ path: envFile });

const properties = {
  env: process.env.NODE_ENV ?? '',
  port: 3000,
  logLevel: process.env.LOG_LEVEL ?? '',
  secretKey: process.env.SECRET_KEY ?? '',
  googleClientID: process.env.GOOGLE_CLIENT_ID ?? '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  dbHost: process.env.DB_HOST ??'',
  dbPort: Number(process.env.DB_PORT) ?? 3306,
  dbUser: process.env.DB_USER ??'',
  dbPassword: process.env.DB_PASSWORD ?? '',
  dbDatabase: process.env.DB_DATABASE ?? '',
  ormLogging: Boolean(process.env.ORM_LOGGING),
  jwtExpiry: process.env.JWT_TOKEN_EXPIRY ?? '',
  mailProviderId: process.env.MAIL_PROVIDER_ID ?? '',
  mailProviderPassword: process.env.MAIL_PROVIDER_PASSWORD ?? '',
};

export default properties;
