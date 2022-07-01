const express = require("express");
const app = express();
require('dotenv').config();
const cors = require('cors');


const designerRoute = require("./routes/autogenDesigner.js");
const datasetRoute = require("./routes/autogenDataset.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/designer", designerRoute);
app.use("/dataset", datasetRoute);

app.listen(5000, (err) => {
    if (err) console.log(err);
    else {
        console.log("Server on 5000");
    }
})


