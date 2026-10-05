import crypto from "crypto";
import Event from "../model/event.model.js";

const CPU_THRESHOLD = 90;
const MEMORY_THRESHOLD = 90;
const DISK_THRESHOLD = 85;


const generateEventId = ()=>{
    return `evt_${crypto.randomBytes(6).toString("hex")}`;
};


const getSeverity = (metric,value)=>{

    if(metric === "cpu"){

        if(value >= 95){
            return "critical";
        }

        if(value > 90){
            return "high";
        }
    }

    if(metric === "memory"){

        if(value >= 95){
            return "critical";
        }

        if(value > 90){
            return "high";
        }
    }

    if(metric === "disk"){

        if(value >= 95){
            return "critical";
        }

        if(value > 85){
            return "high";
        }
    }

    return "low";
};


const checkMetricEvent = async(
    agentId,
    metric,
    value,
    threshold,
    timestamp
)=>{

    if(value === undefined || value === null){
        return;
    }

    const isThresholdCrossed = value > threshold;

    const existingEvent = await Event.findOne({
        agentId: agentId,
        source: metric,
        status: "active"
    });

    if(isThresholdCrossed){

        if(existingEvent){

            existingEvent.value = value;
            existingEvent.severity = getSeverity(metric,value);
            existingEvent.timestamp = timestamp;

            await existingEvent.save();

            return existingEvent;
        }

        let message = "";

        if(metric === "cpu"){
            message = `CPU utilization is above ${threshold}%`;
        }

        if(metric === "memory"){
            message = `Memory utilization is above ${threshold}%`;
        }

        if(metric === "disk"){
            message = `Disk utilization is above ${threshold}%`;
        }

        const event = await Event.create({

            eventId: generateEventId(),

            agentId: agentId,

            eventType: "infrastructure",

            source: metric,

            metric: metric,

            value: value,

            threshold: threshold,

            severity: getSeverity(metric,value),

            message: message,

            status: "active",

            timestamp: timestamp
        });

        return event;
    }


    if(!isThresholdCrossed && existingEvent){

        existingEvent.status = "resolved";
        existingEvent.resolvedAt = new Date();
        existingEvent.value = value;
        existingEvent.timestamp = timestamp;

        await existingEvent.save();

        return existingEvent;
    }

    return null;
};


export const detectTelemetryEvents = async(
    agentId,
    metrics,
    timestamp
)=>{

    const {
        cpu,
        memory,
        disk
    } = metrics;

    const events = [];

    const cpuEvent = await checkMetricEvent(
        agentId,
        "cpu",
        cpu,
        CPU_THRESHOLD,
        timestamp
    );

    if(cpuEvent){
        events.push(cpuEvent);
    }


    const memoryEvent = await checkMetricEvent(
        agentId,
        "memory",
        memory,
        MEMORY_THRESHOLD,
        timestamp
    );

    if(memoryEvent){
        events.push(memoryEvent);
    }


    const diskEvent = await checkMetricEvent(
        agentId,
        "disk",
        disk,
        DISK_THRESHOLD,
        timestamp
    );

    if(diskEvent){
        events.push(diskEvent);
    }


    return events;
};