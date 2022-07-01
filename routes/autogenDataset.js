const express = require('express');
const router = express.Router();

const { 
    verifyInsertColumn, verifyGetColumns,
    verifyEditColumn, verifyDeleteColumn,
    verifyGetTablesByPageName,
    verifyTableNameInParams
} = require("../middleware/autogenDataset.js");

const {
    insertColumn, editColumById, 
    getColumns, deleteColumnById,
    getJoinedColumns, getColumnsByTableName,
    getTablesByPageName, getDistictTables, getJoinableColumnsByTableName
} = require("../data-access/autogenDataset.js");

// router.post("/column", verifyInsertColumn, insertColumn);
router.get("/columns/combined", getJoinedColumns);
router.get("/columns", verifyGetColumns, getColumns);
router.post("/column", verifyInsertColumn, insertColumn);
router.patch("/column/:id", verifyEditColumn, editColumById);
router.delete("/column/:id", verifyDeleteColumn, deleteColumnById);
router.get("/columns/:tableName", getColumnsByTableName);
router.get("/joinable/columns/:tableName", verifyTableNameInParams, getJoinableColumnsByTableName);

router.get("/tables/:pageName", verifyGetTablesByPageName, getTablesByPageName);
router.get("/tables", getDistictTables);

module.exports = router;