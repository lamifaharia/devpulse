import express from "express";
import auth from "../../middleware/auth";
import checkRole from "../../middleware/checkRole";
import { IssueController } from "./issue.controller";

const router = express.Router();

// Public routes
router.get("/", IssueController.getAllIssues);
router.get("/:id", IssueController.getSingleIssue);

router.post("/", auth, IssueController.createIssue);
router.patch("/:id", auth, IssueController.updateIssue);

router.delete("/:id", auth, checkRole("maintainer"), IssueController.deleteIssue);

export default router;