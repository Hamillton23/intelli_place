const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware.js");
const { analyzeMyResume } = require("../controllers/ai.controller.js");

const aiRouter = express.Router();

aiRouter.post("/resume/analyze", authMiddleware, analyzeMyResume);

module.exports = { aiRouter };
