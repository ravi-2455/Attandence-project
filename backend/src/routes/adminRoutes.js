import express from "express";
const router = express.Router();

import { addTuitionStatus } from "../controllers/adminControllers.js";
import { getTuitionStatus } from "../controllers/getTuitionStatusController.js";

router.post("/add-tuition-status", addTuitionStatus);
router.post("/get-tuition-status", getTuitionStatus);

export default router;
