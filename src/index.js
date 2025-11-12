import connect_Database from "./db/index.db.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

connect_Database()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log("server started",process.env.PORT);
    })
})
.catch((error)=>{
    console.log("DataBase connection failed!!");
})