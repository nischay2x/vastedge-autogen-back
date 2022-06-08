class AutogenDesigner {
    constructor(obj) {
        this.id = obj.id;
        this.tableName = obj.tableName;
        this.columnName = obj.columnName;
        this.pageName = obj.pageName;
        this.applyFilter = obj.applyFilter;
        this.label = obj.label;
        this.fieldType = obj.fieldType
    }
}
module.exports = AutogenDesigner;