import Joi from "joi";

// inForm - true - designer & crud
// inForm - false - crud only


const requiredStringWithoutWhitespace = Joi.string().required().regex(/^(_|\d|\w)+$/);
const stringWithoutWhitespace = Joi.string().regex(/^(_|\d|\w)+$/);
const validInputFieldTypes = ['NUMBER', 'TEXT', 'EMAIL', 'PASSWORD', 'RADIO', 'CHECKBOX', 'DATE', 'TIME', 'DATETIME'];
const autogenDesignerColumnNames = ['id', 'tableName', 'columnName', 'pageName', 'label', 'applyFilter', 'fieldType'];
const validSqlDataTypes = ['STRING', 'NUMBER', 'BOOLEAN', 'DATE', 'TIME', 'DATETIME', 'FILE', 'IMAGE', 'DECIMAL', 'MONEY'];


export function verifyInsertColumnDetail (req, res, next) {
    let { error, value } = Joi.object().keys({
        pageName: requiredStringWithoutWhitespace,
        tableName: requiredStringWithoutWhitespace,
        columnName: requiredStringWithoutWhitespace,
        applyFilter: Joi.number().valid(1, 0).required().default(0),
        label: Joi.string().required().regex(/^(_|\d|\w|\s)+$/),
        fieldType: Joi.string().valid(...validInputFieldTypes).default('TEXT'),
        nullConstrain: Joi.number().valid(0, 1).default(0),
        dataType: Joi.string().required().valid(...validSqlDataTypes).default('STRING'),
        dataLength: Joi.number().min(1).default(20),
        keepInForm: Joi.boolean().default(true)
    }).validate(req.body);

    if(error) return res.status(405).json(error);
    value.dataType = getSQLDataType(value.dataType, value.dataLength);

    const { 
        pageName, tableName, columnName, applyFilter,
        label, fieldType, nullConstrain, dataType 
    } = value;

    req.design = { pageName, tableName, columnName, applyFilter, label, fieldType };
    req.crud = { tableName, dataType, nullConstrain, columnName }

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
        fields: Joi.array().items(Joi.string().valid(...autogenDesignerColumnNames)),
        sortBy: Joi.string().valid(...autogenDesignerColumnNames)
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
        pageName: stringWithoutWhitespace,
        tableName: stringWithoutWhitespace,
        columnName: stringWithoutWhitespace,
        applyFilter: Joi.number().valid(1, 0),
        label: Joi.string().regex(/^(_|\d|\w|\s)+$/),
        fieldType: Joi.string().valid(...validInputFieldTypes),
        nullConstrain: Joi.number().valid(0, 1),
        dataType: Joi.string().valid(...validSqlDataTypes),
        dataLength: Joi.number().min(1)
    }).validate(req.body);

    if(error) return res.status(405).json(error);
    if(value.dataType){
        value.dataType = getSQLDataType(value.dataType, value.dataLength);
    }

    delete value.dataType;
    req.design = {};
    req.crud = {};

    Object.keys(value).forEach(k => {
        if(autogenDesignerColumnNames.includes(k)){
            req.design[k] = value[k];
        } else {
            req.crud[k] = value[k];
        }
    })

    req.body = value;
    next();
}

export function verifyDeleteColumnDetail (req, res, next) {
    if(!req.params.id) return res.status(405).json({
        error: "Id is required"
    });
    next();
}

export function verifyGetColumnDetailsByTableName (req, res, next) {
    const { error, value } = Joi.object().keys({
        tableName: requiredStringWithoutWhitespace
    }).validate(req.params);

    if(error) return res.status(405).json(error);
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