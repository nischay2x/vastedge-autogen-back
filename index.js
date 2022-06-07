import express from "express";
const app = express();

import masterRoute from "./routes/autogenDesigner.js";

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/master", masterRoute);

app.listen(5000, (err) => {
    if (err) console.log(err);
    else {
        console.log("Server on 5000");
    }
})


