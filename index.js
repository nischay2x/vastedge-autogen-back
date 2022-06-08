import express from "express";
const app = express();

import designerRoute from "./routes/autogenDesigner.js";
import crudRoute from "./routes/autogenCrud.js";

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/designer", designerRoute);
app.use("/crud", crudRoute);

app.listen(5000, (err) => {
    if (err) console.log(err);
    else {
        console.log("Server on 5000");
    }
})


