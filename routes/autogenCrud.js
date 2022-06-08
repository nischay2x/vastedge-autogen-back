const express = require('express');
const router = express.Router();

const { 
    verifyInsertColumn, verifyGetColumns,
    verifyEditColumn, verifyDeleteColumn
} = require("../middleware/autogenCrud.js");

const {
    insertColumn, editColumById, 
    getColumns, deleteColumnById
} = require("../data-access/autogenCrud.js");

router.post("/column", verifyInsertColumn, insertColumn);
router.get("/columns", verifyGetColumns, getColumns);
router.patch("/column/:id", verifyEditColumn, editColumById);
router.delete("/column/:id", verifyDeleteColumn, deleteColumnById);

module.exports = router;