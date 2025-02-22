import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectTomongoDb from './config/database.js';
import apiRoutes from './routes/index.js';
import cors from 'cors';
import { createServer } from 'http';
import { initializeSocket } from '../socket.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io
initializeSocket(server);

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

server.listen(PORT, () => {
    connectTomongoDb();
    console.log(`Server started on port: ${PORT}`);
});
