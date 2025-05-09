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
import parkingRoutes from "./routes/parking";
import accessCodesRoutes from "./routes/accessCodes";
import smartPackageRoutes from "./routes/smartPackage";
import demoRoutes from "./routes/demo";
import lockRoutes from "./routes/locks";


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

// Allows request from frontend AND local, dynamic
const allowedOrigins = [
  "http://localhost:5173",
  "https://elitespace.netlify.app",
  "https://elitespace-dev.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || // allow non-browser tools like curl/Postman
        allowedOrigins.includes(origin) ||
        /^https:\/\/.*elitespace(-dev)?\.netlify\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Use routes
app.use("/auth", authRoutes);
app.use("/leases", requiresAuthentication, leaseRoutes);
app.use("/locks", requiresAuthentication, lockRoutes);
app.use("/parking", requiresAuthentication, parkingRoutes);
app.use("/complaints", requiresAuthentication, complaintRoutes);
app.use("/accessCodes", requiresAuthentication, accessCodesRoutes);
app.use("/smartpackage", requiresAuthentication, smartPackageRoutes);
app.use("/demo", demoRoutes);

// Listener
app.listen(PORT, HOST, () => {
  console.log(`Elite Space App is listening on port ${PORT} of ${HOST}!`);
});
