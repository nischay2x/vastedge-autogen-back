const dbConnect = require("./dbConnect.js");
const DbQuery = dbConnect.DbQuery;
const query = dbConnect.query;
const queryDesigner = new DbQuery('AutogenDesigner');
const queryCrud = new DbQuery('AutogenCrud');

async function insertColumnDetail (req, res) {
    try {
        const { keepInForm } = req.body;

        const insertCrudQuery = queryCrud.insert(req.crud).getQuery();

        if(keepInForm){   
            const insertDesignerQuery = queryDesigner.insert(req.design).getQuery();
            
            const dResponse = await query(insertDesignerQuery);
            const cResponse = await query(insertCrudQuery);

            return res.status(200).json({
                status: true,
                msg: "Data Inserted"
            })
        }

        const cResponse = await query(insertCrudQuery);    
        return res.status(200).json({
            status: true,
            msg: "Data Inserted"
        });
    } catch (error) {
        if(error.number === 2627) {
            return res.status(500).json({
                status: false,
                msg: "Duplicate Column Name for same Table"
            })
        }
        console.log(error);
        return res.status(500).json(error);
    }
}

async function getColumnDetails (req, res) {
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
        return res.status(500).json({error})
    }
}

async function getColumnDetailsByTableName (req, res) {
    try {
        const { tableName } = req.params;
        const extractQuery = queryDesigner.select([]).where('tableName', '=', tableName).getQuery();
        console.log(extractQuery);
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

async function getDistinctPages (req, res) {
    try {
        const extractQuery = queryDesigner.distinct(['pageName']).getQuery();
        const { recordset } = await query(extractQuery);
        return res.status(200).json({
            status: true,
            data: recordset.map(r => r.pageName)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({error})
    }
}

async function getTablesByPageName (req, res) {
    try {
        const { pageName } = req.params;
        const extractQuery = queryDesigner.distinct(['tableName']).where('pageName', '=', pageName).getQuery();
        console.log(extractQuery);
        const { recordset } = await query(extractQuery);

        return res.status(200).json({
            status: true,
            data: recordset.map(r => r.tableName)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({error})
    }
}

async function getDistinctTables (req, res) {
    try {
        const extractQuery = queryDesigner.distinct(['tableName']).getQuery();
        const { recordset } = await query(extractQuery);
        return res.status(200).json({
            status: true,
            data: recordset.map(r => r.tableName)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({error})
    }
}

async function editColumDetailById (req, res) {
    try {
        const { id } = req.params;
        const updateQuery = queryDesigner.set(req.design).where('id', '=', id).getQuery();
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

async function deleteColumnDetailById (req, res) {
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
        return res.status(500).json({error});
    }
}

module.exports = {
    insertColumnDetail, getColumnDetails, getColumnDetailsByTableName, getDistinctPages,
    getTablesByPageName, editColumDetailById, deleteColumnDetailById, getDistinctTables
}

