import query, { DbQuery } from "./dbConnect.js";
const queryMaster = new DbQuery('master');

export async function insertColumnDetail (req, res) {
    try {
        const { pageName, tableName, columnName, applyFilter, label, dataType } = req.body;

        const insertQuery = queryMaster.insert({ 
            pageName, tableName, columnName, 
            applyFilter, label, dataType 
        }).getQuery();
        
        const { recordset } = await query(insertQuery);
        return res.status(200).json({
            status: true,
            msg: "Data Inserted",
            data: recordset
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

export async function getColumnDetails (req, res) {
    try {
        const { limit = 10, offset = 0, fields = [], sortBy = 'id' } = req.query;
        const extractQuery = queryMaster.select(fields).sort(sortBy).offset(offset).limit(limit).getQuery();
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

export async function editColumDetailById (req, res) {
    try {
        const { id } = req.params;
        const { pageName, tableName, columnName, applyFilter, label, dataType } = req.body;
        const updateQuery = queryMaster.set({ 
            pageName, tableName, columnName, 
            applyFilter, label, dataType 
        }).where('id', '=', id).getQuery();
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

export async function deleteColumnDetailById (req, res) {
    try {
        const { id } = req.params;
        const deleteQuery = queryMaster.delete().where('id', '=', id).getQuery();
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



