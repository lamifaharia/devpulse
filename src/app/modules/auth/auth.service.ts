import bcrypt from "bcrypt";
import { pool } from "../../config/db";

const signupUser = async (payload: any) => {
  // Scramble the password securely so it's unreadable in the database
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
  `;

  const values = [
    payload.name,
    payload.email,
    hashedPassword,
    payload.role || "contributor",
  ];

  const result = await pool.query(query, values);

  // Return the newly created user record (excluding the raw password!)
  return result.rows[0];
};

export const AuthService = {
  signupUser,
};