import express, {
  Application,
  Request,
  Response,
  NextFunction,
  Router,
} from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import utilsHandlers from "./handlers/utilsHandler";
import authRoute from "./routes/authRoute";
import bodyParser from "body-parser";

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

app.use("/auth", authRoute);

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
