import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

export const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, 
  ssl: { rejectUnauthorized: false }
});

db.connect()
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => console.error('Database connection failed', err));