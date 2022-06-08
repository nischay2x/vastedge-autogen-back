import mssql from "mssql";
import { sqlConfig } from "../keys.js";

export class DbQuery {
    query = '';
    tableName = '';

    constructor(table){
        this.tableName = table;
    }

    getQuery () {
        let temp = this.query;
        this.query = '';
        return temp;
    }

    insert (data) {
        let keyArray = [];
        let valuesArray = []; 
        Object.keys(data).forEach(k => {
            keyArray.push(k); valuesArray.push(`'${data[k]}'`)
        });
        this.query = `INSERT INTO ${this.tableName} (${keyArray.join(", ")}) VALUES (${valuesArray.join(", ")})`;
        return this;
    }

    select (fields) {
        let f = '';
        if(fields?.length) f = fields.join(", ");
        else f = '*';
        this.query = `SELECT ${f} FROM ${this.tableName}`;    
        return this;
    }

    delete () {
        this.query = `DELETE FROM ${this.tableName}`;
        return this;
    }

    sort (sortBy) {
        this.query = `${this.query} ORDER BY ${sortBy}`
        return this;
    }

    where (field, comparison, value) {
        this.query = `${this.query} WHERE ${field} ${comparison} '${value}'`
        return this;
    }

    andWhere (outer = []) {
        let singleCompares = [];
        outer.forEach(i => {
            singleCompares.push(`${i[0]} ${i[1]} ${i[2]}`)
        });
        this.query = `${this.query} WHERE ${singleCompares.join(" AND ")}`;
        return this;
    }

    limit (n) {
        this.query = `${this.query} FETCH NEXT ${n} ROWS ONLY`;
        return this;
    }

    offset (n) {
        this.query = `${this.query} OFFSET ${n} ROWS`
        return this;
    }

    set (data) {
        let setArray = [];
        Object.keys(data).forEach(k => {
            setArray.push(`${k} = '${data[k]}'`)
        });
        this.query = `UPDATE ${this.tableName} SET ${setArray.join(", ")}`
        return this; 
    }

    distinct (fields) {
        this.query = `SELECT DISTINCT ${fields.join(", ")} FROM ${this.tableName}`;
        return this;
    }
}

export default async (text, params) => mssql.connect(sqlConfig).then((pool) => {
    return pool.query(text)
})