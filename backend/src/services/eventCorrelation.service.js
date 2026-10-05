import crypto from "crypto";
import Event from "../model/event.model.js";
import Incident from "../model/incident.model.js";


const CORRELATION_WINDOW = 5 * 60 * 1000;


const generateIncidentId = ()=>{
    return `inc_${crypto.randomBytes(6).toString("hex")}`;
};


const getHighestSeverity = (events)=>{

    const severityOrder = {
        low: 1,
        medium: 2,
        high: 3,
        critical: 4
    };

    let highestSeverity = "low";

    for(const event of events){

        if(
            severityOrder[event.severity] >
            severityOrder[highestSeverity]
        ){
            highestSeverity = event.severity;
        }
    }

    return highestSeverity;
};


const getIncidentTitle = (events)=>{

    if(events.length === 1){

        const event = events[0];

        if(event.source === "cpu"){
            return "High CPU Utilization";
        }

        if(event.source === "memory"){
            return "High Memory Utilization";
        }

        if(event.source === "disk"){
            return "High Disk Utilization";
        }

        return event.message;
    }


    const sources = events.map((event)=>{
        return event.source;
    });

    const uniqueSources = [...new Set(sources)];


    if(uniqueSources.includes("cpu") &&
       uniqueSources.includes("memory")){

        return "High Resource Utilization";
    }


    return "Multiple Infrastructure Events Detected";
};


const getIncidentDescription = (events)=>{

    const messages = events.map((event)=>{
        return event.message;
    });

    return messages.join(". ");
};


const getAffectedComponents = (events)=>{

    const components = [];

    for(const event of events){

        if(event.source === "cpu"){
            components.push("CPU");
        }

        if(event.source === "memory"){
            components.push("Memory");
        }

        if(event.source === "disk"){
            components.push("Disk");
        }

        if(event.source === "network"){
            components.push("Network");
        }

        if(event.source === "heartbeat"){
            components.push("Server");
        }

        if(event.source === "process"){
            components.push("Process");
        }

        if(event.source === "service"){
            components.push("Service");
        }

        if(event.source === "application"){
            components.push("Application");
        }

        if(event.source === "log"){
            components.push("Application Logs");
        }
    }


    return [...new Set(components)];
};


export const correlateEvents = async(
    agentId,
    currentEvent
)=>{

    const windowStart = new Date(
        new Date(currentEvent.timestamp).getTime()
        - CORRELATION_WINDOW
    );

    const windowEnd = new Date(
        new Date(currentEvent.timestamp).getTime()
        + CORRELATION_WINDOW
    );


    const relatedEvents = await Event.find({

        agentId: agentId,

        status: "active",

        timestamp: {
            $gte: windowStart,
            $lte: windowEnd
        }
    })
    .sort({
        timestamp: 1
    });


    if(relatedEvents.length === 0){
        return null;
    }


    const eventIds = relatedEvents.map((event)=>{
        return event._id;
    });


    const existingIncident = await Incident.findOne({

        agentId: agentId,

        status: {
            $in: [
                "detected",
                "acknowledged",
                "investigating"
            ]
        },

        eventIds: {
            $in: eventIds
        }
    });


    if(existingIncident){

        let hasNewEvent = false;

        for(const eventId of eventIds){

            const alreadyAdded =
                existingIncident.eventIds.some((id)=>{
                    return id.toString() === eventId.toString();
                });

            if(!alreadyAdded){

                existingIncident.eventIds.push(eventId);

                hasNewEvent = true;
            }
        }


        if(hasNewEvent){

            const updatedEvents = await Event.find({
                _id: {
                    $in: existingIncident.eventIds
                }
            });


            existingIncident.severity =
                getHighestSeverity(updatedEvents);

            existingIncident.title =
                getIncidentTitle(updatedEvents);

            existingIncident.description =
                getIncidentDescription(updatedEvents);

            existingIncident.affectedComponents =
                getAffectedComponents(updatedEvents);

            await existingIncident.save();
        }


        return existingIncident;
    }


    const incident = await Incident.create({

        incidentId: generateIncidentId(),

        agentId: agentId,

        title: getIncidentTitle(relatedEvents),

        description: getIncidentDescription(relatedEvents),

        severity: getHighestSeverity(relatedEvents),

        status: "detected",

        eventIds: eventIds,

        affectedComponents:
            getAffectedComponents(relatedEvents),

        rootCause: null,

        impact: null,

        startedAt: relatedEvents[0].timestamp
    });


    return incident;
};