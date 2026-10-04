const { asyncHandler } = require("../utils/asyncHandler.js");
const { formatCandidateForAI } = require("../ai/utils/candidateFormatter.js");
const { buildResumeAnalysisPrompt } = require("../ai/prompts/resumeAnalysis.prompt.js");
const { analyzeResume, explainMatch } = require("../ai/services/llm.service.js");
const { getSemanticMatch } = require("../ai/services/match.service.js");
const { buildMatchExplanationPrompt } = require("../ai/prompts/matchExplanation.prompt.js");

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


const matchMyResumeToOpening = asyncHandler(async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ success: 0, message: "Authentication required" });
    }

    const { openingId } = req.params;
    if (!openingId) {
        return res.status(400).json({ success: 0, message: "Opening ID is required" });
    }

    try {
        const result = await getSemanticMatch(req.user._id, openingId);
        return res.status(200).json({
            success: 1,
            message: "Resume matched successfully",
            match: {
                openingId,
                companyName: result.job.companyName,
                similarity: result.similarity,
                similarityPercentage: result.similarityPercentage,
                eligibility: result.eligibility
            }
        });
    } catch (error) {
        const status = ["User not found", "Opening not found"].includes(error.message) ? 404 : 500;
        return res.status(status).json({ success: 0, message: error.message || "Unable to calculate semantic match" });
    }
});

const explainMyMatch = asyncHandler(async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ success: 0, message: "Authentication required" });
    }

    const { openingId } = req.params;
    if (!openingId) {
        return res.status(400).json({ success: 0, message: "Opening ID is required" });
    }

    try {
        const result = await getSemanticMatch(req.user._id, openingId);
        const explanation = await explainMatch(
            buildMatchExplanationPrompt({
                candidate: result.candidate,
                job: result.job,
                match: {
                    semanticSimilarity: result.similarityPercentage,
                    formalEligibility: result.eligibility
                }
            })
        );

        return res.status(200).json({
            success: 1,
            message: "Match explanation generated successfully",
            match: {
                openingId,
                companyName: result.job.companyName,
                similarityPercentage: result.similarityPercentage,
                eligibility: result.eligibility,
                explanation
            }
        });
    } catch (error) {
        const status = ["User not found", "Opening not found"].includes(error.message) ? 404 : 500;
        return res.status(status).json({ success: 0, message: error.message || "Unable to generate match explanation" });
    }
});

module.exports = { analyzeMyResume, matchMyResumeToOpening, explainMyMatch };
