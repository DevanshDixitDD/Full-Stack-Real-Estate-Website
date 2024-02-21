import express from "express";
import { creatResidency, getAllResidencies, getResidency} from "../controllers/resdCntrl.js";



const router = express.Router();

router.post("/create", creatResidency)
router.get("/allresd", getAllResidencies)
router.get("/:id", getResidency)


export { router as residencyRoute }