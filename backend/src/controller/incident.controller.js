import Incident from "../model/incident.model.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const getIncidentList = ErrorWrapper(async(req,res,next)=>{

    const incidents = await Incident.find({})
        .sort({ startedAt: -1 });

    if(incidents.length === 0){
        throw new ErrorHandler(
            404,
            `No Incidents Found`
        );
    }

    res.status(200)
        .json({
            success:true,
            message:`Incidents Fetched Successfully`,
            data:{
                incidents:incidents
            }
        });
});


export const getIncidentDetails = ErrorWrapper(async(req,res,next)=>{

    const { incidentId } = req.params;

    if(!incidentId){
        throw new ErrorHandler(
            400,
            `Please Provide Incident ID`
        );
    }

    const incident = await Incident.findOne({
        incidentId: incidentId
    })
    .populate({
        path: "eventIds",
        options: {
            sort: {
                timestamp: 1
            }
        }
    });

    if(!incident){
        throw new ErrorHandler(
            404,
            `Incident Not Found`
        );
    }

    res.status(200)
        .json({
            success:true,
            message:`Incident Details Fetched Successfully`,
            data:{
                incident:incident
            }
        });
});


export const updateIncidentStatus = ErrorWrapper(async(req,res,next)=>{

    const { incidentId } = req.params;

    const { status } = req.body;

    if(!incidentId){
        throw new ErrorHandler(
            400,
            `Please Provide Incident ID`
        );
    }

    if(!status){
        throw new ErrorHandler(
            400,
            `Please Provide Incident Status`
        );
    }

    const allowedStatuses = [
        "detected",
        "acknowledged",
        "investigating",
        "resolved",
        "closed"
    ];

    if(!allowedStatuses.includes(status)){
        throw new ErrorHandler(
            400,
            `Invalid Incident Status`
        );
    }

    const incident = await Incident.findOne({
        incidentId: incidentId
    });

    if(!incident){
        throw new ErrorHandler(
            404,
            `Incident Not Found`
        );
    }

    const currentStatus = incident.status;

    const allowedTransitions = {
        detected: ["acknowledged"],
        acknowledged: ["investigating"],
        investigating: ["resolved"],
        resolved: ["closed"],
        closed: []
    };

    if(!allowedTransitions[currentStatus].includes(status)){
        throw new ErrorHandler(
            400,
            `Cannot change incident status from ${currentStatus} to ${status}`
        );
    }

    incident.status = status;

    if(status === "resolved"){
        incident.resolvedAt = new Date();
    }

    if(status === "closed"){
        incident.closedAt = new Date();
    }

    await incident.save();

    res.status(200)
        .json({
            success:true,
            message:`Incident Status Updated Successfully`,
            data:{
                incidentId:incident.incidentId,
                status:incident.status,
                resolvedAt:incident.resolvedAt,
                closedAt:incident.closedAt
            }
        });
});