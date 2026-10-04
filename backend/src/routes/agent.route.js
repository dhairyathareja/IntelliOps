import express from "express";
import {getAgentList, postAgentHeartbeat, postRegisterAgent} from "../controller/agent.controller.js";
import { agentAuth } from "../middleware/agentAuth.js";

const router = express.Router();

router.post("/register", postRegisterAgent);
router.post("/heartbeat", agentAuth, postAgentHeartbeat);
router.get("/",getAgentList);

export default router;