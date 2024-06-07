const express = require("express");
const app = express();
const fs = require("fs");
const extractPatientData = require("./index");

app.use(express.json());
require("./dicoogleClient")

app.post("/patients/details", async (req, res) => {
    try {
        const htmlContent = fs.readFileSync("./index.html", "utf-8");
        let patientData = await extractPatientData(htmlContent);
        if (patientData[0]) {
            patientData.shift();
        }
        res.send(JSON.stringify(patientData, null, 2));
        // res.send({
        //     success:true,
        //     message:"Get Patients data successfuly!",
        //     data : JSON.stringify(patientData, null, 2)
        // });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving data",
        }); 
    }
});

app.listen("3000", () => {
    console.log("successfully !");
});
