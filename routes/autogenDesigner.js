import express from "express";
import { 
    deleteColumnDetailById, editColumDetailById, getColumnDetails, 
    getColumnDetailsByTableNameAndPageName, insertColumnDetail,
    getDistinctPages, getTablesByPageName 
} from "../data-access/autogenDesigner.js";
import { 
    verifyDeleteColumnDetail, verifyEditColumnDetail, verifyGetColumnDetails, 
    verifyGetColumnDetailsByTableName, verifyInsertColumnDetail 
} from "../middleware/autogenDesigner.js";
const router = express.Router();

router.post("/column", verifyInsertColumnDetail, insertColumnDetail);
router.get("/columns", verifyGetColumnDetails, getColumnDetails);
router.patch("/column/:id", verifyEditColumnDetail, editColumDetailById);
router.delete("/column/:id", verifyDeleteColumnDetail, deleteColumnDetailById);

// get distinct pages
router.get("/pages", getDistinctPages);
router.get("/tables/:pageName", getTablesByPageName);
router.get("/columns/:pageName/:tableName", getColumnDetailsByTableNameAndPageName);
// get distinct tables by pageName
// get distinct columns by tableName
// get columns by tableName and pageName

router.get("/table/:tableName", verifyGetColumnDetailsByTableName, getColumnDetailsByTableNameAndPageName);

export default router;