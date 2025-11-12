import mongoose from "mongoose"
import {DB_NAME} from "../constants.js";



const connect_Database=async() =>{
    try{
        await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`);
        console.log("DataBase Connected.");
    }catch(error){
        console.log("DataBase Connection Failed!!");
        throw (error);
    }
};

export default connect_Database;