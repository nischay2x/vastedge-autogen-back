export default class AutogenCrud {
    constructor(obj) {
        this.id = obj.id;
        this.tableName = obj.tableName;
        this.columnName = obj.columnName;
        this.dataType = obj.dataType;
        this.nullConstrain = obj.nullConstrain;
    }
}