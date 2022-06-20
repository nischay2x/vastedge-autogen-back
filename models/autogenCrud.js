class AutogenCrud {
    constructor(obj) {
        this.id = obj.id;
        this.tableName = obj.tableName;
        this.columnName = obj.columnName;
        this.dataType = obj.dataType;
        this.maxLength = obj.maxLength;
        this.nullConstrain = obj.nullConstrain;
    }
}

module.exports = AutogenCrud;