import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

export const db = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false },
});


async function createTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT,
        olid TEXT,
        cover_url TEXT,
        notes TEXT,
        rating INTEGER,
        date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        cover_id INTEGER
      );
    `);

    console.log("✅ Table 'books' created successfully!");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  }
}

createTable();

db.connect()
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.error("Database connection failed", err));
