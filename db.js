import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

export const db = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }
});

async function createTable() {
  try {
    await Pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title TEXT(255) NOT NULL,
        author TEXT(255),
        olid TEXT(50),
        cover_url TEXT(255),
        notes TEXT,
        rating INTEGER,
        date_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        cover_id INTEGER
      );
    `);

    console.log("✅ Table 'books' created successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error creating table:", err);
    process.exit(1);
  }
}

createTable();

db.connect()
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => console.error('Database connection failed', err));