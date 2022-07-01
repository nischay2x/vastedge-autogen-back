const dbConnect = require("./dbConnect.js");
const DbQuery = dbConnect.DbQuery;
const query = dbConnect.query;
const queryDesigner = new DbQuery('Designer');
const queryDataset = new DbQuery('Dataset');

async function insertColumnDetail(req, res) {
    try {

        const { tableName, columnName, pageName } = req.body;
        const checkCrudQuery = queryDataset.select([]).andWhere([['tableName', '=', tableName], ['columnName', '=', columnName]]);
        const cResponse = await query(checkCrudQuery);
        if(!cResponse.output) return res.status(405).json({
            status: false,
            msg: "No such table-column combination in CRUD table, please insert the combination in CRUD first."
        })

        const insertDesignerQuery = queryDesigner.insert(req.body).getQuery();
        await query(insertDesignerQuery);
        
        const newestRowQuery = queryDesigner.select([]).andWhere([
            ['tableName', '=', tableName], 
            ['columnName', '=', columnName],
            ['pageName', '=', pageName]
        ]).getQuery();
        const { recordset } = await query(newestRowQuery);

        return res.status(200).json({
            status: true,
            msg: "Data Inserted",
            data: recordset[0]
        });
    } catch (error) {
        if (error.number === 2627) {
            return res.status(500).json({
                status: false,
                type: "SQL Error",
                error: "Duplicate ,Column Name for same Table"
            })
        }
        console.log(error);
        return res.status(500).json({
            type: 'SQL Error',
            error: error.message
        });
    }
}

async function getColumnDetails(req, res) {
    try {
        const { limit = 10, offset = 0, fields = [], sortBy = 'id' } = req.query;
        const extractQuery = queryDesigner.select(fields).sort(sortBy).offset(offset).limit(limit).getQuery();
        const { recordset } = await query(extractQuery);
        return res.status(200).json({
            status: true,
            data: recordset
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            type: 'SQL Error',
            error: error.message
        });
    }
}

async function getColumnDetailsByTableName(req, res) {
    try {
        const { tableName } = req.params;
        const { pageName } = req.query;

        let extractQuery = ''
        if(pageName){
            extractQuery = queryDesigner.select([]).andWhere([['tableName', '=', tableName], ['pageName', '=', pageName]]).getQuery();
        } else {
            extractQuery = queryDesigner.select([]).where('tableName', '=', tableName).getQuery();
        }
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

async function getDistinctPages(req, res) {
    try {
        const extractQuery = queryDesigner.distinct(['pageName']).getQuery();
        const { recordset } = await query(extractQuery);
        return res.status(200).json({
            status: true,
            data: recordset.map(r => r.pageName)
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
        const extractQuery = queryDesigner.distinct(['tableName']).where('pageName', '=', pageName).getQuery();
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

async function getDistinctTables(req, res) {
    try {
        const extractQuery = queryDesigner.distinct(['tableName']).getQuery();
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

async function editColumDetailById(req, res) {
    try {
        const { id } = req.params;
        const updateQuery = queryDesigner.set(req.body).where('id', '=', id).getQuery();
        await query(updateQuery);
        return res.status(200).json({
            status: true,
            msg: "Data Updated",
            data: req.body
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            type: 'SQL Error',
            error: error.message
        });
    }
}

async function deleteColumnDetailById(req, res) {
    try {
        const { id } = req.params;
        const deleteQuery = queryDesigner.delete().where('id', '=', id).getQuery();
        const response = await query(deleteQuery);
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

module.exports = {
    insertColumnDetail, getColumnDetails, getColumnDetailsByTableName, getDistinctPages,
    getTablesByPageName, editColumDetailById, deleteColumnDetailById, getDistinctTables
}

