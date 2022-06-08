import express from "express";
const router = express.Router();

import { 
    verifyInsertColumn, verifyGetColumns,
    verifyEditColumn, verifyDeleteColumn
} from "../middleware/autogenCrud.js";

import {
    insertColumn, editColumById, 
    getColumns, deleteColumnById
} from "../data-access/autogenCrud.js";

router.post("/column", verifyInsertColumn, insertColumn);
router.get("/columns", verifyGetColumns, getColumns);
router.patch("/column/:id", verifyEditColumn, editColumById);
router.delete("/column/:id", verifyDeleteColumn, deleteColumnById);

export default router;