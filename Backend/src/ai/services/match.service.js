const { User } = require("../../models/user.models.js");
const Opening = require("../../models/openings.model.js");
const { formatCandidateForAI } = require("../utils/candidateFormatter.js");
const { formatJobForAI } = require("../utils/jobFormatter.js");
const { checkEligibility } = require("../utils/eligibility.js");
const { getEmbedding, cosineSimilarity, similarityToPercentage } = require("../embeddings/embedding.service.js");

const buildCandidateText = (candidate) => JSON.stringify(candidate);
const buildJobText = (job) => JSON.stringify(job);

const getCachedOrFreshEmbedding = async (document, cacheField, timestampField, text) => {
    const documentUpdatedAt = document.updatedAt ? new Date(document.updatedAt).getTime() : 0;
    const cachedAt = document[timestampField] ? new Date(document[timestampField]).getTime() : 0;

    if (Array.isArray(document[cacheField]) && document[cacheField].length > 0 && cachedAt >= documentUpdatedAt) {
        return document[cacheField];
    }

    const embedding = await getEmbedding(text);
    document[cacheField] = embedding;
    document[timestampField] = new Date();
    await document.save();
    return embedding;
};

const getSemanticMatch = async (userId, openingId) => {
    const user = await User.findById(userId).select("-password -refreshToken -emailVerificationOTP -emailVerificationOTPExpires");
    const opening = await Opening.findById(openingId);

    if (!user) throw new Error("User not found");
    if (!opening) throw new Error("Opening not found");

    const candidate = formatCandidateForAI(user);
    const job = formatJobForAI(opening);
    const eligibility = checkEligibility(candidate, job);

    const candidateEmbedding = await getCachedOrFreshEmbedding(
        user,
        "aiEmbedding",
        "aiEmbeddingUpdatedAt",
        buildCandidateText(candidate)
    );

    const jobEmbedding = await getCachedOrFreshEmbedding(
        opening,
        "aiEmbedding",
        "aiEmbeddingUpdatedAt",
        buildJobText(job)
    );

    const similarity = cosineSimilarity(candidateEmbedding, jobEmbedding);

    return {
        user,
        opening,
        candidate,
        job,
        eligibility,
        similarity,
        similarityPercentage: similarityToPercentage(similarity)
    };
};

module.exports = { getSemanticMatch };
