import { dashboarddata } from "../controllers/AdminController.js";

import express from "express";
const router = express.Router();

router.get("/dashboard-data", dashboarddata);

export default router;