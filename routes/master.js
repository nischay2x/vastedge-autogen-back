import express from "express";
import { deleteColumnDetailById, editColumDetailById, getColumnDetails, insertColumnDetail } from "../controllers/master.js";
import { verifyDeleteColumnDetail, verifyEditColumnDetail, verifyGetColumnDetails, verifyInsertColumnDetail } from "../middleware/master.js";
const router = express.Router();

router.post("/column", verifyInsertColumnDetail, insertColumnDetail);
router.get("/columns", verifyGetColumnDetails, getColumnDetails);
router.patch("/column/:id", verifyEditColumnDetail, editColumDetailById);
router.delete("/column/:id", verifyDeleteColumnDetail, deleteColumnDetailById);

export default router;