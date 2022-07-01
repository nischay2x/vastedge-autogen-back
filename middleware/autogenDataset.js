const Joi = require('joi');

const validSqlDataTypes = [
    'VARCHAR', 'INT', 'FLOAT', 
    'BOOLEAN', 'DATE', 'TIME', 
    'DATETIME', 'FILE', 'IMAGE', 
    'DECIMAL', 'MONEY',  'STRING', 'NUMBER',
];
const requiredStringWithoutWhitespace = Joi.string().required().regex(/^(_|\d|\w)+$/);
const stringWithoutWhitespace = Joi.string().regex(/^(_|\d|\w)+$/);
const datasetColumns = [
    'id', 'tableName', 'columnName', 
    'dataType', 'allowNull', 'keepUnique', 
    'maxLength'
];

function verifyInsertColumn (req, res, next) {
    const { error, value } = Joi.object().keys({
        tableName: requiredStringWithoutWhitespace,
        columnName: requiredStringWithoutWhitespace,
        dataType: Joi.string().required().valid(...validSqlDataTypes),
        maxLength: Joi.number().min(0),
        allowNull: Joi.number().valid(0, 1),
        keepUnique: Joi.number().valid(1, 0),
        // isJoinColumn: Joi.number().valid(1, 0),
        // refTable: Joi.alternatives().conditional('isJoinColumn', {
        //     is: 1,
        //     then: requiredStringWithoutWhitespace,
        //     otherwise: Joi.any()
        // }),
        // refColumn: Joi.alternatives().conditional('isJoinColumn', {
        //     is: 1,
        //     then: requiredStringWithoutWhitespace,
        //     otherwise: Joi.any()
        // })
    }).validate(req.body);

    if(error) return res.status(405).json({
        type: 'VALIDATION ERROR', 
        error: error.message
    });
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
        allowNull: Joi.number().valid(0, 1),
        dataType: Joi.string().valid(...validSqlDataTypes),
        maxLength: Joi.number().min(0),
        keepUnique: Joi.number().valid(0, 1)
    }).validate(req.body);

    // if(value.dataType) {
    //     value.dataType = getSQLDataType(value.dataType, value.maxLength);
    // }

    if(error) return res.status(405).json({
        type: 'VALIDATION ERROR', 
        error: error.message
    });
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
        fields: Joi.array().items(Joi.string().valid(...datasetColumns)),
        sortBy: Joi.string().valid(...datasetColumns)
    }).validate(req.query);
    
    if(error) return res.status(405).json({
        type: 'VALIDATION ERROR', 
        error: error.message
    });
    req.query = value;
    next();
}

function verifyDeleteColumn (req, res, next) {
    if(!req.params.id) return res.status(405).json({
        type: 'VALIDATION ERROR',
        error: "Id is required"
    });
    next();
}

function verifyTableNameInParams (req, res, next) {
    const { error, value } = Joi.object().keys({
        tableName: requiredStringWithoutWhitespace
    }).validate(req.params);

    if(error) return res.status(405).json({
        type: 'VALIDATION ERROR', 
        error: error.message
    });
    req.params = value;
    next();
}

function verifyGetTablesByPageName (req, res, next) {
    const { error, value } = Joi.object().keys({
        pageName: requiredStringWithoutWhitespace
    }).validate(req.params);

    if(error) return res.status(405).json({
        type: 'VALIDATION ERROR', 
        error: error.message
    });
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
    verifyGetTablesByPageName, verifyTableNameInParams
}