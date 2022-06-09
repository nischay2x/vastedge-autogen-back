const express = require("express");
const { 
    deleteColumnDetailById, editColumDetailById, getColumnDetails, 
    getColumnDetailsByTableName, insertColumnDetail,
    getDistinctPages, getTablesByPageName, getDistinctTables 
} = require("../data-access/autogenDesigner.js");
const { 
    verifyDeleteColumnDetail, verifyEditColumnDetail, verifyGetColumnDetails, 
    verifyGetColumnDetailsByTableName, verifyInsertColumnDetail, verifyGetTablesByPageName 
} = require("../middleware/autogenDesigner.js");
const router = express.Router();

router.post("/column", verifyInsertColumnDetail, insertColumnDetail);
router.get("/columns", verifyGetColumnDetails, getColumnDetails);
router.patch("/column/:id", verifyEditColumnDetail, editColumDetailById);
router.delete("/column/:id", verifyDeleteColumnDetail, deleteColumnDetailById);

// get distinct pages
router.get("/pages", getDistinctPages);
router.get("/tables", getDistinctTables);
router.get("/tables/:pageName", verifyGetTablesByPageName, getTablesByPageName);
router.get("/columns/:tableName", verifyGetColumnDetailsByTableName, getColumnDetailsByTableName);
// get distinct tables by pageName
// get distinct columns by tableName
// get columns by tableName and pageName

// router.get("/table/:tableName", verifyGetColumnDetailsByTableName, getColumnDetailsByTableName);

module.exports = router;