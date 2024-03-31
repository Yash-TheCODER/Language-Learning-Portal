// creating server
const express = require('express');
const app = express();
const mysql2 = require('mysql2');
const cors = require('cors')
require('dotenv').config(); 
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;

// middleware parsing
app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.listen(PORT,() => {
    console.log(`Started Successfully at port ${PORT}`);
})

app.get("/",(req,res) => {
    res.send("This is My DBMS Project HomePage");
})

// mount
const Upload = require('./routes/user');
app.use("/api/v1",Upload);



