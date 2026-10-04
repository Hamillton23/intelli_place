const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware.js");
const { analyzeMyResume, matchMyResumeToOpening } = require("../controllers/ai.controller.js");

const aiRouter = express.Router();

aiRouter.post("/resume/analyze", authMiddleware, analyzeMyResume);
aiRouter.post("/resume/match/:openingId", authMiddleware, matchMyResumeToOpening);

module.exports = { aiRouter };
