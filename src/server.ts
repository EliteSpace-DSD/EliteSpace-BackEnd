import express, { application } from "express";
import config from "./config/config";
import morgan from "morgan"; // Http request logger, help debug

// Import routes
import authRoutes from "./routes/auth";
import miscRoutes from "./routes/miscRoutes";

import cors from "cors";
// Configuration
const app = express();
const HOST: string = config.HOST;
const PORT: number = config.PORT;

app.use(morgan("common"));

//Allows frontend to communicate with backend
app.use(cors({ origin: "http://localhost:5173" }));
// Use routes
app.use(authRoutes);
app.use("/api", miscRoutes);

// Listener
app.listen(PORT, HOST, () => {
  console.log(`Elite Space App is listening on port ${PORT} of ${HOST}!`);
});
