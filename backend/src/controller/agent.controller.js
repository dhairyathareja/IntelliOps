import Agent from "../model/agent.model.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import crypto from "crypto";

export const postRegisterAgent = ErrorWrapper(async(req,res,next)=>{

    const {
        hostname,
        ipAddress,
        operatingSystem,
        agentVersion
    } = req.body;

    if(!hostname){
        throw new ErrorHandler(400,`Please Provide Hostname`);
    }

    if(!ipAddress){
        throw new ErrorHandler(400,`Please Provide IP Address`);
    }

    if(!operatingSystem){
        throw new ErrorHandler(400,`Please Provide Operating System`);
    }

    if(!agentVersion){
        throw new ErrorHandler(400,`Please Provide Agent Version`);
    }

    const existingAgent = await Agent.findOne({
        hostname: hostname
    });

    if(existingAgent){
        throw new ErrorHandler(
            400,
            `Agent with this hostname is already registered`
        );
    }

    const agentId = `agt_${crypto.randomBytes(6).toString("hex")}`;

    const apiKey = crypto.randomBytes(32).toString("hex");

    const agent = await Agent.create({
        agentId: agentId,
        hostname: hostname,
        ipAddress: ipAddress,
        operatingSystem: operatingSystem,
        agentVersion: agentVersion,
        apiKey: apiKey,
        status: "offline"
    });

    res.status(201)
        .json({
            success:true,
            message:`Agent Registered Successfully`,
            data:{
                agentId:agent.agentId,
                apiKey:agent.apiKey,
                hostname:agent.hostname,
                status:agent.status
            }
        });
});


export const postAgentHeartbeat = ErrorWrapper(async(req,res,next)=>{

    const agent = req.agent;

    agent.lastHeartbeat = new Date();
    agent.status = "online";

    await agent.save();

    res.status(200)
        .json({
            success:true,
            message:`Agent Heartbeat Received Successfully`,
            data:{
                agentId:agent.agentId,
                status:agent.status,
                lastHeartbeat:agent.lastHeartbeat
            }
        });
});



export const getAgentList = ErrorWrapper(async(req,res,next)=>{

    const agents = await Agent.find({})
        .select("-apiKey")
        .sort({ createdAt: -1 });

    res.status(200)
        .json({
            success:true,
            message:`Agents Fetched Successfully`,
            data:{
                agents:agents
            }
        });
});