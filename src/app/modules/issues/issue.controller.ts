import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IssueService } from "./issue.service";

const createIssue = catchAsync(async (req: any, res: Response) => {
  const result = await IssueService.createIssue(req.body, req.user.id);
  sendResponse(res, 201, true, "Issue created successfully", result);
});

const getAllIssues = catchAsync(async (req: Request, res: Response) => {
  const result = await IssueService.getAllIssues(req.query);
  sendResponse(res, 200, true, "Issues retrieved successfully", result);
});

const getSingleIssue = catchAsync(async (req: Request, res: Response) => {
  const result = await IssueService.getSingleIssue(Number(req.params.id));
  if (!result) {
    return sendResponse(res, 404, false, "Issue not found");
  }
  sendResponse(res, 200, true, "Issue retrieved successfully", result);
});

const updateIssue = catchAsync(async (req: any, res: Response) => {
  try {
    const result = await IssueService.updateIssue(Number(req.params.id), req.body, req.user);
    sendResponse(res, 200, true, "Issue updated successfully", result);
  } catch (error: any) {
    const statusCode = error.message.includes("Forbidden") ? 403 : error.message.includes("Conflict") ? 409 : 400;
    res.status(statusCode).json({ success: false, message: error.message });
  }
});

const deleteIssue = catchAsync(async (req: Request, res: Response) => {
  const success = await IssueService.deleteIssue(Number(req.params.id));
  if (!success) {
    return res.status(404).json({ success: false, message: "Issue not found" });
  }
  sendResponse(res, 200, true, "Issue deleted successfully");
});

export const IssueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};