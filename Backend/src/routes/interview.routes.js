const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller')

const upload = require('../middlewares/file.middleware')

const interviewRouter = express.Router();
/**
 * @route post /api.interview/
 * @description generate new interview report based on the user self  description , resume pdf and job description 
 * @access private
 * 
 */

interviewRouter.post('/', authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController)

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

interviewRouter.get('/', authMiddleware.authUser, interviewController.getAllInterviewReportsController);

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

module.exports = interviewRouter;