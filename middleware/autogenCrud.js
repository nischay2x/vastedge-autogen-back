const Joi = require('joi');

const validSqlDataTypes = ['STRING', 'NUMBER', 'BOOLEAN', 'DATE', 'TIME', 'DATETIME', 'FILE', 'IMAGE', 'DECIMAL', 'MONEY'];
const requiredStringWithoutWhitespace = Joi.string().required().regex(/^(_|\d|\w)+$/);
const stringWithoutWhitespace = Joi.string().regex(/^(_|\d|\w)+$/);
const autogenCrudColumnNames = ['id', 'tableName', 'columnName', 'dataType', 'nullConstrain'];

function verifyInsertColumn (req, res, next) {
    const { error, value } = Joi.object().keys({
        tableName: requiredStringWithoutWhitespace,
        columnName: requiredStringWithoutWhitespace,
        nullConstrain: Joi.number().valid(0, 1),
        dataType: Joi.string().required().valid(...validSqlDataTypes),
        maxLength: Joi.number().min(0)
    }).validate(req.body);

    value.dataType = getSQLDataType(value.dataType, value.maxLength);

    if(error) return res.status(405).json(error);
    req.body = value;
    next();
}

function verifyEditColumn (req, res, next) {
    if(!req.params.id) return res.status(405).json({
        error: "Id is required"
    });
     
    const { error, value } = Joi.object().keys({
        tableName: stringWithoutWhitespace,
        columnName: stringWithoutWhitespace,
        nullConstrain: Joi.number().valid(0, 1),
        dataType: Joi.string().valid(...validSqlDataTypes),
        maxLength: Joi.number().min(0)
    }).validate(req.body);

    if(value.dataType) {
        value.dataType = getSQLDataType(value.dataType, value.maxLength);
    }

    if(error) return res.status(405).json(error);
    req.body = value;
    next();
}

function verifyGetColumns (req, res, next) {
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

function verifyDeleteColumn (req, res, next) {
    if(!req.params.id) return res.status(405).json({
        error: "Id is required"
    });
    next();
}

function verifyGetTablesByPageName (req, res, next) {
    const { error, value } = Joi.object().keys({
        pageName: requiredStringWithoutWhitespace
    }).validate(req.params);

    if(error) return res.status(405).json(error);
    req.params = value;
    next();
}

// utilities
function getSQLDataType (type, length) {
    switch(type){
        case 'STRING': return (length) ? `VARCHAR` : 'TEXT';
        case 'NUMBER': return 'INT'; 
        case 'DECIMAL': return (length) ? `FLOAT` : 'REAL'; 
        case 'FILE': return 'VARBINARY(MAX)';
        default: return type;
    }
}

module.exports = {
    verifyInsertColumn, verifyEditColumn, verifyGetColumns, verifyDeleteColumn,
    verifyGetTablesByPageName
}