import express from "express";
import mssql from "mssql";

const app = express();

const sqlConfig = {
    server: "vastedge.database.windows.net",
    port: 1433,
    user: "nischay2x",
    password: "Nischayx@2",
    database: "vastedge"
};

mssql.connect(sqlConfig, (err) => {
    if(err) console.log(err);
    else {
        app.listen(5000, (err) => {
            if(err) console.log(err);
            else console.log("Server on 5000");
        })
    }
})


