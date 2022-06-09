const dbConnect = require("./dbConnect.js");
const query = dbConnect.query;
const DbQuery = dbConnect.DbQuery;
const queryCrud = new DbQuery('AutogenCrud');

async function insertColumn (req, res) {
    try {
        let insertableData = req.body;
        delete insertableData.dataLength;

        const insertQuery = queryCrud.insert(insertableData).getQuery();
        const { recordsets } = await query(insertQuery);

        return res.status(200).json({
            status: true,
            msg: "Data Inserted",
            data: recordsets
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

async function getColumns (req, res) {
    try {
        const { limit = 10, offset = 0, fields = [], sortBy = 'id' } = req.query;
        const extractQuery = queryCrud.select(fields).sort(sortBy).offset(offset).limit(limit).getQuery();
        const { recordset } = await query(extractQuery);
        return res.status(200).json({
            status: true,
            data: recordset
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error})
    }
}

async function getColumnsByTableName (req, res) {
    try {
        const { tableName } = req.params;
        const extractQuery = queryCrud.select([]).where('tableName', '=', tableName).getQuery();
        const { recordset } = await query(extractQuery);

        return res.status(200).json({
            status: true,
            data: recordset
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error})
    }
}

async function editColumById (req, res) {
    try {
        const { id } = req.params;
        let editableData = req.body;
        delete editableData.dataLength;

        const updateQuery = queryCrud.set(editableData).where('id', '=', id).getQuery();

        const response = await query(updateQuery);
        return res.status(200).json({
            status: true,
            msg: "Data Updated"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error})
    }
}

async function deleteColumnById (req, res) {
    try {
        const { id } = req.params;
        const deleteQuery = queryCrud.delete().where('id', '=', id).getQuery();
        const response = await query(deleteQuery);
        return res.status(200).json({
            status: true,
            msg: "Data Deleted"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({error});
    }
}

async function getJoinedColumns (req, res) {
    try {
        const extractQuery = `SELECT ad.id AS designerId, ad.pageName, ad.tableName, ad.columnName, ad.applyFilter, ad.label, ad.fieldType,
        ac.id AS crudId, ac.dataType, ac.nullConstrain
        FROM AutogenDesigner AS ad RIGHT JOIN AutogenCrud AS ac ON (ad.columnName = ac.columnName AND ad.tableName = ac.tableName);`

        const { recordset } = await query(extractQuery);
        return res.status(200).json({
            status: true,
            data: recordset
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)   
    }
}

module.exports = {
    insertColumn, getColumns, getColumnsByTableName, editColumById, deleteColumnById, getJoinedColumns
}