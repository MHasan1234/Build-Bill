import express from "express";
import { createClient, getAllClients, updateClient, deleteClient, getClientById } from "../controllers/clientController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();


router.use(protect);

router.route('/')
    .post(createClient)
    .get(getAllClients);

router.route('/:id')
 .get(getClientById) 
    .put(updateClient)
    .delete(deleteClient);    

export default router;
