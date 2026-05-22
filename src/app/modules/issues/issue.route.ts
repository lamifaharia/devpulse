import express from "express";
import auth from "../../middleware/auth";
import checkRole from "../../middleware/checkRole";
import { IssueController } from "./issue.controller";

const router = express.Router();

// Public routes
router.get("/", IssueController.getAllIssues);
router.get("/:id", IssueController.getSingleIssue);

// Protected routes (Requires login token)
router.post("/", auth, IssueController.createIssue);
router.patch("/:id", auth, IssueController.updateIssue);

// Privileged routes (Requires login token AND maintainer role profile status)
router.delete("/:id", auth, checkRole("maintainer"), IssueController.deleteIssue);

export default router;