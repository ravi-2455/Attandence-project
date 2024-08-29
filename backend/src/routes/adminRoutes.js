import express from "express";
const router = express.Router();

import { addTuitionStatus } from "../controllers/adminControllers.js";

router.post("/add-tuition-status", addTuitionStatus);

export default router;
