import express from "express";
const router = express.Router();

import { addTuitionStatus } from "../controllers/adminControllers.js";
import { getTuitionStatus } from "../controllers/getTuitionStatusController.js";
import { markEntryController } from "../controllers/markEntryController.js";
import { getEmployeeDetailsController } from "../controllers/getEmployeeDetailsController.js";
import { getEmpolyeeTodayStatusController } from "../controllers/getEmpolyeeTodayStatusController.js";
import { markEmployeeAbsentToday } from "../controllers/markEmployeeAbsentToday.js";

router.post("/add-tuition-status", addTuitionStatus);
router.post("/get-tuition-status", getTuitionStatus);
router.post("/mark-entry", markEntryController);
router.get("/get-employee-details", getEmployeeDetailsController);
router.post("/get-employee-today-status", getEmpolyeeTodayStatusController);
router.post("/mark-employee-absent-today", markEmployeeAbsentToday);

export default router;
