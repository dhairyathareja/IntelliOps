import axios from "axios";

const API_URL = "http://localhost:4444";

export const sendTelemetry = async(agentId, apiKey, metrics)=>{

    const response = await axios.post(
        `${API_URL}/telemetry/`,
        {
            timestamp: new Date(),
            metrics: metrics
        },
        {
            headers:{
                "x-agent-id": agentId,
                "x-api-key": apiKey
            }
        }
    );

    return response.data;
};


export const sendHeartbeat = async(agentId, apiKey)=>{

    const response = await axios.post(
        `${API_URL}/agents/heartbeat`,
        {},
        {
            headers:{
                "x-agent-id":agentId,
                "x-api-key":apiKey
            }
        }
    );

    return response.data;
};