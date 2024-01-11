import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { getDashboardStats, getPieCharts } from "../controllers/stats.js";
const app = express.Router();
app.get("/stats", adminOnly, getDashboardStats);
app.get("/pie", adminOnly, getPieCharts);
export default app;
