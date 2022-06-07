import express from "express";
import { deleteColumnDetailById, editColumDetailById, getColumnDetails, insertColumnDetail } from "../data-access/autogenDesigner.js";
import { verifyDeleteColumnDetail, verifyEditColumnDetail, verifyGetColumnDetails, verifyInsertColumnDetail } from "../middleware/autogenDesigner.js";
const router = express.Router();

router.post("/column", verifyInsertColumnDetail, insertColumnDetail);
router.get("/columns", verifyGetColumnDetails, getColumnDetails);
router.patch("/column/:id", verifyEditColumnDetail, editColumDetailById);
router.delete("/column/:id", verifyDeleteColumnDetail, deleteColumnDetailById);

export default router;