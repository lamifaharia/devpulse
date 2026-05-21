import { Pool } from "pg";
import dotenv from "dotenv";

// This line reads the variables inside your .env file so the code can see process.env.DATABASE_URL
dotenv.config();

// We create a connection pool manager
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Neon requires SSL encryption to connect securely over the internet
    rejectUnauthorized: false,
  },
});