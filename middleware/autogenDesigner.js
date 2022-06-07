import Joi from "joi";

const requiredStringWithoutWhitespace = Joi.string().required().regex(/^(_|\d|\w)*$/)
const validSqlDataTypes = ['STRING', 'NUMBER', 'BOOLEAN', 'DATE', 'TIME', 'DATETIME', 'FILE', 'IMAGE', 'DECIMAL', 'MONEY'];


export function verifyInsertColumnDetail (req, res, next) {
    let { error, value } = Joi.object().keys({
        pageName: requiredStringWithoutWhitespace,
        tableName: requiredStringWithoutWhitespace,
        columnName: requiredStringWithoutWhitespace,
        applyFilter: Joi.number().valid(1, 0).required().default(0),
        label: Joi.string().required().regex(/^(_|\d|\w|\s)*$/),
        dataType: Joi.string().required().valid(...validSqlDataTypes),
        dataLength: Joi.number().min(0)
    }).validate(req.body);

    if(error) return res.status(405).json(error);
    
    value.dataType = getSQLDataType(value.dataType, value.dataLength);
    req.body = value;
    next();
}

export function verifyGetColumnDetails (req, res, next) {
    if(req.query.fields){
        req.query.fields = req.query.fields.split(",")
    }
    const { error, value } = Joi.object().keys({
        limit: Joi.number(),
        offset: Joi.number(),
        fields: Joi.alternatives().try(Joi.array().items(Joi.string().regex(/^(_|\d|\w|\s)*$/)), Joi.string().regex(/^(_|\d|\w|\s)*$/)),
        sortBy: Joi.string().regex(/^(_|\d|\w|\s)*$/)
    }).validate(req.query);
    
    if(error) return res.status(405).json(error);

    req.query = value;
    next();
}

export function verifyEditColumnDetail (req, res, next) {
    if(!req.params.id) return res.status(405).json({
        error: "Id is required"
    });

    let { error, value } = Joi.object().keys({
        pageName: requiredStringWithoutWhitespace,
        tableName: requiredStringWithoutWhitespace,
        columnName: requiredStringWithoutWhitespace,
        applyFilter: Joi.number().valid(1, 0).required().default(0),
        label: Joi.string().required().regex(/^(_|\d|\w|\s)*$/),
        dataType: Joi.string().required().valid(...validSqlDataTypes),
        dataLength: Joi.number().min(0)
    }).validate(req.body);

    if(error) return res.status(405).json(error);
    
    value.dataType = getSQLDataType(value.dataType, value.dataLength);
    req.body = value;
    next();
}

export function verifyDeleteColumnDetail (req, res, next) {
    if(!req.params.id) return res.status(405).json({
        error: "Id is required"
    });
    next();
}

function getSQLDataType (type, length) {
    switch(type){
        case 'STRING': return (length) ? `VARCHAR\(${length}\)` : 'TEXT';
        case 'NUMBER': return 'INT'; 
        case 'DECIMAL': return (length) ? `FLOAT(${length})` : 'REAL'; 
        case 'FILE': return 'VARBINARY(MAX)';
        default: return type;
    }
}