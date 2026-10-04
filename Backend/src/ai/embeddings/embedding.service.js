const OpenAI = require("openai");

const getClient = () => {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const getEmbedding = async (text) => {
    const client = getClient();
    const response = await client.embeddings.create({
        model: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
        input: text,
        encoding_format: "float"
    });

    const embedding = response?.data?.[0]?.embedding;
    if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new Error("Embedding API returned an empty vector");
    }

    return embedding;
};

const cosineSimilarity = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length || a.length === 0) {
        throw new Error("Invalid embedding vectors");
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i += 1) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const similarityToPercentage = (similarity) => {
    const bounded = Math.max(-1, Math.min(1, similarity));
    return Math.round(((bounded + 1) / 2) * 10000) / 100;
};

module.exports = { getEmbedding, cosineSimilarity, similarityToPercentage };
