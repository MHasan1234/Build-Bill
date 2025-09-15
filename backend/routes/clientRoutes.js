import express from "express";
import { createClient, getAllClients } from "../controllers/clientController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes in this file are protected and require a user to be logged in
router.use(protect);

router.route('/')
    .post(createClient)
    .get(getAllClients);

export default router;
