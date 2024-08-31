import express from "express";
const router = express.Router();

import { addTuitionStatus } from "../controllers/adminControllers.js";
import { getTuitionStatus } from "../controllers/getTuitionStatusController.js";
import { markEntryController } from "../controllers/markEntryController.js";

router.post("/add-tuition-status", addTuitionStatus);
router.post("/get-tuition-status", getTuitionStatus);
router.post("/mark-entry", markEntryController);

export default router;
