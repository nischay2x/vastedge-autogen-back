const Joi = require('joi');

// inForm - true - designer & crud
// inForm - false - crud only


const requiredStringWithoutWhitespace = Joi.string().required().regex(/^(_|\d|\w)+$/);
const stringWithoutWhitespace = Joi.string().regex(/^(_|\d|\w)+$/);
const validInputFieldTypes = ['NUMBER', 'TEXT', 'EMAIL', 'PASSWORD', 'RADIO', 'CHECKBOX', 'DATE', 'TIME', 'DATETIME'];
const autogenDesignerColumnNames = ['id', 'tableName', 'columnName', 'pageName', 'label', 'applyFilter', 'fieldType'];


function verifyInsertColumnDetail (req, res, next) {
    let { error, value } = Joi.object().keys({
        pageName: requiredStringWithoutWhitespace,
        tableName: requiredStringWithoutWhitespace,
        columnName: requiredStringWithoutWhitespace,
        applyFilter: Joi.number().valid(1, 0).default(0),
        label: Joi.string().required().regex(/^(_|\d|\w|\s)+$/),
        displayMode: Joi.string().valid(...validInputFieldTypes).default('VARCHAR'),
        displayLength: Joi.number().min(1),
        isMaster: Joi.number().valid(0, 1),
        isJoinColumn: Joi.alternatives().conditional('isMaster', {
            is: 0,
            then: Joi.number().valid(0, 1),
            otherwise: Joi.number().valid(0)
        }),
        refTable: Joi.alternatives().conditional('isJoinColumn', {
            is: 1,
            then: requiredStringWithoutWhitespace,
            otherwise: Joi.string().valid("")
        }),
        refColumn: Joi.alternatives().conditional('isJoinColumn', {
            is: 1,
            then: requiredStringWithoutWhitespace,
            otherwise: Joi.string().valid("")
        })
    }).validate(req.body);

    if(error) return res.status(405).json({
        type: 'VALIDATION ERROR', 
        error: error.message
    });
    req.body = value;
    next();
}

function verifyGetColumnDetails (req, res, next) {
    if(req.query.fields){
        req.query.fields = req.query.fields.split(",")
    }
    const { error, value } = Joi.object().keys({
        limit: Joi.number(),
        offset: Joi.number(),
        fields: Joi.array().items(Joi.string().valid(...autogenDesignerColumnNames)),
        sortBy: Joi.string().valid(...autogenDesignerColumnNames),
        pageName: stringWithoutWhitespace
    }).validate(req.query);
    
    if(error) return res.status(405).json({
        type: 'VALIDATION ERROR', 
        error: error.message
    });

    req.query = value;
    next();
}

function verifyEditColumnDetail (req, res, next) {
    if(!req.params.id) return res.status(405).json({
        error: "Id is required"
    });

    let { error, value } = Joi.object().keys({
        columnName: stringWithoutWhitespace,
        applyFilter: Joi.number().valid(1, 0),
        label: Joi.string().regex(/^(_|\d|\w|\s)+$/),
        displayMode: Joi.string().valid(...validInputFieldTypes),
        displayLength: Joi.number().min(1),
        isJoinColumn: Joi.number().valid(0, 1),
        refTable: Joi.alternatives().conditional('isJoinColumn', {
            is: 1,
            then: requiredStringWithoutWhitespace,
            otherwise: Joi.string().valid("")
        }),
        refColumn: Joi.alternatives().conditional('isJoinColumn', {
            is: 1,
            then: requiredStringWithoutWhitespace,
            otherwise: Joi.string().valid("")
        })
    }).validate(req.body);

    if(error) return res.status(405).json({
        type: 'VALIDATION ERROR', 
        error: error.message
    });

    req.body = value;
    next();
}

function verifyDeleteColumnDetail (req, res, next) {
    if(!req.params.id) return res.status(405).json({
        type: "VALIDATION ERROR",
        error: "Id is required"
    });
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

function verifyGetColumnDetailsByTableName (req, res, next) {
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


// utilities
function getSQLDataType (type, length) {
    switch(type){
        case 'STRING': return (length) ? `VARCHAR\(${length}\)` : 'TEXT';
        case 'NUMBER': return 'INT'; 
        case 'DECIMAL': return (length) ? `FLOAT\(${length}\)` : 'REAL'; 
        case 'FILE': return 'VARBINARY(MAX)';
        default: return type;
    }
}

module.exports = {
    verifyInsertColumnDetail, verifyGetColumnDetails, verifyEditColumnDetail, 
    verifyDeleteColumnDetail, verifyGetColumnDetailsByTableName, verifyGetTablesByPageName
}