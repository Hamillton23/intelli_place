import axios from "axios";
import { baseUrl } from "../constants.js";

const analyzeResume = async () => {
    const response = await axios.post(
        `${baseUrl}/api/ai/resume/analyze`,
        {},
        {
            headers: {
                token: localStorage.getItem("token")
            }
        }
    );

    return response.data;
};

export { analyzeResume };
