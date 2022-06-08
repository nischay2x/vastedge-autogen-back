import Joi from "joi";

const validSqlDataTypes = ['STRING', 'NUMBER', 'BOOLEAN', 'DATE', 'TIME', 'DATETIME', 'FILE', 'IMAGE', 'DECIMAL', 'MONEY'];
const requiredStringWithoutWhitespace = Joi.string().required().regex(/^(_|\d|\w)+$/);
const autogenCrudColumnNames = ['id', 'tableName', 'columnName', 'dataType', 'nullConstrain'];

export function verifyInsertColumn (req, res, next) {
    const { error, value } = Joi.object().keys({
        tableName: requiredStringWithoutWhitespace,
        columnName: requiredStringWithoutWhitespace,
        nullConstrain: Joi.number().valid(0, 1),
        dataType: Joi.string().required().valid(...validSqlDataTypes),
        dataLength: Joi.number().min(0).default(0)
    }).validate(req.body);

    if(error) return res.status(405).json(error);
    value.dataType = getSQLDataType(value.dataType, value.dataLength);
    req.body = value;
    next();
}

export function verifyEditColumn (req, res, next) {
    if(!req.params.id) return res.status(405).json({
        error: "Id is required"
    });
     
    const { error, value } = Joi.object().keys({
        tableName: requiredStringWithoutWhitespace,
        columnName: requiredStringWithoutWhitespace,
        nullConstrain: Joi.number().valid(0, 1),
        dataType: Joi.string().required().valid(...validSqlDataTypes),
        dataLength: Joi.number().min(0).default(0)
    }).validate(req.body);

    if(error) return res.status(405).json(error);
    value.dataType = getSQLDataType(value.dataType, value.dataLength);
    req.body = value;
    next();
}

export function verifyGetColumns (req, res, next) {
    if(req.query.fields){
        req.query.fields = req.query.fields.split(",")
    }
    const { error, value } = Joi.object().keys({
        limit: Joi.number(),
        offset: Joi.number(),
        fields: Joi.array().items(Joi.string().valid(...autogenCrudColumnNames)),
        sortBy: Joi.string().valid(...autogenCrudColumnNames)
    }).validate(req.query);
    
    if(error) return res.status(405).json(error);

    req.query = value;
    next();
}

export function verifyDeleteColumn (req, res, next) {
    if(!req.params.id) return res.status(405).json({
        error: "Id is required"
    });
    next();
}

// utilities
function getSQLDataType (type, length) {
    switch(type){
        case 'STRING': return (length) ? `VARCHAR\(${length}\)` : 'TEXT';
        case 'NUMBER': return 'INT'; 
        case 'DECIMAL': return (length) ? `FLOAT(${length})` : 'REAL'; 
        case 'FILE': return 'VARBINARY(MAX)';
        default: return type;
    }
}