const { asyncHandler } = require("../utils/asyncHandler.js");
const { formatCandidateForAI } = require("../ai/utils/candidateFormatter.js");
const { buildResumeAnalysisPrompt } = require("../ai/prompts/resumeAnalysis.prompt.js");
const { analyzeResume } = require("../ai/services/llm.service.js");

const analyzeMyResume = asyncHandler(async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({
            success: 0,
            message: "Authentication required"
        });
    }

    const candidate = formatCandidateForAI(req.user);
    const prompt = buildResumeAnalysisPrompt(candidate);
    const analysis = await analyzeResume(prompt);

    return res.status(200).json({
        success: 1,
        message: "Resume analyzed successfully",
        analysis
    });
});

module.exports = { analyzeMyResume };
