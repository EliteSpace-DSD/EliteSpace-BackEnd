import express, { application } from 'express';
import config from "./config/config";
import morgan from 'morgan'; // Http request logger, help debug
import cors from 'cors';

// Import routes
import authRoutes from "./routes/auth";

// Configuration
const app = express();
const HOST: string = config.HOST;
const PORT: number = config.PORT;

app.use(express.json());
app.use(morgan("common"));

// Allows request from frontend
app.use(cors({origin: "http://localhost:5173"}));

// Use routes
app.use('/auth', authRoutes);

// Listener
app.listen(PORT, HOST, () => {
    console.log(`Elite Space App is listening on port ${PORT} of ${HOST}!`);
})