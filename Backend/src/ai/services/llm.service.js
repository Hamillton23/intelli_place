const OpenAI = require("openai");

const getClient = () => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured");
    }
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const resumeAnalysisSchema = {
    type: "object",
    properties: {
        summary: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        weaknesses: { type: "array", items: { type: "string" } },
        strongestProjects: { type: "array", items: { type: "string" } },
        improvementSuggestions: { type: "array", items: { type: "string" } }
    },
    required: ["summary", "strengths", "weaknesses", "strongestProjects", "improvementSuggestions"],
    additionalProperties: false
};

const matchExplanationSchema = {
    type: "object",
    properties: {
        overallAssessment: { type: "string" },
        matchingStrengths: { type: "array", items: { type: "string" } },
        gaps: { type: "array", items: { type: "string" } },
        eligibilityNote: { type: "string" },
        nextSteps: { type: "array", items: { type: "string" } }
    },
    required: ["overallAssessment", "matchingStrengths", "gaps", "eligibilityNote", "nextSteps"],
    additionalProperties: false
};

const createStructuredResponse = async ({ system, prompt, name, schema }) => {
    const client = getClient();
    const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-6-luna",
        input: [
            { role: "system", content: system },
            { role: "user", content: prompt }
        ],
        text: {
            format: {
                type: "json_schema",
                name,
                strict: true,
                schema
            }
        }
    });

    if (!response.output_text) {
        throw new Error("AI returned an empty response");
    }

    try {
        return JSON.parse(response.output_text);
    } catch (error) {
        throw new Error("AI returned invalid structured JSON");
    }
};

const analyzeResume = (prompt) => createStructuredResponse({
    system: "You are a professional AI resume analyst. Return only the requested structured output.",
    prompt,
    name: "resume_analysis",
    schema: resumeAnalysisSchema
});

const explainMatch = (prompt) => createStructuredResponse({
    system: "You are a grounded recruitment assistant. Explain evidence; never invent facts or override deterministic eligibility.",
    prompt,
    name: "match_explanation",
    schema: matchExplanationSchema
});

module.exports = { analyzeResume, explainMatch };
