import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectTomongoDb from './config/database.js';
import apiRoutes from './routes/index.js';
import cors from "cors";

dotenv.config();
const app=express();
// app.use(express.json());
const PORT=process.env.PORT || 8000;
app.use(cors({
    origin: 'http://localhost:5173', // Allow your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true // Allow cookies if needed
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/api", apiRoutes);
app.listen(PORT,()=>{
    connectTomongoDb();
    console.log(`server started on the port:${PORT}`);
    
})
