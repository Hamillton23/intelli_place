import axios from "axios";
import { baseUrl } from "../constants.js";

const authConfig = () => ({
    headers: { token: localStorage.getItem("token") }
});

const matchResumeToOpening = async (openingId) => {
    const response = await axios.post(
        `${baseUrl}/api/ai/resume/match/${openingId}`,
        {},
        authConfig()
    );
    return response.data;
};

const explainResumeMatch = async (openingId) => {
    const response = await axios.post(
        `${baseUrl}/api/ai/resume/match/${openingId}/explain`,
        {},
        authConfig()
    );
    return response.data;
};

export { matchResumeToOpening, explainResumeMatch };
