import mongoose, { Schema } from "mongoose";

const telemetrySchema = new Schema({
    agentId:{
        type: String,
        required: true
    },
    metrics:{
        cpu:{
            type: String
        },
        memory:{
            type: String
        },
        disk:{
            type: String
        },
        networkRx:{
            type: String
        },
        networkTx:{
            type: String
        }
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    timestamps:{
        type: Date
    }
})

const Telemetry = mongoose.model("Agent",telemetrySchema);
export default Telemetry;