import query, { DbQuery } from "./dbConnect.js";
const queryCrud = new DbQuery('AutogenCrud');

export async function insertColumn (req, res) {
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

export async function getColumns (req, res) {
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

export async function getColumnsByTableName (req, res) {
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

export async function editColumById (req, res) {
    try {
        const { id } = req.params;
        let editableData = req.body;
        delete editableData.dataLength;

        const updateQuery = queryCrud.set(editableData).where('id', '=', id).getQuery();

        //const response = await query(updateQuery);
        return res.status(200).json({
            status: true,
            msg: "Data Updated"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error})
    }
}

export async function deleteColumnById (req, res) {
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