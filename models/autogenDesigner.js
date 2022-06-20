class AutogenDesigner {
    constructor(obj) {
        this.id = obj.id;
        this.tableName = obj.tableName;
        this.columnName = obj.columnName;
        this.pageName = obj.pageName;
        this.applyFilter = obj.applyFilter;
        this.label = obj.label;
        this.displayMode = obj.displayMode;
        this.isMaster = obj.isMaster;
        this.displayLength = obj.displayLength;
    }
}
module.exports = AutogenDesigner;