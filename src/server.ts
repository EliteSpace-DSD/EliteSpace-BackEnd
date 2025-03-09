import express, {Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import config from "./config/config";
import morgan from 'morgan'; // Http request logger, help debug
import cors from 'cors';

// Import routes
import authRoutes from "./routes/auth";

// Configuration
const app = express();
const HOST: string = config.HOST;
const PORT: number = config.PORT;

// Allows us to set new property `user` for Request object throughout this project
// Ex: req.user
declare module "express-serve-static-core" {
    interface Request {
      user?: any;
    }
  }

app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser()); // Enables reading cookies from req.cookies

// Allows request from frontend
app.use(cors({origin: "http://localhost:5173"}));

// Use routes
app.use('/auth', authRoutes);

// Listener
app.listen(PORT, HOST, () => {
    console.log(`Elite Space App is listening on port ${PORT} of ${HOST}!`);
})