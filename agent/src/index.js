import { collectMetrics } from "./collector.js";
import { sendHeartbeat, sendTelemetry } from "./api.js";

const agentId = "agt_021986f2bf1f";
const apiKey = "2cc80ac82b0f7f1b83b74be75e491dae96a5f2551079ed8bed0d5563a2a8eb5c";

const collectAndSendTelemetry = async()=>{

    try{

        const metrics = await collectMetrics();

        console.log("Collected Metrics:");
        console.log(metrics);

        const response = await sendTelemetry(
            agentId,
            apiKey,
            metrics
        );

        console.log("Telemetry Response:");
        console.log(response);

    }catch(error){

        console.log(
            "Telemetry Error:",
            error.response?.data || error.message
        );

    }

};

const sendAgentHeartbeat = async()=>{

    try{

        const response = await sendHeartbeat(
            agentId,
            apiKey
        );

        console.log("Heartbeat Response:");
        console.log(response);

    }catch(error){

        console.log(
            "Heartbeat Error:",
            error.response?.data || error.message
        );

    }

};

await collectAndSendTelemetry();
await sendAgentHeartbeat();

setInterval(
    sendAgentHeartbeat,
    30000
);

setInterval(
    collectAndSendTelemetry,
    10000
);