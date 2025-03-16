import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import config from "./config/config";
import morgan from "morgan"; // Http request logger, help debug
import { requiresAuthentication } from "./middleware/authMiddleware";

// Import routes
import authRoutes from "./routes/auth";
import leaseRoutes from "./routes/leases";
import { complaintRoutes } from "./routes/complaints";

import cors from "cors";
// Configuration
const app = express();
const HOST: string = config.HOST;
const PORT: number = config.PORT;

// Allows us to set new property `user` for Request object throughout this project
// Ex: req.user will have info from users table, NOT from tenants table.
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser()); // Enables reading cookies from req.cookies

// Allows request from frontend
app.use(cors({ origin: "http://localhost:5173" }));

//Allows frontend to communicate with backend
app.use(cors({ origin: "http://localhost:5173" }));
// Use routes
app.use("/auth", authRoutes);
app.use("/complaints", complaintRoutes);
app.use("/leases", requiresAuthentication, leaseRoutes);

// Listener
app.listen(PORT, HOST, () => {
  console.log(`Elite Space App is listening on port ${PORT} of ${HOST}!`);
});
