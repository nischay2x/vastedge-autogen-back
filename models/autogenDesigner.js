export default class AutogenDesigner {
    constructor(obj) {
        this.id = obj.id;
        this.tableName = obj.tableName;
        this.columnName = obj.columnName;
        this.pageName = obj.pageName;
        this.dataType = obj.dataType;
        this.applyFilter = obj.applyFilter;
        this.label = obj.label;
    }
}