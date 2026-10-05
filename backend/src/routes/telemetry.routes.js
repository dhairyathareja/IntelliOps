import express from "express";

import {getLatestTelemetry, getTelemetryHistory, postTelemetry} from "../controller/telemetry.controller.js";
import { agentAuth } from "../middleware/agentAuth.js";

const router = express.Router();

// POST APIS
router.post("/", agentAuth, postTelemetry);

// GET APIs
router.get("/latest/:agentId", getLatestTelemetry);
router.get("/history/:agentId", getTelemetryHistory);


export default router;