import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  DB_DATABASE: process.env.DB_DATABASE || 'database.sqlite',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@library.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin123!',
};

if (!process.env.JWT_SECRET && ENV.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be defined in production environment.');
}