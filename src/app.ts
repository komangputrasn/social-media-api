import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Router } from "express";
import helmet from "helmet";
import morgan from "morgan";
import utilsHandlers from "./handlers/utilsHandler";
import authRoute from "./routes/authRoute";
import profileRoute from "./routes/profileRoute";
import followRoute from "./routes/followRoute";

// Load environment variables
dotenv.config();

// Create Express application
const app: Application = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS\
app.use(express.json());
app.use(morgan("combined")); // Logging
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Root router
const root = Router();
root.use("/auth", authRoute);
root.use("/profile", profileRoute);
root.use("/follow", followRoute);

app.use("/v1", root);

// Basic route
app.get("/", utilsHandlers.root);

// Health check endpoint
app.get("/health", utilsHandlers.healthCheck);

// 404 handler
app.use(utilsHandlers.notFound);

// Global error handler
app.use(utilsHandlers.internalServerError);

// Auth router

export default app;
