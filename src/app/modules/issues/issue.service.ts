import { pool } from "../../config/db";

const createIssue = async (payload: any, userId: number) => {
  const query = `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;

  const values = [
    payload.title,
    payload.description,
    payload.type,
    userId,
  ];

  const result = await pool.query(query, values);

  // Return the newly created issue object rows back
  return result.rows[0];
};

export const IssueService = {
  createIssue,
};