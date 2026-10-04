import mongoose, { Schema } from "mongoose";

const agentSchema = new Schema(
    {
        agentId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        hostname: {
            type: String,
            required: true
        },

        ipAddress: {
            type: String,
            required: true
        },

        operatingSystem: {
            type: String,
            required: true
        },

        agentVersion: {
            type: String,
            required: true,
            default: "1.0.0"
        },

        apiKey: {
            type: String,
            required: true,
            unique: true
        },

        status: {
            type: String,
            enum: ["online", "offline"],
            default: "offline"
        },

        lastHeartbeat: {
            type: Date,
            default: null
        },

        lastTelemetryAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;