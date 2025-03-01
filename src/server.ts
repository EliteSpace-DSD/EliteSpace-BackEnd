import express, { application } from 'express';
import config from "./config/config";
import morgan from 'morgan'; // Http request logger, help debug

// Import routes
import authRoutes from "./routes/auth";

// Configuration
const app = express();
const HOST: string = config.HOST;
const PORT: number = config.PORT;

app.use(morgan("common"));

// Use routes
app.use(authRoutes);

// Listener
app.listen(PORT, HOST, () => {
    console.log(`Elite Space App is listening on port ${PORT} of ${HOST}!`);
})