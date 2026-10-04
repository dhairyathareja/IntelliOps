import express from "express";

import {postTelemetry} from "../controller/telemetry.controller.js";
import { agentAuth } from "../middleware/agentAuth.js";

const router = express.Router();

router.post(
    "/",
    agentAuth,
    postTelemetry
);

export default router;