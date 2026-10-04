import Telemetry from "../model/telemetry.model.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const postTelemetry = ErrorWrapper(async(req,res,next)=>{

    const {
        timestamp,
        metrics
    } = req.body;

    if(!metrics){
        throw new ErrorHandler(400,`Please Provide Telemetry Metrics`);
    }

    const {
        cpu,
        memory,
        disk,
        networkRx,
        networkTx
    } = metrics;

    if(cpu === undefined){
        throw new ErrorHandler(400,`Please Provide CPU Metrics`);
    }

    if(memory === undefined){
        throw new ErrorHandler(400,`Please Provide Memory Metrics`);
    }

    if(disk === undefined){
        throw new ErrorHandler(400,`Please Provide Disk Metrics`);
    }

    if(networkRx === undefined){
        throw new ErrorHandler(400,`Please Provide Network RX Metrics`);
    }

    if(networkTx === undefined){
        throw new ErrorHandler(400,`Please Provide Network TX Metrics`);
    }

    const telemetry = await Telemetry.create({
        agentId: req.agent.agentId,

        timestamp: timestamp
            ? new Date(timestamp)
            : new Date(),

        metrics: {
            cpu: cpu,
            memory: memory,
            disk: disk,
            networkRx: networkRx,
            networkTx: networkTx
        }
    });

    req.agent.lastTelemetryAt = new Date();

    await req.agent.save();

    res.status(201)
        .json({
            success:true,
            message:`Telemetry Received Successfully`,
            data:{
                agentId:telemetry.agentId,
                timestamp:telemetry.timestamp
            }
        });
});