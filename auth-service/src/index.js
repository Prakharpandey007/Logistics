import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectTomongoDb from './config/database.js';
dotenv.config();
const app=express();
const PORT=process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.listen(PORT,()=>{
    connectTomongoDb();
    console.log(`server started on the port:${PORT}`);
    
})
