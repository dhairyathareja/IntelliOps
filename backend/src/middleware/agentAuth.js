import Agent from "../model/agent.model.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const agentAuth = ErrorWrapper(async(req,res,next)=>{

    const agentId = req.headers["x-agent-id"];
    const apiKey = req.headers["x-api-key"];

    if(!agentId){
        throw new ErrorHandler(401,`Agent ID is required`);
    }

    if(!apiKey){
        throw new ErrorHandler(401,`API Key is required`);
    }

    const agent = await Agent.findOne({
        agentId: agentId,
        apiKey: apiKey
    });

    if(!agent){
        throw new ErrorHandler(401,`Invalid Agent ID or API Key`);
    }

    req.agent = agent;

    next();
});