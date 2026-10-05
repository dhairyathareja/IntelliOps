// Import Packages
import mongoose from "mongoose";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

import dotenv from "dotenv";
dotenv.config();

// Import Route
import agentRoutes from "./routes/agent.route.js";
import telemetryRoutes from "./routes/telemetry.routes.js";
import incidentRoutes from "./routes/incident.routes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(bodyParser.json({ limit: "4kb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "4kb" }));
app.use(cookieParser());

// Routing APIs
app.use("/agents", agentRoutes);
app.use("/telemetry", telemetryRoutes);
app.use("/incidents", incidentRoutes);

const PORT = process.env.PORT || 4444;
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Started at ${PORT}`);
    });
  })
  .catch((err) => console.log("❌ DB Error:", err));
