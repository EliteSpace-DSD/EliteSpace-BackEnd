import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import config from "./config/config";
import morgan from "morgan"; // Http request logger, help debug
import cors from "cors";
import { requiresAuthentication } from "./middleware/authMiddleware";

// Import routes
import authRoutes from "./routes/auth";
import leaseRoutes from "./routes/leases";
import { complaintRoutes } from "./routes/complaints";
import accessCodesRoutes from "./routes/accessCodes";
import smartPackgeRoutes from "./routes/smartPackage";

// Configuration
const app = express();
const HOST: string = config.HOST;
const PORT: number = config.PORT;

// Allows us to set new property `user` for Request object throughout this project
// Ex: req.user will have info from users table, NOT from tenants table.
// Ex2: req.tenant will have info from tenants table.
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
    tenant?: any;
  }
}

app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser()); // Enables reading cookies from req.cookies

// Allows request from frontend
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Use routes
app.use("/auth", authRoutes);
app.use("/leases", requiresAuthentication, leaseRoutes);
app.use("/complaints", complaintRoutes);
app.use("/accessCodes", accessCodesRoutes);
app.use('/smartpackage', requiresAuthentication, smartPackgeRoutes);

// Listener
app.listen(PORT, HOST, () => {
  console.log(`Elite Space App is listening on port ${PORT} of ${HOST}!`);
});
