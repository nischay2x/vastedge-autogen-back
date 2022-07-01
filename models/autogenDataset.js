class AutogenCrud {
    constructor(obj) {
        this.id = obj.id;
        this.tableName = obj.tableName;
        this.columnName = obj.columnName;
        this.dataType = obj.dataType;
        this.maxLength = obj.maxLength;
        this.allowNull = obj.allowNull;
        this.keepUnique = obj.keepUnique
    }
}

module.exports = AutogenCrud;