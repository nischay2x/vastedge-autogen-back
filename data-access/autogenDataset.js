const dbConnect = require("./dbConnect.js");
const query = dbConnect.query;
const DbQuery = dbConnect.DbQuery;
const queryCrud = new DbQuery('AutogenCrud');
const queryDataset = new DbQuery('Dataset');

async function insertColumn (req, res) {
    try {
        const insertQuery = queryDataset.insertWithOutput(req.body, 'id').getQuery();
        const { recordset } = await query(insertQuery);

        return res.status(200).json({
            status: true,
            msg: "Data Inserted",
            data: {
                ...req.body,
                id: recordset[0].id
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            type: 'SQL Error',
            error: error.message
        });
    }
}

async function getColumns (req, res) {
    try {
        const { limit = 10, offset = 0, fields = [], sortBy = 'id' } = req.query;
        const extractQuery = queryDataset.select(fields).sort(sortBy).offset(offset).limit(limit).getQuery();
        const { recordset } = await query(extractQuery);
        return res.status(200).json({
            status: true,
            data: recordset
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            type: 'SQL Error',
            error: error.message
        });
    }
}

async function getJoinableColumnsByTableName (req, res) {
    try {
        const { tableName } = req.params;
        const extractQuery = queryDataset.select(['columnName']).andWhere([
            ['tableName', '=', tableName],
            ['allowNull', '=', 0],
            ['keepUnique', '=', 1]
        ]).getQuery();
        const { recordset } = await query(extractQuery);

        return res.status(200).json({
            status: true,
            data: recordset.map(r => r.columnName)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            type: 'SQL Error',
            error: error.message
        });
    }
}

async function getColumnsByTableName (req, res) {
    try {
        const { tableName } = req.params;
        const extractQuery = queryDataset.select([]).where('tableName', '=', tableName).getQuery();
        const { recordset } = await query(extractQuery);

        return res.status(200).json({
            status: true,
            data: recordset
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            type: 'SQL Error',
            error: error.message
        });
    }
}

async function editColumById (req, res) {
    try {
        const { id } = req.params;
        let editableData = req.body;

        const updateQuery = queryDataset.set(editableData).where('id', '=', id).getQuery();
        await query(updateQuery);
        return res.status(200).json({
            status: true,
            msg: "Data Updated",
            data: {...editableData, id }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            type: 'SQL Error',
            error: error.message
        });
    }
}

async function deleteColumnById (req, res) {
    try {
        const { id } = req.params;
        const deleteQuery = queryDataset.delete().where('id', '=', id).getQuery();
        await query(deleteQuery);
        return res.status(200).json({
            status: true,
            msg: "Data Deleted"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            type: 'SQL Error',
            error: error.message
        });
    }
}

async function getJoinedColumns (req, res) {
    try {
        const { tableName } = req.query;
        let extractQuery = `SELECT ad.id AS designerId, ad.pageName, ad.tableName, ad.columnName, ad.applyFilter, ad.label, ad.displayMode, ad.displayLength, ad.isMaster,
        ac.id AS crudId, ac.dataType, ac.allowNull, ac.maxLength
        FROM AutogenDesigner AS ad RIGHT JOIN AutogenCrud AS ac ON (ad.columnName = ac.columnName AND ad.tableName = ac.tableName)`
        const tableConstrain = ` WHERE ad.tableName = '${tableName}'`;

        if(tableName) extractQuery = extractQuery+tableConstrain;

        const { recordset } = await query(extractQuery);
        return res.status(200).json({
            status: true,
            data: recordset
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            type: 'SQL Error',
            error: error.message
        });  
    }
}

async function getTablesByPageName(req, res) {
    try {
        const { pageName } = req.params;
        const extractQuery = queryDataset.distinct(['tableName']).where('pageName', '=', pageName).getQuery();
        const { recordset } = await query(extractQuery);

        return res.status(200).json({
            status: true,
            data: recordset.map(r => r.tableName)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            type: 'SQL Error',
            error: error.message
        });
    }
}

async function getDistictTables(req, res) {
    try {
        const extractQuery = queryDataset.distinct(['tableName']).getQuery();
        const { recordset } = await query(extractQuery);
        return res.status(200).json({
            status: true,
            data: recordset.map(r => r.tableName)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            type: 'SQL Error',
            error: error.message
        });
    }
}

module.exports = {
    insertColumn, getColumns, getColumnsByTableName, editColumById, 
    deleteColumnById, getJoinedColumns, getTablesByPageName,
    getDistictTables, getJoinableColumnsByTableName
}