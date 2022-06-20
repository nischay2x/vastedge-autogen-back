const express = require('express');
const router = express.Router();

const { 
    verifyInsertColumn, verifyGetColumns,
    verifyEditColumn, verifyDeleteColumn,
    verifyGetTablesByPageName
} = require("../middleware/autogenCrud.js");

const {
    insertColumn, editColumById, 
    getColumns, deleteColumnById,
    getJoinedColumns, getColumnsByTableName,
    getTablesByPageName, getDistictTables
} = require("../data-access/autogenCrud.js");

// router.post("/column", verifyInsertColumn, insertColumn);
router.get("/columns/combined", getJoinedColumns);
router.get("/columns", verifyGetColumns, getColumns);
router.post("/column", verifyInsertColumn, insertColumn);
router.patch("/column/:id", verifyEditColumn, editColumById);
router.delete("/column/:id", verifyDeleteColumn, deleteColumnById);
router.get("/columns/:tableName", getColumnsByTableName);

router.get("/tables/:pageName", verifyGetTablesByPageName, getTablesByPageName);
router.get("/tables", getDistictTables);

module.exports = router;