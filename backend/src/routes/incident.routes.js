import express from "express";
import {
    getIncidentDetails,
    getIncidentList,
    updateIncidentStatus
} from "../controller/incident.controller.js";

const router = express.Router();

router.get("/", getIncidentList);
router.patch("/:incidentId/status", updateIncidentStatus);
router.get("/:incidentId", getIncidentDetails);


export default router;