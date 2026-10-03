import mongoose, { Schema } from "mongoose";

const agentSchema = new Schema({
    agentId:{
        type: String,
        required: true
    },
    hostname:{
        type: String,
        required: true
    },
    ipAddress:{
        type: String,
        required: true
    },
    operatingSystem:{
        type: String,
        required: true
    },
    agentVersion:{
        type: String,
        required: true
    },
    apiKey:{
        type: String,
        required: true
    },
    status:{
        type: String,
        default: 'offline'
    },
    lastHeartbeat:{
        type: Date,
    },
    lastTelemetryAt:{
        type: Date,
    },
    timestamps:{
        type: Date
    }
})

const Agent = mongoose.model("Agent",agentSchema);
export default Agent;