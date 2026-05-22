import { pool } from "../../config/db";

const createIssue = async (payload: any, userId: number) => {
  const query = `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;
  const values = [payload.title, payload.description, payload.type, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllIssues = async (filters: any) => {
  let query = `SELECT * FROM issues`;
  const values: any[] = [];
  const constraints: string[] = [];

  // Handle dynamic query filtering
  if (filters.type) {
    values.push(filters.type);
    constraints.push(`type = $${values.length}`);
  }
  if (filters.status) {
    values.push(filters.status);
    constraints.push(`status = $${values.length}`);
  }

  if (constraints.length > 0) {
    query += ` WHERE ` + constraints.join(" AND ");
  }

  // Handle dynamic sorting
  const sortOrder = filters.sort === "oldest" ? "ASC" : "DESC";
  query += ` ORDER BY created_at ${sortOrder}`;

  const issuesResult = await pool.query(query, values);
  const issues = issuesResult.rows;

  if (issues.length === 0) return [];

  // STITCHING STRATEGY (NO JOINs): Collect all unique reporter IDs
  const reporterIds = [...new Set(issues.map((issue: any) => issue.reporter_id))];

  // Fetch users matching those IDs
  const usersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporterIds]
  );
  const usersMap = new Map(usersResult.rows.map((u: any) => [u.id, u]));

  // Merge the user information into the issue profiles manually
  return issues.map((issue: any) => {
    const reporter = usersMap.get(issue.reporter_id);
    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporter || null,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });
};

const getSingleIssue = async (id: number) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);
  const issue = issueResult.rows[0];

  if (!issue) return null;

  const userResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id]
  );

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: userResult.rows[0] || null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const updateIssue = async (id: number, payload: any, user: any) => {
  // Find the issue first to perform role validations
  const checkResult = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);
  const issue = checkResult.rows[0];

  if (!issue) throw new Error("Issue not found");

  // Enforce Contributor constraints
  if (user.role === "contributor") {
    if (issue.reporter_id !== user.id) {
      throw new Error("Forbidden: You can only update your own issues");
    }
    if (issue.status !== "open") {
      throw new Error("Conflict: You can only edit issues when status is open");
    }
  }

  // Fallback default assignments or status changes for maintainers
  const updatedTitle = payload.title || issue.title;
  const updatedDescription = payload.description || issue.description;
  const updatedType = payload.type || issue.type;
  const updatedStatus = payload.status || issue.status;

  const updateQuery = `
    UPDATE issues 
    SET title = $1, description = $2, type = $3, status = $4, updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;
  
  const result = await pool.query(updateQuery, [
    updatedTitle,
    updatedDescription,
    updatedType,
    updatedStatus,
    id,
  ]);
  
  return result.rows[0];
};

const deleteIssue = async (id: number) => {
  const result = await pool.query(`DELETE FROM issues WHERE id = $1 RETURNING id`, [id]);
  return result.rowCount ? result.rowCount > 0 : false;
};

export const IssueService = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};