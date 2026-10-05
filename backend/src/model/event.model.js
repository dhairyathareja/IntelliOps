import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
    {
        eventId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        agentId: {
            type: String,
            required: true,
            index: true
        },

        eventType: {
            type: String,
            required: true,
            enum: [
                "infrastructure",
                "application",
                "availability",
                "security"
            ],
            index: true
        },

        source: {
            type: String,
            required: true,
            enum: [
                "cpu",
                "memory",
                "disk",
                "network",
                "heartbeat",
                "process",
                "service",
                "application",
                "log"
            ],
            index: true
        },

        metric: {
            type: String,
            default: null
        },

        value: {
            type: Number,
            default: null
        },

        threshold: {
            type: Number,
            default: null
        },

        severity: {
            type: String,
            required: true,
            enum: [
                "low",
                "medium",
                "high",
                "critical"
            ],
            default: "low",
            index: true
        },

        message: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "active",
                "resolved"
            ],
            default: "active",
            index: true
        },

        timestamp: {
            type: Date,
            required: true,
            index: true
        },

        resolvedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;