import Telemetry from "../model/telemetry.model.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { detectTelemetryEvents } from "../services/eventDetection.service.js";
import { correlateEvents } from "../services/eventCorrelation.service.js";

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

    const telemetryTimestamp = timestamp
        ? new Date(timestamp)
        : new Date();


    const telemetry = await Telemetry.create({

        agentId: req.agent.agentId,

        timestamp: telemetryTimestamp,

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


    const events = await detectTelemetryEvents(
        req.agent.agentId,
        {
            cpu: cpu,
            memory: memory,
            disk: disk
        },
        telemetryTimestamp
    );


    const incidents = [];


    for(const event of events){

        if(event.status === "active"){

            const incident = await correlateEvents(
                req.agent.agentId,
                event
            );

            if(incident){
                incidents.push(incident);
            }
        }
    }


    res.status(201)
        .json({
            success:true,
            message:`Telemetry Received Successfully`,
            data:{
                agentId:telemetry.agentId,
                timestamp:telemetry.timestamp,
                events:events,
                incidents:incidents
            }
        });
});


export const getLatestTelemetry = ErrorWrapper(async(req,res,next)=>{

    const { agentId } = req.params;

    if(!agentId){
        throw new ErrorHandler(400,`Please Provide Agent ID`);
    }

    const telemetry = await Telemetry.findOne({
        agentId: agentId
    })
    .sort({ timestamp: -1 });

    if(!telemetry){
        throw new ErrorHandler(
            404,
            `No Telemetry Found For This Agent`
        );
    }

    res.status(200)
        .json({
            success:true,
            message:`Latest Telemetry Fetched Successfully`,
            data:{
                telemetry:telemetry
            }
        });
});


export const getTelemetryHistory = ErrorWrapper(async(req,res,next)=>{

    const { agentId } = req.params;

    if(!agentId){
        throw new ErrorHandler(400,`Please Provide Agent ID`);
    }

    const telemetry = await Telemetry.find({
        agentId: agentId
    })
    .sort({ timestamp: -1 })
    .limit(50);

    if(telemetry.length === 0){
        throw new ErrorHandler(
            404,
            `No Telemetry Found For This Agent`
        );
    }

    res.status(200)
        .json({
            success:true,
            message:`Telemetry History Fetched Successfully`,
            data:{
                telemetry:telemetry
            }
        });
});