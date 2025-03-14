import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import config from "./config/config";
import morgan from "morgan"; // Http request logger, help debug

// Import routes
import authRoutes from "./routes/auth";
import accessCodesRouter from "./routes/accessCodes";

// Configuration
const app = express();
const HOST: string = config.HOST;
const PORT: number = config.PORT;

app.use(express.json());
app.use(morgan("common"));

// Use routes
app.use("/auth", authRoutes);
app.use("/access-codes", accessCodesRouter);

// Listener
app.listen(PORT, HOST, () => {
  console.log(`Elite Space App is listening on port ${PORT} of ${HOST}!`);
});
