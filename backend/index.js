import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';   
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js";
dotenv.config({})

const app= express();

let port=process.env.port || 5000;




app.get("/home",(req,res)=>{
    return res.status(200).json({
        message:"i am comming frnom backend",
        success:'true'
    })
})


//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173', // ✅ Fix the typo (http → http**:**)
    credentials: true // ✅ Lowercase "credentials"
};
app.use(cors(corsOptions));



// making the api
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute)

//http://localhost:8000/api/v1/user/register



 
app.listen(port, () => {
    connectDB()
    console.log(`listening port${port}`);
});
