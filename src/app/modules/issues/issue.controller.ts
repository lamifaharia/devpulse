import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IssueService } from "./issue.service";

const createIssue = catchAsync(async (req: any, res: Response) => {
  const userId = req.user.id;

  const result = await IssueService.createIssue(req.body, userId);

  sendResponse(res, 201, true, "Issue created successfully", result);
});

export const IssueController = {
  createIssue,
};