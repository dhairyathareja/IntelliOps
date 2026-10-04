import mongoose, { Schema } from "mongoose";

const telemetrySchema = new Schema(
    {
        agentId: {
            type: String,
            required: true,
            index: true
        },

        timestamp: {
            type: Date,
            required: true
        },

        metrics: {
            cpu: {
                type: Number
            },

            memory: {
                type: Number
            },

            disk: {
                type: Number
            },

            networkRx: {
                type: Number
            },

            networkTx: {
                type: Number
            }
        }
    },
    {
        timestamps: true
    }
);

const Telemetry = mongoose.model("Telemetry", telemetrySchema);

export default Telemetry;