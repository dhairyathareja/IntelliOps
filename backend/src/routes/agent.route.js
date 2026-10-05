import express from "express";
import {getAgentDetails, getAgentList, postAgentHeartbeat, postRegisterAgent} from "../controller/agent.controller.js";
import { agentAuth } from "../middleware/agentAuth.js";

const router = express.Router();

//  POST APIs
router.post("/register", postRegisterAgent);
router.post("/heartbeat", agentAuth, postAgentHeartbeat);


// GET APIs
router.get("/",getAgentList);
router.get("/:agentId", getAgentDetails);


export default router;