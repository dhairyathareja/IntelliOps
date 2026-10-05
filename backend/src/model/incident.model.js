import mongoose, { Schema } from "mongoose";

const incidentSchema = new Schema(
    {
        incidentId: {
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

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
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

        status: {
            type: String,
            required: true,
            enum: [
                "detected",
                "acknowledged",
                "investigating",
                "resolved",
                "closed"
            ],
            default: "detected",
            index: true
        },

        eventIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "Event"
            }
        ],

        affectedComponents: [
            {
                type: String
            }
        ],

        rootCause: {
            type: String,
            default: null
        },

        impact: {
            type: String,
            default: null
        },

        startedAt: {
            type: Date,
            required: true
        },

        resolvedAt: {
            type: Date,
            default: null
        },

        closedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;
