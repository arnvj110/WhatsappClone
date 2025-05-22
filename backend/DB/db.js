import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGO_URI;

export const Connection = async() => {
    try{
        await mongoose.connect(url);
        console.log("MongoDB connected successfully!");
    } catch(error){
        console.log(error);
    }
}