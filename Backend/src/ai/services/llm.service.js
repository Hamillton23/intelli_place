const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const resumeAnalysisSchema = {
    type: "object",
    properties: {
        summary: { type: "string" },
        strengths: {
            type: "array",
            items: { type: "string" }
        },
        weaknesses: {
            type: "array",
            items: { type: "string" }
        },
        strongestProjects: {
            type: "array",
            items: { type: "string" }
        },
        improvementSuggestions: {
            type: "array",
            items: { type: "string" }
        }
    },
    required: [
        "summary",
        "strengths",
        "weaknesses",
        "strongestProjects",
        "improvementSuggestions"
    ],
    additionalProperties: false
};

const analyzeResume = async (prompt) => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured");
    }

    const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-6-luna",
        input: [
            {
                role: "system",
                content: "You are a professional AI resume analyst. Return only the requested structured output."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        text: {
            format: {
                type: "json_schema",
                name: "resume_analysis",
                strict: true,
                schema: resumeAnalysisSchema
            }
        }
    });

    if (!response.output_text) {
        throw new Error("AI returned an empty response");
    }

    return JSON.parse(response.output_text);
};

module.exports = { analyzeResume };
