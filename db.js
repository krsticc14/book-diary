import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

export const db = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }
});

db.connect()
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => console.error('Database connection failed', err));