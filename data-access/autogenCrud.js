const dbConnect = require("./dbConnect.js");
const query = dbConnect.query;
const DbQuery = dbConnect.DbQuery;
const queryCrud = new DbQuery('AutogenCrud');

async function insertColumn (req, res) {
    try {
        const { tableName, columnName } = req.body;
        const insertQuery = queryCrud.insert(req.body).getQuery();
        await query(insertQuery);

        const newestRowQuery = queryCrud.select([]).andWhere([
            ['tableName', '=', tableName], 
            ['columnName', '=', columnName]
        ]).getQuery();
        const { recordset } = await query(newestRowQuery);

        return res.status(200).json({
            status: true,
            msg: "Data Inserted",
            data: recordset[0]
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

        const updateQuery = queryCrud.set(editableData).where('id', '=', id).getQuery();
        await query(updateQuery);
        return res.status(200).json({
            status: true,
            msg: "Data Updated",
            data: editableData
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
        await query(deleteQuery);
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
        const { tableName } = req.query;
        let extractQuery = `SELECT ad.id AS designerId, ad.pageName, ad.tableName, ad.columnName, ad.applyFilter, ad.label, ad.displayMode, ad.displayLength, ad.isMaster,
        ac.id AS crudId, ac.dataType, ac.nullConstrain, ac.maxLength
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
        return res.status(500).json(error)   
    }
}

async function getTablesByPageName(req, res) {
    try {
        const { pageName } = req.params;
        const extractQuery = queryCrud.distinct(['tableName']).where('pageName', '=', pageName).getQuery();
        const { recordset } = await query(extractQuery);

        return res.status(200).json({
            status: true,
            data: recordset.map(r => r.tableName)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
}

async function getDistictTables(req, res) {
    try {
        const extractQuery = queryCrud.distinct(['tableName']).getQuery();
        const { recordset } = await query(extractQuery);
        return res.status(200).json({
            status: true,
            data: recordset.map(r => r.tableName)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
}

module.exports = {
    insertColumn, getColumns, getColumnsByTableName, editColumById, 
    deleteColumnById, getJoinedColumns, getTablesByPageName,
    getDistictTables
}